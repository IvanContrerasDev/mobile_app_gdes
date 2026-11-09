import { HttpError, type HttpRequestOptions } from './httpClient';
import type { HttpResponse } from '../types/api';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  role: 'EMPLOYEE';
}
export interface Tokens { accessToken: string; refreshToken: string; expiresIn: number }
export interface StoredSession { version: 1; user: AuthUser; tokens: Tokens }
export interface LoginChallenge { otpRequired: true; challengeId: string }
export interface SessionState { user: AuthUser | null; isAuthenticated: boolean; hydrated: boolean; error: string | null }
export interface SessionRepository { read(): Promise<unknown>; write(value: StoredSession): Promise<void>; clear(): Promise<void> }
interface Dependencies {
  http: { request<T>(path: string, init?: HttpRequestOptions): Promise<HttpResponse<T>> };
  repository: SessionRepository;
  clearLegacy(): Promise<void>;
  onChange(state: SessionState): void;
  onAccountChange(owner: string | null): void;
}
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const invalid = () => new HttpError('INVALID_RESPONSE', 'La API devolvió datos de sesión no válidos.', false);
const cancelled = () => new HttpError('CANCELLED', 'La sesión cambió. Iniciá sesión nuevamente.', false);
const sessionForbidden = (error: HttpError) => error.status === 403 && ['ACCOUNT_INACTIVE', 'ROLE_NOT_ALLOWED'].includes(error.code);
function identity(v: unknown): Omit<AuthUser, 'role'> {
  if (!object(v) || !['id', 'firstName', 'lastName', 'email', 'employeeId'].every(k => text(v[k]))) throw invalid();
  return { id: v.id as string, firstName: v.firstName as string, lastName: v.lastName as string, email: v.email as string, employeeId: v.employeeId as string };
}
function employee(v: unknown): AuthUser {
  if (!object(v) || v.role !== 'EMPLOYEE') throw new HttpError('ROLE_NOT_ALLOWED', 'Solo empleados pueden acceder a esta aplicación.', false, 403);
  return { ...identity(v), role: 'EMPLOYEE' };
}
function tokenPair(v: unknown): Tokens {
  if (!object(v) || !text(v.accessToken) || !text(v.refreshToken) || typeof v.expiresIn !== 'number' || !Number.isFinite(v.expiresIn) || v.expiresIn <= 0) throw invalid();
  return { accessToken: v.accessToken, refreshToken: v.refreshToken, expiresIn: v.expiresIn };
}
function stored(v: unknown): StoredSession {
  if (!object(v) || v.version !== 1) throw invalid();
  return { version: 1, user: employee(v.user), tokens: tokenPair(v.tokens) };
}

/** Una instancia por runtime. No publica identidad hasta OTP o validación server-side del perfil. */
export function createSessionCoordinator(deps: Dependencies) {
  let state: SessionState = { user: null, isAuthenticated: false, hydrated: false, error: null };
  let session: StoredSession | null = null;
  let epoch = 0;
  let challenge: string | null = null;
  let controller = new AbortController();
  let refreshFlight: { epoch: number; promise: Promise<void> } | null = null;
  let bootstrapFlight: Promise<void> | null = null;
  let storageTail: Promise<unknown> = Promise.resolve();
  const publish = (changes: Partial<SessionState>) => { state = { ...state, ...changes }; deps.onChange(state); };
  publish({});
  const check = (generation: number) => { if (epoch !== generation) throw cancelled(); };
  // Serializa escrituras y borrados: logout siempre queda detrás de un guardado ya comenzado.
  function storage<T>(operation: () => Promise<T>): Promise<T> {
    const result = storageTail.then(operation);
    storageTail = result.catch(() => {});
    return result;
  }
  function reset(error: string | null = null) {
    epoch++;
    controller.abort(); controller = new AbortController();
    refreshFlight = null; session = null; challenge = null;
    deps.onAccountChange(null);
    publish({ user: null, isAuthenticated: false, hydrated: true, error });
    return epoch;
  }
  async function discard(generation: number, error: unknown) {
    if (epoch !== generation) return;
    reset(error instanceof Error ? error.message : 'La sesión terminó. Iniciá sesión nuevamente.');
    try { await storage(() => deps.repository.clear()); }
    catch { publish({ error: 'No se pudo limpiar el almacenamiento seguro. Reintentá cerrar sesión.' }); }
  }
  async function save(value: StoredSession, generation: number) {
    await storage(async () => { check(generation); await deps.repository.write(value); });
    check(generation);
  }
  async function refresh(generation: number) {
    check(generation);
    if (refreshFlight?.epoch === generation) return refreshFlight.promise;
    const current = session;
    if (!current) throw cancelled();
    const promise = (async () => {
      try {
        // El par anterior deja de ser restaurable ANTES de consumir refresh. Una respuesta
        // perdida o un setItem fallido nunca restaura una credencial ya rotada.
        await storage(async () => { check(generation); await deps.repository.clear(); });
        check(generation);
        const result = await deps.http.request<unknown>('/auth/refresh', { method: 'POST', body: { refreshToken: current.tokens.refreshToken }, signal: controller.signal });
        check(generation);
        if (result.status !== 200 || !object(result.data)) throw invalid();
        const next: StoredSession = { ...current, tokens: tokenPair(result.data.tokens) };
        await save(next, generation);
        session = next;
      } catch (error) { await discard(generation, error); throw error; }
    })();
    refreshFlight = { epoch: generation, promise };
    try { await promise; } finally { if (refreshFlight?.promise === promise) refreshFlight = null; }
  }
  async function request<T>(path: string, init: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    const generation = epoch;
    if (!session) throw new HttpError('SESSION_REQUIRED', 'Iniciá sesión para continuar.', false, 401);
    // Una solicitud nueva espera una rotación en curso; nunca sale con un par consumido.
    if (refreshFlight?.epoch === generation) await refreshFlight.promise;
    check(generation);
    const access = session!.tokens.accessToken;
    async function send(token: string) {
      check(generation);
      const headers = new Headers(init.headers); headers.set('Authorization', `Bearer ${token}`);
      const combined = new AbortController();
      const abort = () => combined.abort();
      const accountSignal = controller.signal;
      accountSignal.addEventListener('abort', abort, { once: true });
      init.signal?.addEventListener('abort', abort, { once: true });
      if (accountSignal.aborted || init.signal?.aborted) combined.abort();
      try {
        const result = await deps.http.request<T>(path, { ...init, headers, signal: combined.signal });
        check(generation); return result;
      } finally {
        accountSignal.removeEventListener('abort', abort); init.signal?.removeEventListener('abort', abort);
      }
    }
    try { return await send(access); }
    catch (error) {
      check(generation);
      if (!(error instanceof HttpError)) throw error;
      if (sessionForbidden(error)) { await discard(generation, error); throw error; }
      if (error.status !== 401) throw error;
      if (session?.tokens.accessToken === access) await refresh(generation);
      check(generation);
      // No repetir mutaciones de forma implícita; el consumidor conserva su intención/ID.
      if (init.method && init.method !== 'GET') throw new HttpError('SESSION_RETRY_REQUIRED', 'Sesión renovada. Reintentá la operación.', false);
      try { return await send(session!.tokens.accessToken); }
      catch (retryError) {
        if (retryError instanceof HttpError && (retryError.status === 401 || sessionForbidden(retryError))) await discard(generation, retryError);
        throw retryError;
      }
    }
  }
  async function bootstrap() {
    if (bootstrapFlight) return bootstrapFlight;
    if (state.hydrated) return;
    const generation = epoch;
    bootstrapFlight = (async () => {
      try {
        await deps.clearLegacy(); check(generation);
        const value = await storage(() => deps.repository.read()); check(generation);
        if (value === null) { publish({ hydrated: true }); return; }
        session = stored(value);
        const result = await request<unknown>('/profile'); check(generation);
        if (result.status !== 200) throw invalid();
        const profile = identity(result.data);
        if (profile.id !== session!.user.id) throw invalid();
        // /profile está protegido por JwtAuthGuard + Roles(EMPLOYEE); no exigir role ausente del DTO.
        const verified: StoredSession = { ...session!, user: { ...profile, role: 'EMPLOYEE' } };
        await save(verified, generation); session = verified;
        deps.onAccountChange(verified.user.id);
        publish({ user: verified.user, isAuthenticated: true, hydrated: true, error: null });
      } catch (error) { await discard(generation, error); }
      finally { if (epoch === generation) publish({ hydrated: true }); }
    })();
    try { await bootstrapFlight; } finally { bootstrapFlight = null; }
  }
  async function login(identifier: string, password: string): Promise<LoginChallenge> {
    const generation = reset();
    await storage(() => deps.repository.clear()); check(generation);
    const result = await deps.http.request<unknown>('/auth/login', { method: 'POST', body: { identifier: identifier.trim(), password, client: 'MOBILE' }, signal: controller.signal });
    check(generation);
    if (result.status !== 202 || !object(result.data) || result.data.otpRequired !== true || !text(result.data.challengeId)) throw invalid();
    challenge = result.data.challengeId;
    return { otpRequired: true, challengeId: challenge };
  }
  async function verify(challengeId: string, code: string) {
    const generation = epoch;
    if (!challenge || challenge !== challengeId) throw cancelled();
    const result = await deps.http.request<unknown>('/auth/otp/verify', { method: 'POST', body: { challengeId, code }, signal: controller.signal });
    check(generation);
    if (result.status !== 200 || !object(result.data)) throw invalid();
    const next: StoredSession = { version: 1, user: employee(result.data.user), tokens: tokenPair(result.data.tokens) };
    try { await save(next, generation); }
    catch (error) { await discard(generation, error); throw error; }
    session = next; challenge = null;
    deps.onAccountChange(next.user.id);
    publish({ user: next.user, isAuthenticated: true, hydrated: true, error: null });
  }
  async function resend(challengeId: string) {
    const generation = epoch;
    if (!challenge || challenge !== challengeId) throw cancelled();
    const result = await deps.http.request<unknown>('/auth/otp/resend', { method: 'POST', body: { challengeId }, signal: controller.signal });
    check(generation);
    if (result.status !== 202 || !object(result.data) || result.data.sent !== true) throw invalid();
  }
  async function logout() {
    const access = session?.tokens.accessToken;
    const generation = reset();
    // Revocación con bearer anterior; nunca refrescar para logout ni afectar un login posterior.
    const unconfirmed = 'Sesión local cerrada. No se pudo confirmar la revocación remota.';
    const revocation = access
      ? deps.http.request('/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${access}` } })
        .then(result => result.status === 204 ? null : unconfirmed, () => unconfirmed)
      : Promise.resolve(null);
    try { await storage(() => deps.repository.clear()); }
    catch { if (epoch === generation) publish({ error: 'No se pudo limpiar el almacenamiento seguro. Reintentá cerrar sesión.' }); throw new HttpError('SECURE_STORAGE_ERROR', 'No se pudo limpiar el almacenamiento seguro.', true); }
    const warning = await revocation;
    if (warning && epoch === generation) publish({ error: warning });
  }
  return { bootstrap, login, verify, resend, logout, request };
}
