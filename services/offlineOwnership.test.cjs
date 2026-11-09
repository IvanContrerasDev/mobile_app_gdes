const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const filename = require('node:path').join(__dirname, 'offlineRegisterService.ts');
const source = ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function setup() {
  let scope = { ownerId: 'a' };
  const values = new Map([['offline-registers', JSON.stringify([{ id: 'legacy', synced: false, request: {} }])]]);
  const exports = {};
  vm.runInNewContext(source, { exports, require: name => name === '@react-native-async-storage/async-storage' ? { __esModule: true, default: { getItem: async k => values.get(k) ?? null, setItem: async (k,v) => values.set(k,v), removeItem: async k => values.delete(k) } } : { getAccountScope: () => scope }, console: { log: () => {} } });
  return { queue: exports, values, owner: id => { scope = { ownerId: id }; } };
}
test('cola legacy no se atribuye ni borra; logout/cambio cuenta no envía pendientes ajenos', async () => {
  const env = setup();
  assert.equal((await env.queue.getPendingRegisters()).length, 0);
  const saved = await env.queue.saveOfflineRegister({ workplaceId: 'w-a' }); assert.equal(saved.ownerId, 'a');
  env.owner('b'); assert.equal((await env.queue.getPendingRegisters()).length, 0);
  await env.queue.clearOfflineRegisters(); env.owner('a');
  assert.equal((await env.queue.getPendingRegisters()).length, 1);
  env.owner(null); await assert.rejects(env.queue.saveOfflineRegister({})); assert.equal((await env.queue.getPendingRegisters()).length, 0);
  assert.match(env.values.get('offline-registers'), /legacy/);
});
