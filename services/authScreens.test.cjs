const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');
function load(file, deps) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(readFileSync(path.join(__dirname, '..', file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, { exports, require: name => { if (name.endsWith('.png')) return {}; if (!(name in deps)) throw new Error(`Missing ${name}`); return deps[name]; }, setTimeout, clearTimeout });
  return exports;
}
const errors = load('services/httpClient.ts', {});
const validations = load('utils/validations.ts', {});
function renderer(file, componentName, service, props) {
  let cursor = 0; const state = [];
  const jsx = (type, props) => ({ type, props });
  const hooks = { useEffect: () => {}, useState: initial => { const n = cursor++; if (!(n in state)) state[n] = initial; return [state[n], value => { state[n] = typeof value === 'function' ? value(state[n]) : value; }]; } };
  const exported = load(file, { 'react': hooks, 'react/jsx-runtime': { jsx, jsxs: jsx }, 'react-native': Object.fromEntries(['View','Text','Pressable','ScrollView','Image','ActivityIndicator'].map(s => [s,s])),
    '../components/InputWithError': { InputWithError: 'Input' }, '../components/OTPInput': { OTPInput: 'OTP' }, '../components/Icons': { GoogleIcon: 'GoogleIcon', WhatsAppIcon: 'WhatsAppIcon' },
    '../utils/validations': validations, '../services/httpClient': errors, '../services/authService': service });
  function render() {
    cursor = 0; const result = exported[componentName](props); const nodes = [];
    const visit = value => { if (Array.isArray(value)) return value.forEach(visit); if (!value || typeof value !== 'object') return; nodes.push(value); visit(value.props?.children); }; visit(result); return nodes;
  }
  return { render };
}
const button = (nodes, label) => nodes.find(n => n.type === 'Pressable' && JSON.stringify(n.props.children).includes(label));
test('LoginScreen envía legajo contractual y contraseña legada, luego navega a challenge sin instalar identidad', async () => {
  let request; let navigated;
  const ui = renderer('screens/LoginScreen.tsx', 'LoginScreen', { login: async (identifier,password) => { request = { identifier,password }; return { otpRequired: true, challengeId: 'real' }; } }, { onLogin: challenge => { navigated = challenge; } });
  let nodes = ui.render(); nodes.find(n => n.type === 'Input' && n.props.label === 'Email o Legajo').props.onChangeText('EMP-A');
  nodes.find(n => n.type === 'Input' && n.props.label === 'Contraseña').props.onChangeText('legacy');
  await button(ui.render(), 'Iniciar sesión').props.onPress();
  assert.equal(request.identifier, 'EMP-A'); assert.equal(request.password, 'legacy'); assert.equal(navigated.challengeId, 'real');
});
test('LoginScreen presenta mensaje servidor EMAIL_NOT_VERIFIED sin navegar', async () => {
  let navigated = false;
  const ui = renderer('screens/LoginScreen.tsx', 'LoginScreen', { login: async () => { throw new errors.HttpError('EMAIL_NOT_VERIFIED', 'Verificá tu email.', false, 403); } }, { onLogin: () => { navigated = true; } });
  const inputs = ui.render().filter(n => n.type === 'Input'); inputs[0].props.onChangeText('mail@example.com'); inputs[1].props.onChangeText('legacy');
  await button(ui.render(), 'Iniciar sesión').props.onPress();
  assert.equal(navigated, false); assert.match(JSON.stringify(ui.render()), /Verificá tu email/);
});
test('OTP con challenge usa verify real, conserva error/reintento y no llama callback del registro mock', async () => {
  let calls = 0; let bypass = false;
  const ui = renderer('screens/VerifyCodeScreen.tsx', 'VerifyCodeScreen', { verifyOTP: async (challenge,code) => { assert.equal(challenge, 'real'); calls++; if (code === '000000') throw new errors.HttpError('INVALID_OTP', 'Código inválido servidor.', false, 401); }, resendOTP: async () => {} }, { challengeId: 'real', onVerify: () => { bypass = true; }, onBack: () => {} });
  ui.render().find(n => n.type === 'OTP').props.onChange('000000');
  await button(ui.render(), 'Verificar').props.onPress(); assert.match(ui.render().find(n => n.type === 'OTP').props.error, /servidor/);
  assert.equal(button(ui.render(), 'Verificar').props.disabled, false);
  ui.render().find(n => n.type === 'OTP').props.onChange('123456'); await button(ui.render(), 'Verificar').props.onPress();
  assert.equal(calls, 2); assert.equal(bypass, false); assert.equal(button(ui.render(), 'Reenviar en 60').props.disabled, true);
});
