import type { ApiError, ApiPagination, HttpResponse } from '../types/api';

export class HttpError extends Error implements ApiError {
  constructor(
    public readonly code: string,
    message: string,
    public readonly retryable: boolean,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

interface HttpClientOptions {
  baseUrl: string;
  fetch?: typeof fetch;
  timeoutMs?: number;
  development?: boolean;
}

export interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

const invalidConfig = () => new HttpError('INVALID_CONFIG', 'La configuración de la API no es válida.', false);
const invalidResponse = (status: number) => new HttpError('INVALID_RESPONSE', 'La API devolvió una respuesta no válida.', false, status);
const isObject = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value);

export function createHttpClient(options: HttpClientOptions) {
  let base: URL;
  try { base = new URL(options.baseUrl); } catch { throw invalidConfig(); }
  const development = options.development ?? __DEV__;
  if (!['http:', 'https:'].includes(base.protocol) || (!development && base.protocol !== 'https:') ||
    base.username || base.password || base.search || base.hash || !/^\/api\/v1\/?$/.test(base.pathname)) {
    throw invalidConfig();
  }
  base.pathname = '/api/v1/';
  const timeoutMs = options.timeoutMs ?? 15000;
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw invalidConfig();
  const fetchRequest = options.fetch ?? fetch;

  async function request<T>(path: string, init: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    // Paths son relativos al contrato; no aceptar un host alternativo ni escapar del prefijo.
    const pathname = path.split('?')[0];
    if (!pathname || /[:\\]/.test(pathname) || path.includes('#') || path.startsWith('//') || /^\/?api\/v1(?:\/|$)/.test(pathname)) throw invalidConfig();
    let decoded: string;
    try { decoded = decodeURIComponent(pathname); } catch { throw invalidConfig(); }
    if (decoded.split('/').some((part) => part === '.' || part === '..') || /[\\]/.test(decoded)) throw invalidConfig();
    const url = new URL(path.replace(/^\//, ''), base);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) throw invalidConfig();
    if (init.signal?.aborted) throw new HttpError('CANCELLED', 'La solicitud fue cancelada.', false);
    const headers = new Headers(init.headers);
    headers.set('Accept', 'application/json');
    let body: string | undefined;
    if (init.body !== undefined) {
      try { body = JSON.stringify(init.body); } catch { throw invalidConfig(); }
      headers.set('Content-Type', 'application/json');
    }
    const controller = new AbortController();
    let rejectCancellation: (error: HttpError) => void = () => {};
    const cancellation = new Promise<never>((_resolve, reject) => { rejectCancellation = reject; });
    let cancellationError: HttpError | undefined;
    const cancel = (error: HttpError) => {
      if (cancellationError) return;
      cancellationError = error;
      rejectCancellation(error);
      controller.abort();
    };
    const onAbort = () => cancel(new HttpError('CANCELLED', 'La solicitud fue cancelada.', false));
    init.signal?.addEventListener('abort', onAbort, { once: true });
    const timer = setTimeout(() => cancel(new HttpError('TIMEOUT', 'La solicitud superó el tiempo de espera.', true)), timeoutMs);
    try {
      const operation = async (): Promise<HttpResponse<T>> => {
        const response = await fetchRequest(url.toString(), { method: init.method ?? 'GET', headers, body, signal: controller.signal });
        if (response.status === 204) return { status: 204, data: undefined };
        let envelope: unknown;
        try { envelope = await response.json(); } catch { throw invalidResponse(response.status); }
        if (!isObject(envelope)) throw invalidResponse(response.status);
        if (!response.ok) {
          const error = envelope.error;
          if (!isObject(error) || typeof error.code !== 'string' || !error.code || typeof error.message !== 'string' || typeof error.retryable !== 'boolean') throw invalidResponse(response.status);
          throw new HttpError(error.code, error.message, error.retryable, response.status);
        }
        if (!Object.prototype.hasOwnProperty.call(envelope, 'data') || 'error' in envelope) throw invalidResponse(response.status);
        let pagination: ApiPagination | undefined;
        if (envelope.pagination !== undefined) {
          const page = envelope.pagination;
          if (!isObject(page) || !['page', 'pageSize', 'totalItems', 'totalPages'].every((key) => typeof page[key] === 'number' && Number.isInteger(page[key]) && (page[key] as number) >= 0)) throw invalidResponse(response.status);
          pagination = page as unknown as ApiPagination;
        }
        return { status: response.status, data: envelope.data as T, ...(pagination ? { pagination } : {}) };
      };
      return await Promise.race([operation(), cancellation]);
    } catch (error) {
      if (cancellationError) throw cancellationError;
      if (error instanceof HttpError) throw error;
      throw new HttpError('NETWORK_ERROR', 'No se pudo conectar con la API. Verificá tu conexión.', true);
    } finally {
      clearTimeout(timer);
      init.signal?.removeEventListener('abort', onAbort);
    }
  }
  return { request };
}

/** Usa la misma validación del transporte antes de habilitar navegación; no consulta red. */
export function getApiConfigurationError(): HttpError | null {
  try {
    createHttpClient({ baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? '' });
    return null;
  } catch (error) {
    if (error instanceof HttpError && error.code === 'INVALID_CONFIG') return error;
    throw error;
  }
}

// Cada request conserva la validación, incluso si se usa fuera del entrypoint.
export const httpClient = {
  async request<T>(path: string, options?: HttpRequestOptions): Promise<HttpResponse<T>> {
    return createHttpClient({ baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? '' }).request<T>(path, options);
  },
};
