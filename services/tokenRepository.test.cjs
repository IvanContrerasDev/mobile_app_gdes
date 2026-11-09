const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const source = ts.transpileModule(readFileSync(require('node:path').join(__dirname, 'tokenRepository.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
function setup() {
  let secure = '{"tokens":{"refreshToken":"old"}}'; const publicValues = new Map(); let failDelete = false; let failWrite = false; let failMarkerRemoval = false;
  const exports = {};
  vm.runInNewContext(source, { exports, require: name => name === 'expo-secure-store' ? {
    getItemAsync: async () => secure, deleteItemAsync: async () => { if (failDelete) throw new Error('locked'); secure = null; },
    setItemAsync: async (_key, value) => { if (failWrite) throw new Error('locked'); secure = value; },
  } : { getItem: async key => publicValues.get(key) ?? null, setItem: async (key, value) => publicValues.set(key, value), removeItem: async key => { if (failMarkerRemoval) throw new Error('disk'); publicValues.delete(key); } } });
  return { repo: exports.tokenRepository, publicValues, deleteFails: () => { failDelete = true; }, writeFails: () => { failWrite = true; }, markerRemovalFails: () => { failMarkerRemoval = true; } };
}
test('logout con borrado SecureStore fallido deja tombstone no sensible para impedir restauración', async () => {
  const env = setup(); env.deleteFails();
  await assert.rejects(env.repo.clear());
  assert.equal(await env.repo.read(), null, 'reinicio no restaura credenciales tras logout fallido');
  assert.ok(env.publicValues.size > 0);
  assert.ok([...env.publicValues.values()].every(value => !value.includes('refreshToken')));
});
test('persistencia fallida de par nuevo o marca conserva invalidación sin refresh viejo', async () => {
  for (const stage of ['write', 'marker']) {
    const env = setup(); await env.repo.clear();
    if (stage === 'write') env.writeFails(); else env.markerRemovalFails();
    await assert.rejects(env.repo.write({ tokens: { refreshToken: 'rotated' } }));
    assert.equal(await env.repo.read(), null);
  }
});
