const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync, existsSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const filename = require('node:path').join(__dirname, 'httpClient.ts');
// El fallo inicial expresa la capacidad ausente antes de implementar el cliente.
const exportsObject = {};
if (existsSync(filename)) {
  const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  vm.runInNewContext(outputText, { exports: exportsObject, URL, Headers, AbortController, setTimeout, clearTimeout, process, fetch, __DEV__: true });
}
const { createHttpClient } = exportsObject;
const baseUrl = 'http://192.168.1.10:3000/api/v1/';
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const client = (fetch, extra = {}) => createHttpClient({ baseUrl, fetch, ...extra });
const errorIs = (code, retryable, status) => (error) => {
  assert.equal(error.code, code);
  assert.equal(error.retryable, retryable);
  if (status !== undefined) assert.equal(error.status, status);
  return true;
};

test('valida base configurada, prefijo y transporte seguro', () => {
  assert.equal(typeof createHttpClient, 'function');
  for (const baseUrl of ['', 'foo', 'https://api.example.com', 'ftp://api.example.com/api/v1', 'https://user:pass@api.example.com/api/v1', 'https://api.example.com/api/v1?token=x', 'https://api.example.com/api/v1#x']) {
    assert.throws(() => createHttpClient({ baseUrl }), errorIs('INVALID_CONFIG', false));
  }
  assert.throws(() => createHttpClient({ baseUrl, development: false }), errorIs('INVALID_CONFIG', false));
  assert.doesNotThrow(() => createHttpClient({ baseUrl: 'https://api.example.com/api/v1', development: false }));
});

test('preserva /api/v1, query, JSON y autorización por request para sesión futura', async () => {
  let received;
  const http = client(async (url, init) => { received = { url, init }; return json({ data: { challengeId: 'challenge-1' } }, 202); });
  const result = await http.request('/auth/login?client=MOBILE', { method: 'POST', body: { identifier: '123', password: 'example' }, headers: { Authorization: 'Bearer token' } });
  assert.equal(received.url, 'http://192.168.1.10:3000/api/v1/auth/login?client=MOBILE');
  assert.equal(received.init.method, 'POST');
  assert.equal(received.init.body, '{"identifier":"123","password":"example"}');
  assert.equal(received.init.headers.get('Content-Type'), 'application/json');
  assert.equal(received.init.headers.get('Accept'), 'application/json');
  assert.equal(received.init.headers.get('Authorization'), 'Bearer token');
  assert.equal(result.status, 202);
  assert.equal(result.data.challengeId, 'challenge-1');
});

test('listados conservan pagination y GET no agrega body ni Content-Type', async () => {
  const http = client(async (url, init) => {
    assert.equal(url, 'http://192.168.1.10:3000/api/v1/workplaces');
    assert.equal(init.body, undefined);
    assert.equal(init.headers.has('Content-Type'), false);
    return json({ data: [], pagination: { page: 1, pageSize: 50, totalItems: 0, totalPages: 0 } });
  });
  const result = await http.request('workplaces');
  assert.equal(result.data.length, 0);
  assert.equal(result.pagination.pageSize, 50);
});

test('rechaza paths absolutos, traversal y prefijo duplicado antes de enviar', async () => {
  let calls = 0;
  const http = client(async () => { calls++; return json({ data: null }); });
  for (const path of ['https://evil.example/auth', '//evil.example/auth', '../health', '/api/v1/auth', '%2e%2e/health', 'auth\\login', 'auth#fragment']) {
    await assert.rejects(http.request(path), errorIs('INVALID_CONFIG', false));
  }
  assert.equal(calls, 0);
});

test('204 retorna sin intentar decodificar JSON', async () => {
  const result = await client(async () => new Response(null, { status: 204 })).request('auth/logout', { method: 'POST' });
  assert.equal(result.status, 204);
  assert.equal(result.data, undefined);
});

test('error contractual preserva código, mensaje, retryable y HTTP status', async () => {
  await assert.rejects(client(async () => json({ error: { code: 'ROLE_NOT_ALLOWED', message: 'Rol no permitido', retryable: false } }, 403)).request('profile'), (error) => {
    errorIs('ROLE_NOT_ALLOWED', false, 403)(error);
    assert.equal(error.message, 'Rol no permitido');
    return true;
  });
  await assert.rejects(client(async () => json({ error: { code: 'STORAGE_UNAVAILABLE', message: 'No disponible', retryable: true } }, 503)).request('documents'), errorIs('STORAGE_UNAVAILABLE', true, 503));
});

test('JSON inválido, envelope ausente y error malformado nunca se tratan como éxito', async () => {
  for (const response of [new Response('<html>proxy</html>'), json({ ok: true }), json({ error: { code: 'BAD', message: 'Error' } }, 400), json({ data: null }, 500)]) {
    await assert.rejects(client(async () => response).request('catalogs'), errorIs('INVALID_RESPONSE', false));
  }
});

test('red fallida se distingue del error HTTP sin exponer detalles de fetch', async () => {
  await assert.rejects(client(async () => { throw new TypeError('upstream internal detail'); }).request('catalogs'), (error) => {
    errorIs('NETWORK_ERROR', true)(error);
    assert.ok(!error.message.includes('upstream'));
    return true;
  });
});

test('timeout aborta fetch y también limita lectura del body', async () => {
  let signal;
  await assert.rejects(client(async (_url, init) => { signal = init.signal; return new Promise(() => {}); }, { timeoutMs: 10 }).request('catalogs'), errorIs('TIMEOUT', true));
  assert.equal(signal.aborted, true);
  await assert.rejects(client(async () => ({ status: 200, ok: true, json: () => new Promise(() => {}) }), { timeoutMs: 10 }).request('catalogs'), errorIs('TIMEOUT', true));
});

test('cancelación previa evita envío; cancelación durante request no es timeout/red', async () => {
  const before = new AbortController(); before.abort();
  let calls = 0;
  await assert.rejects(client(async () => { calls++; return json({ data: null }); }).request('catalogs', { signal: before.signal }), errorIs('CANCELLED', false));
  assert.equal(calls, 0);
  const during = new AbortController();
  let fetchSignal;
  const pending = client(async (_url, init) => { fetchSignal = init.signal; return new Promise(() => {}); }).request('catalogs', { signal: during.signal });
  during.abort();
  await assert.rejects(pending, errorIs('CANCELLED', false));
  assert.equal(fetchSignal.aborted, true);
});

test('query puede contener timestamps sin perder prefijo y no acepta API duplicada con query', async () => {
  const http = client(async (url) => {
    assert.equal(url, 'http://192.168.1.10:3000/api/v1/events?at=2026-11-05T01:02:03Z');
    return json({ data: [] });
  });
  await http.request('events?at=2026-11-05T01:02:03Z');
  await assert.rejects(http.request('api/v1?x=1'), errorIs('INVALID_CONFIG', false));
});

test('body no serializable falla como configuración antes de enviar', async () => {
  let calls = 0;
  const http = client(async () => { calls++; return json({ data: null }); });
  const circular = {}; circular.self = circular;
  await assert.rejects(http.request('auth/login', { method: 'POST', body: circular }), errorIs('INVALID_CONFIG', false));
  assert.equal(calls, 0);
});

test('cliente público sin URL rechaza su promesa con error tipado, sin éxito mock', async () => {
  const previous = process.env.EXPO_PUBLIC_API_BASE_URL;
  delete process.env.EXPO_PUBLIC_API_BASE_URL;
  try {
    await assert.rejects(exportsObject.httpClient.request('catalogs'), errorIs('INVALID_CONFIG', false));
  } finally {
    if (previous === undefined) delete process.env.EXPO_PUBLIC_API_BASE_URL;
    else process.env.EXPO_PUBLIC_API_BASE_URL = previous;
  }
});
