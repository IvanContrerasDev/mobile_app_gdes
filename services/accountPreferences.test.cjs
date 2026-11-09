const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync, existsSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const file = require('node:path').join(__dirname, 'accountPreferences.ts');
const exportsObject = {};
if (existsSync(file)) vm.runInNewContext(ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: exportsObject });
const { createAccountPreferences } = exportsObject;
test('favoritos por cuenta: no hereda legacy y A/B/A conserva preferencias propias', async () => {
  assert.equal(typeof createAccountPreferences, 'function');
  let scope = { ownerId: null }; const values = new Map([['favorite-workplaces', '["legacy"]']]);
  const storage = { getItem: async k => values.get(k) ?? null, setItem: async (k,v) => values.set(k,v) };
  const preferences = createAccountPreferences(storage, () => scope);
  await assert.rejects(preferences.update('favorite-workplaces', [], () => ['anonymous']));
  scope = { ownerId: 'a' }; assert.equal((await preferences.read('favorite-workplaces', [])).length, 0);
  await preferences.update('favorite-workplaces', [], () => ['a-favorite']);
  scope = { ownerId: 'b' }; assert.equal((await preferences.read('favorite-workplaces', [])).length, 0);
  await preferences.update('favorite-workplaces', [], () => ['b-favorite']);
  scope = { ownerId: 'a' }; assert.equal((await preferences.read('favorite-workplaces', []))[0], 'a-favorite');
  assert.equal(values.get('favorite-workplaces'), '["legacy"]');
});
test('lectura/escritura tardía de A jamás devuelve datos ni escribe en B', async () => {
  let scope = { ownerId: 'a' }; let resolve; const pending = new Promise(r => { resolve = r; }); const writes = [];
  const preferences = createAccountPreferences({ getItem: () => pending, setItem: async (k,v) => writes.push([k,v]) }, () => scope);
  const read = preferences.read('favorites', []); const update = preferences.update('favorites', [], () => ['a']);
  scope = { ownerId: 'b' }; resolve('["a-old"]');
  assert.equal((await read).length, 0); await assert.rejects(update); assert.equal(writes.length, 0);
});
