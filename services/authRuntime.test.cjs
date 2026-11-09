const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, deps) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(readFileSync(path.join(__dirname, '..', file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText,
    { exports, require: name => { if (!(name in deps)) throw new Error(`Missing ${name}`); return deps[name]; }, Headers, AbortController, setTimeout, clearTimeout });
  return exports;
}
function setup() {
  const publicValues = new Map([['gdes-auth-session', JSON.stringify({ state: { isAuthenticated: true, user: { id: 'mock' } } })]]);
  const secureValues = new Map(); let writes = [];
  const asyncStorage = { getItem: async key => publicValues.get(key) ?? null, setItem: async (key,value) => publicValues.set(key,value), removeItem: async key => { publicValues.delete(key); } };
  const secureStore = { WHEN_UNLOCKED_THIS_DEVICE_ONLY: 5, getItemAsync: async key => secureValues.get(key) ?? null,
    deleteItemAsync: async key => { secureValues.delete(key); }, setItemAsync: async (key,value,options) => { secureValues.set(key,value); writes.push({ key, value, options }); } };
  const authStore = load('stores/authStore.ts', { zustand: require('zustand') });
  const appStore = load('store/useAppStore.ts', { zustand: require('zustand') });
  const scope = load('services/accountScope.ts', {});
  const transport = load('services/httpClient.ts', {});
  const coordinator = load('services/sessionCoordinator.ts', { './httpClient': transport });
  const repository = load('services/tokenRepository.ts', { 'expo-secure-store': secureStore, '@react-native-async-storage/async-storage': asyncStorage });
  const user = { id: 'employee-a', firstName: 'Ana', lastName: 'Pérez', email: 'a@example.com', employeeId: 'EMP-X', role: 'EMPLOYEE' };
  const requests = [];
  const http = { request: async (url, init) => { requests.push({ url, init });
    if (url === '/auth/login') return { status: 202, data: { otpRequired: true, challengeId: 'ch-a' } };
    if (url === '/auth/otp/verify') return { status: 200, data: { user, tokens: { accessToken: 'access', refreshToken: 'refresh', expiresIn: 1800 } } };
    if (url === '/profile') return { status: 200, data: { ...user, firstName: 'Actualizado', role: undefined } };
    if (url === '/auth/logout') return { status: 204 };
    throw new Error(url);
  } };
  const service = load('services/authService.ts', { '@react-native-async-storage/async-storage': asyncStorage, './sessionCoordinator': coordinator,
    './tokenRepository': repository, './httpClient': { httpClient: http }, '../stores/authStore': authStore, '../store/useAppStore': appStore, './accountScope': scope });
  return { service, authStore: authStore.useAuthStore, appStore: appStore.useAppStore, scope, publicValues, secureValues, writes, requests, repository, user };
}
test('runtime real descarta sesión mock de AsyncStorage sin autenticar y guarda solo en SecureStore tras OTP', async () => {
  const env = setup();
  assert.equal(env.authStore.getState().hydrated, false);
  await env.service.bootstrapSession();
  assert.equal(env.authStore.getState().hydrated, true); assert.equal(env.authStore.getState().isAuthenticated, false);
  assert.equal(env.publicValues.has('gdes-auth-session'), false);
  const challenge = await env.service.login('EMP-X', 'legada');
  assert.equal(env.authStore.getState().isAuthenticated, false); assert.equal(env.secureValues.size, 0);
  await env.service.verifyOTP(challenge.challengeId, '123456');
  assert.equal(env.authStore.getState().user.employeeId, 'EMP-X');
  assert.equal(env.writes[0].options.keychainAccessible, 5);
  assert.equal(env.publicValues.size, 0); assert.equal(env.secureValues.size, 1);
  env.appStore.getState().setWorkingStatus(true); env.appStore.getState().setObservation('a-private');
  await env.service.logout();
  assert.equal(env.authStore.getState().isAuthenticated, false); assert.equal(env.secureValues.size, 0);
  assert.equal(env.appStore.getState().observation, ''); assert.equal(env.appStore.getState().isWorking, false);
  assert.equal(env.scope.getAccountScope().ownerId, null);
});
test('reinicio real lee par SecureStore, contrasta identidad protegida y actualiza datos ingleses', async () => {
  const env = setup();
  await env.repository.tokenRepository.write({ version: 1, user: env.user, tokens: { accessToken: 'access', refreshToken: 'refresh', expiresIn: 1800 } });
  await env.service.bootstrapSession();
  assert.equal(env.requests[0].url, '/profile');
  assert.equal(env.authStore.getState().isAuthenticated, true);
  assert.equal(env.authStore.getState().user.firstName, 'Actualizado');
  assert.equal(env.authStore.getState().user.role, 'EMPLOYEE');
  assert.equal(env.scope.getAccountScope().ownerId, 'employee-a');
});
