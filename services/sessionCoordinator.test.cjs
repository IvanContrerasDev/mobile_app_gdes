const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync, existsSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');
function load(file, deps = {}) {
  if (!existsSync(path.join(__dirname, file))) return {};
  const { outputText } = ts.transpileModule(readFileSync(path.join(__dirname, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const exports = {};
  vm.runInNewContext(outputText, { exports, require: (name) => deps[name], Headers, AbortController, setTimeout, clearTimeout, console });
  return exports;
}
const transport = load('httpClient.ts');
const { createSessionCoordinator } = load('sessionCoordinator.ts', { './httpClient': transport });
const user = { id: 'employee-a', firstName: 'Ana', lastName: 'Perez', email: 'a@example.com', employeeId: 'EMP-1', role: 'EMPLOYEE' };
const tokens = { accessToken: 'access-1', refreshToken: 'refresh-1', expiresIn: 1800 };
const pair = { version: 1, user, tokens };
const response = (data, status = 200) => ({ data, status });
const deferred = () => { let resolve, reject; const promise = new Promise((a,b) => { resolve=a; reject=b; }); return { promise, resolve, reject }; };
const unauthorized = () => new transport.HttpError('INVALID_TOKEN', 'Sesión vencida', false, 401);
function setup(handler, initial = null, hooks = {}) {
  let saved = initial;
  let state;
  const requests = [];
  const coordinator = createSessionCoordinator({
    http: { request: async (url, init = {}) => { requests.push({ url, init }); return handler(url, init); } },
    repository: { read: async () => saved, write: async (value) => { if (hooks.write) await hooks.write(value); saved = value; }, clear: async () => { if (hooks.clear) await hooks.clear(); saved = null; } },
    clearLegacy: async () => { hooks.legacy?.(); },
    onChange: (value) => { state = value; }, onAccountChange: hooks.accountChange || (() => {}),
  });
  return { coordinator, requests, get state() { return state; }, get saved() { return saved; } };
}
async function authenticate(env) { const challenge = await env.coordinator.login('EMP-1', 'password'); await env.coordinator.verify(challenge.challengeId, '123456'); }
function normal(url) {
  if (url === '/auth/login') return response({ otpRequired: true, challengeId: 'challenge-a' }, 202);
  if (url === '/auth/otp/verify') return response({ user, tokens });
  if (url === '/profile') return response(user);
  if (url === '/auth/logout') return response(undefined, 204);
  throw new Error(url);
}
test('login entrega challenge MOBILE, nunca instala sesión hasta OTP válido', async () => {
  assert.equal(typeof createSessionCoordinator, 'function');
  const env = setup((url, init) => { if (url === '/auth/otp/verify' && init.body.code === '000000') throw new transport.HttpError('INVALID_OTP', 'Código incorrecto', false, 401); return normal(url); });
  const challenge = await env.coordinator.login(' EMP-1 ', 'password');
  assert.equal(env.state.isAuthenticated, false);
  assert.equal(env.requests[0].init.body.client, 'MOBILE');
  assert.equal(env.requests[0].init.body.identifier, 'EMP-1');
  await assert.rejects(env.coordinator.verify(challenge.challengeId, '000000'), { code: 'INVALID_OTP' });
  assert.equal(env.saved, null);
  await env.coordinator.verify(challenge.challengeId, '123456');
  assert.equal(env.state.user.firstName, 'Ana'); assert.equal(env.state.isAuthenticated, true);
  assert.equal(env.saved.tokens.refreshToken, 'refresh-1');
});
test('rechaza no EMPLOYEE, DTO malformado y challenge inexistente', async () => {
  for (const data of [{ user: { ...user, role: 'ADMIN' }, tokens }, { user, tokens: { ...tokens, expiresIn: 0 } }, { emailVerificationRequired: true }]) {
    const env = setup((url) => url === '/auth/otp/verify' ? response(data) : normal(url));
    const challenge = await env.coordinator.login('a', 'b');
    await assert.rejects(env.coordinator.verify(challenge.challengeId, '123456'));
    assert.equal(env.state.isAuthenticated, false); assert.equal(env.saved, null);
  }
  const env = setup(normal); await assert.rejects(env.coordinator.verify('invented', '123456')); assert.equal(env.requests.length, 0);
});
test('bootstrap descarta mock y verifica identidad en /profile antes de publicar sesión', async () => {
  let legacy = 0;
  const invalid = setup(normal, { isAuthenticated: true, user }, { legacy: () => legacy++ });
  await invalid.coordinator.bootstrap(); assert.equal(invalid.state.isAuthenticated, false); assert.equal(legacy, 1);
  const pending = deferred();
  const env = setup(() => pending.promise, pair);
  const boot = env.coordinator.bootstrap(); await new Promise(setImmediate);
  assert.equal(env.state.isAuthenticated, false); assert.equal(env.state.hydrated, false);
  pending.resolve(response(user)); await boot;
  assert.equal(env.state.isAuthenticated, true); assert.equal(env.state.hydrated, true);
  assert.equal(env.requests[0].url, '/profile'); assert.equal(new Headers(env.requests[0].init.headers).get('Authorization'), 'Bearer access-1');
  const mismatch = setup(() => response({ ...user, id: 'employee-b' }), pair);
  await mismatch.coordinator.bootstrap(); assert.equal(mismatch.state.isAuthenticated, false); assert.equal(mismatch.saved, null);
});
test('bootstrap maneja error de storage/servidor sin autenticar ni spinner infinito', async () => {
  const env = setup(() => { throw unauthorized(); }, pair);
  await env.coordinator.bootstrap(); assert.equal(env.state.hydrated, true); assert.equal(env.state.isAuthenticated, false); assert.equal(env.saved, null);
});
test('dos 401 comparten refresh rotativo y respuestas 401 tardías no rotan dos veces', async () => {
  const rotation = deferred(); const late401 = deferred(); let refreshes = 0;
  const env = setup((url, init) => {
    if (url === '/resource') { if (new Headers(init.headers).get('Authorization') === 'Bearer access-2') return response('ok'); throw unauthorized(); }
    if (url === '/late') return late401.promise;
    if (url === '/auth/refresh') { refreshes++; assert.equal(env.saved, null, 'refresh antiguo eliminado durable antes de consumir'); return rotation.promise; }
    return normal(url);
  });
  await authenticate(env);
  const late = env.coordinator.request('/late');
  const one = env.coordinator.request('/resource'); const two = env.coordinator.request('/resource');
  await new Promise(setImmediate); assert.equal(refreshes, 1);
  rotation.resolve(response({ tokens: { ...tokens, accessToken: 'access-2', refreshToken: 'refresh-2' } }));
  assert.equal((await one).data, 'ok'); assert.equal((await two).data, 'ok');
  late401.reject(unauthorized());
  // /late reintento usa el nuevo bearer; devolver respuesta desde promise ya rechazada terminará sesión, sin otra rotación.
  await assert.rejects(late); assert.equal(refreshes, 1);
});
test('timeout ambiguo y refresh expirado invalidan sin reutilizar token tras reinicio', async () => {
  for (const failure of [new transport.HttpError('TIMEOUT', 'Tiempo agotado', true), unauthorized()]) {
    let refreshes = 0;
    const env = setup((url) => { if (url === '/resource') throw unauthorized(); if (url === '/auth/refresh') { refreshes++; throw failure; } return normal(url); });
    await authenticate(env); await assert.rejects(env.coordinator.request('/resource'));
    assert.equal(env.state.isAuthenticated, false); assert.equal(env.saved, null);
    await env.coordinator.bootstrap(); assert.equal(refreshes, 1);
  }
});
test('fallo al guardar rotación nunca restaura refresh consumido', async () => {
  const env = setup((url) => { if (url === '/resource') throw unauthorized(); if (url === '/auth/refresh') return response({ tokens: { ...tokens, refreshToken: 'refresh-2' } }); return normal(url); }, null, { write: (value) => { if (value.tokens.refreshToken === 'refresh-2') throw new Error('storage'); } });
  await authenticate(env); await assert.rejects(env.coordinator.request('/resource'));
  assert.equal(env.saved, null); assert.equal(env.state.isAuthenticated, false);
});
test('fallo de persistencia inicial no autentica', async () => {
  const env = setup(normal, null, { write: () => { throw new Error('storage'); } });
  await assert.rejects(authenticate(env)); assert.equal(env.state.isAuthenticated, false);
});
test('logout durante OTP o persistencia no resucita sesión', async () => {
  for (const stage of ['otp', 'storage']) {
    const wait = deferred();
    const env = setup((url) => url === '/auth/otp/verify' && stage === 'otp' ? wait.promise : normal(url), null, { write: stage === 'storage' ? () => wait.promise : undefined });
    const ch = await env.coordinator.login('a', 'b');
    const verification = env.coordinator.verify(ch.challengeId, '123456');
    await new Promise(setImmediate); const logout = env.coordinator.logout();
    wait.resolve(stage === 'otp' ? response({ user, tokens }) : undefined);
    await assert.rejects(verification); await logout;
    assert.equal(env.saved, null); assert.equal(env.state.isAuthenticated, false);
  }
});
test('logout limpia estado inmediatamente, revoca bearer y descarta refresh tardío tras nuevo login', async () => {
  const wait = deferred(); const owners = [];
  const env = setup((url) => { if (url === '/resource') throw unauthorized(); if (url === '/auth/refresh') return wait.promise; return normal(url); }, null, { accountChange: (owner) => owners.push(owner) });
  await authenticate(env);
  const old = env.coordinator.request('/resource'); await new Promise(setImmediate);
  await env.coordinator.logout(); assert.equal(env.state.isAuthenticated, false);
  assert.equal(env.requests.filter(r => r.url === '/auth/logout').length, 1);
  await authenticate(env);
  wait.resolve(response({ tokens: { ...tokens, refreshToken: 'stale' } })); await assert.rejects(old);
  assert.equal(env.saved.tokens.refreshToken, 'refresh-1'); assert.equal(env.state.isAuthenticated, true);
  assert.ok(owners.includes(null)); assert.ok(owners.includes(user.id));
});
test('mutation incierta no se reintenta y resend conserva challenge/cooldown contractual', async () => {
  let mutations = 0;
  const env = setup((url) => {
    if (url === '/mutation') { mutations++; throw new transport.HttpError('TIMEOUT', 'Timeout', true); }
    if (url === '/auth/otp/resend') return response({ sent: true }, 202);
    return normal(url);
  });
  const ch = await env.coordinator.login('a', 'b'); await env.coordinator.resend(ch.challengeId);
  assert.equal(env.requests.at(-1).init.body.challengeId, ch.challengeId);
  await env.coordinator.verify(ch.challengeId, '123456');
  await assert.rejects(env.coordinator.request('/mutation', { method: 'POST', body: {} })); assert.equal(mutations, 1);
});
test('bootstrap viejo de A no publica identidad ni borra tokens de una cuenta B posterior', async () => {
  const profile = deferred(); const b = { ...user, id: 'employee-b', email: 'b@example.com', employeeId: 'EMP-B' };
  const env = setup(url => {
    if (url === '/profile') return profile.promise;
    if (url === '/auth/otp/verify') return response({ user: b, tokens: { ...tokens, refreshToken: 'refresh-b' } });
    return normal(url);
  }, pair);
  const oldBoot = env.coordinator.bootstrap(); await new Promise(setImmediate);
  await authenticate(env); profile.resolve(response(user)); await oldBoot;
  assert.equal(env.state.user.id, b.id); assert.equal(env.saved.user.id, b.id); assert.equal(env.saved.tokens.refreshToken, 'refresh-b');
});
test('resend cooldown y restricciones de login preservan error servidor sin refresh implícito', async () => {
  for (const code of ['ACCOUNT_INACTIVE', 'EMAIL_NOT_VERIFIED', 'ROLE_NOT_ALLOWED']) {
    const env = setup(() => { throw new transport.HttpError(code, 'Mensaje de servidor', false, 403); });
    await assert.rejects(env.coordinator.login('a', 'b'), { code }); assert.equal(env.state.isAuthenticated, false);
    assert.equal(env.requests.length, 1);
  }
  const env = setup(url => { if (url === '/auth/otp/resend') throw new transport.HttpError('OTP_RESEND_COOLDOWN', 'Esperá para reenviar.', true, 429); return normal(url); });
  const ch = await env.coordinator.login('a', 'b'); await assert.rejects(env.coordinator.resend(ch.challengeId), { code: 'OTP_RESEND_COOLDOWN' });
  await env.coordinator.verify(ch.challengeId, '123456'); assert.equal(env.state.isAuthenticated, true);
});
test('logout con respuesta distinta de 204 informa revocación no confirmada y conserva cierre local', async () => {
  const env = setup(url => url === '/auth/logout' ? response({ ok: true }) : normal(url));
  await authenticate(env); await env.coordinator.logout();
  assert.equal(env.state.isAuthenticated, false); assert.equal(env.saved, null); assert.match(env.state.error, /revocación/);
});
test('403 de recurso después de renovar no cierra sesión si no indica rol/estado de cuenta', async () => {
  const env = setup((url, init) => {
    if (url === '/resource') {
      if (new Headers(init.headers).get('Authorization') === 'Bearer access-1') throw unauthorized();
      throw new transport.HttpError('RESOURCE_FORBIDDEN', 'Sin permiso sobre este recurso.', false, 403);
    }
    if (url === '/auth/refresh') return response({ tokens: { ...tokens, accessToken: 'access-2', refreshToken: 'refresh-2' } });
    return normal(url);
  });
  await authenticate(env); await assert.rejects(env.coordinator.request('/resource'), { code: 'RESOURCE_FORBIDDEN' });
  assert.equal(env.state.isAuthenticated, true); assert.equal(env.saved.tokens.refreshToken, 'refresh-2');
});
