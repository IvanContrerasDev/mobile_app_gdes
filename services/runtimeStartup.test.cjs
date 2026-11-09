const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');

function load(relativePath, dependencies, globals) {
  const { outputText } = ts.transpileModule(readFileSync(path.join(__dirname, '..', relativePath), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  });
  const exports = {};
  vm.runInNewContext(outputText, { exports, require: (name) => {
    if (!(name in dependencies)) throw new Error(`Unmocked dependency: ${name}`);
    return dependencies[name];
  }, ...globals });
  return exports;
}

function initialRender(baseUrl, session, development = true) {
  let fetchCalls = 0;
  const globals = { URL, Headers, AbortController, setTimeout, clearTimeout, __DEV__: development,
    process: { env: { EXPO_PUBLIC_API_BASE_URL: baseUrl } }, fetch: async () => { fetchCalls++; throw new Error('Arranque no debe consultar red'); } };
  const transport = load('services/httpClient.ts', {}, globals);
  const jsx = (type, props) => ({ type, props });
  const { default: App } = load('app/index.tsx', {
    'react/jsx-runtime': { jsx, jsxs: jsx },
    'react': { useEffect: () => {} },
    '../services/authService': { bootstrapSession: async () => {} },
    'react-native': { View: 'View', Text: 'Text', ActivityIndicator: 'ActivityIndicator', KeyboardAvoidingView: 'KeyboardAvoidingView', Platform: { OS: 'android' } },
    'react-native-safe-area-context': { SafeAreaView: 'SafeAreaView' },
    '../navigation/AuthNavigator': { AuthNavigator: 'AuthNavigator' },
    '../navigation/AppNavigator': { AppNavigator: 'AppNavigator' },
    '../stores/authStore': { useAuthStore: (selector) => selector(session) },
    '../services/httpClient': transport,
  }, globals);
  const nodes = [];
  const visit = (node) => {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!node || typeof node !== 'object') return;
    nodes.push(node);
    visit(node.props?.children);
  };
  visit(App());
  return { nodes, transport, fetchCalls };
}

for (const baseUrl of [undefined, 'invalid-url', 'https://api.example.com', 'https://user:secret@api.example.com/api/v1']) {
  for (const session of [{ hydrated: true, isAuthenticated: false }, { hydrated: true, isAuthenticated: true }, { hydrated: false, isAuthenticated: false }]) {
    test(`arranque bloquea configuración ${baseUrl === undefined ? 'ausente' : 'inválida'} (sesión=${session.isAuthenticated}, hidratado=${session.hydrated})`, () => {
      const { nodes, fetchCalls } = initialRender(baseUrl, session);
      assert.ok(!nodes.some((node) => ['AuthNavigator', 'AppNavigator', 'ActivityIndicator'].includes(node.type)), 'no habilitar navegación/spinner con URL inválida');
      assert.ok(nodes.some((node) => node.props?.accessibilityRole === 'alert'), 'error accesible al render inicial');
      const text = nodes.filter((node) => node.type === 'Text').map((node) => node.props.children).join(' ');
      assert.match(text, /EXPO_PUBLIC_API_BASE_URL/);
      assert.match(text, /\/api\/v1/);
      assert.match(text, /reinici/i);
      assert.equal(fetchCalls, 0);
    });
  }
}

for (const baseUrl of ['http://192.168.1.10:3000/api/v1', 'https://api.example.com/api/v1']) {
  test(`URL válida preserva navegación/hidratación sin consultar API (${baseUrl.startsWith('https') ? 'HTTPS' : 'LAN dev'})`, () => {
    for (const [session, expected] of [
      [{ hydrated: true, isAuthenticated: false }, 'AuthNavigator'],
      [{ hydrated: true, isAuthenticated: true }, 'AppNavigator'],
      [{ hydrated: false, isAuthenticated: false }, 'ActivityIndicator'],
    ]) {
      const { nodes, fetchCalls } = initialRender(baseUrl, session);
      assert.ok(nodes.some((node) => node.type === expected));
      assert.ok(!nodes.some((node) => node.props?.accessibilityRole === 'alert'));
      assert.equal(fetchCalls, 0);
    }
  });
}

test('release bloquea URL HTTP en arranque antes de usar sesión persistida', () => {
  const { nodes } = initialRender('http://192.168.1.10:3000/api/v1', { hydrated: true, isAuthenticated: true }, false);
  assert.ok(nodes.some((node) => node.props?.accessibilityRole === 'alert'));
  assert.ok(!nodes.some((node) => node.type === 'AppNavigator'));
});
