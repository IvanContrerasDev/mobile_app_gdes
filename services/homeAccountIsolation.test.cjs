const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const deferred = () => { let resolve, reject; const promise = new Promise((a,b) => { resolve=a; reject=b; }); return { promise, resolve, reject }; };
const settle = () => new Promise(setImmediate);
function setup({ stage } = {}) {
  const pending = deferred(); const values = new Map(); const calls = { gps: 0, network: 0, register: 0, navigation: 0, publications: 0 };
  let cursor = 0; let effectCursor = 0; const slots = []; const effects = []; const cleanups = []; const cache = new Map();
  const jsx = (type, props) => ({ type, props });
  const hooks = {
    useState: initial => { const n = cursor++; if (!(n in slots)) slots[n] = initial; return [slots[n], value => { calls.publications++; slots[n] = typeof value === 'function' ? value(slots[n]) : value; }]; },
    useRef: initial => { const n = cursor++; if (!(n in slots)) slots[n] = { current: initial }; return slots[n]; },
    useEffect: effect => { if (effectCursor++ >= effects.length) effects.push(effect); },
  };
  const location = { latitude: 1, longitude: 2, accuracy: 3, timestamp: '2026-11-05T10:00:00Z' };
  const workplaces = [{ id: 'a-only', name: 'Lugar A', active: true, siteId: 'site', siteName: 'Sitio' }];
  const natives = {
    'react': hooks, 'react/jsx-runtime': { jsx, jsxs: jsx }, 'zustand': { create: initializer => { const store = require('zustand/vanilla').createStore(initializer); return Object.assign((selector = state => state) => selector(store.getState()), store); } },
    'react-native': Object.fromEntries(['View','Text','Pressable','ScrollView','TextInput','Modal','FlatList','ActivityIndicator'].map(s => [s,s])),
    '@react-native-async-storage/async-storage': {
      getItem: async key => values.get(key) ?? null,
      setItem: async (key,value) => { if ((stage === 'preference' && key.includes('recent-workplaces')) || (stage === 'favorite' && key.includes('favorite-workplaces'))) await pending.promise; values.set(key,value); },
      removeItem: async key => values.delete(key),
    },
  };
  function load(file) {
    file = path.resolve(__dirname, '..', file);
    if (cache.has(file)) return cache.get(file);
    const exports = {}; cache.set(file, exports);
    const deps = {
      'components/Icons.tsx': { ChevronDownIcon: 'Chevron', CheckIcon: 'Check', AttachIcon: 'Attach', StarIcon: 'Star' },
      'services/locationService.ts': { getCurrentLocation: async () => { calls.gps++; return stage === 'gps' ? pending.promise : location; } },
      'services/networkService.ts': { isOnline: async () => { calls.network++; return stage === 'network' ? pending.promise : true; } },
      'services/registerService.ts': { registerEvent: async () => { calls.register++; return stage === 'register' ? pending.promise : { success: true }; } },
      'services/workplaceService.ts': { getWorkplaces: async () => stage === 'load' ? pending.promise : workplaces },
    };
    const relative = path.relative(path.join(__dirname, '..'), file);
    if (relative in deps) { cache.set(file, deps[relative]); return deps[relative]; }
    vm.runInNewContext(ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText,
      { exports, require: name => name in natives ? natives[name] : load(path.relative(path.join(__dirname, '..'), path.resolve(path.dirname(file), name + (name.includes('components') ? '.tsx' : '.ts')))),
        console: { log: () => {} }, Headers, AbortController, setTimeout, clearTimeout });
    return exports;
  }
  const scope = load('services/accountScope.ts'); const store = load('store/useAppStore.ts').useAppStore;
  scope.setAccountOwner('A'); store.getState().setWorkplace('Lugar A'); store.getState().setObservation('Observación A');
  const recentKey = 'gdes-account-v1:A:recent-workplaces';
  values.set(recentKey, JSON.stringify({ morningWorkplaceId: 'a-only', afternoonWorkplaceId: 'a-only' }));
  const Home = load('screens/HomeScreen.tsx').HomeScreen;
  function render() {
    cursor = 0; effectCursor = 0; const result = Home({ onRegister: () => { calls.navigation++; } }); const nodes = [];
    const visit = n => { if (Array.isArray(n)) return n.forEach(visit); if (!n || typeof n !== 'object') return; nodes.push(n); visit(n.props?.children); }; visit(result); return nodes;
  }
  render(); effects.forEach(effect => cleanups.push(effect()));
  function switchAccount(owner = 'B', unmount = false) {
    // La misma transición productiva que authService.onAccountChange: nuevo scope + reset completo.
    scope.setAccountOwner(null); store.getState().resetAccount();
    if (unmount) cleanups.forEach(cleanup => cleanup?.());
    scope.setAccountOwner(owner); store.getState().resetAccount();
    store.getState().setWorkplace('Lugar B'); store.getState().setObservation('Observación B'); store.getState().setWorkingStatus(false);
  }
  const submit = () => render().find(n => n.type === 'Pressable' && JSON.stringify(n.props.children).includes('Registrar entrada')).props.onPress();
  const unmount = () => cleanups.forEach(cleanup => cleanup?.());
  const favorite = () => {
    const row = render().find(n => n.type === 'FlatList').props.renderItem({ item: workplaces[0] });
    const find = n => {
      if (Array.isArray(n)) return n.map(find).find(Boolean);
      if (!n || typeof n !== 'object') return;
      return n.props?.accessibilityLabel === 'Agregar a favoritos' ? n : find(n.props?.children);
    };
    return find(row).props.onPress();
  };
  return { pending, values, calls, store, switchAccount, unmount, submit, favorite, render, location, workplaces, settle, recentKey };
}
for (const stage of ['gps','network','register','preference']) {
  for (const owner of ['B','A']) test(`Home descarta ${stage} tardío después de logout A→${owner} antes del cleanup React`, async () => {
    const env = setup({ stage }); await env.settle(); const operation = env.submit(); await env.settle();
    env.switchAccount(owner); const publications = env.calls.publications;
    env.pending.resolve(stage === 'gps' ? env.location : stage === 'network' ? true : stage === 'register' ? { success: true } : undefined);
    await operation; await env.settle();
    assert.equal(env.store.getState().isWorking, false); assert.equal(env.store.getState().observation, 'Observación B'); assert.equal(env.store.getState().selectedWorkplace, 'Lugar B');
    assert.equal(env.calls.navigation, 0); assert.equal(env.calls.publications, publications, 'sin publicar UI después de unmount/cambio de generación');
    assert.equal(env.values.has(`gdes-account-v1:${owner}:used-workplaces`), false);
    if (owner === 'B') assert.equal(env.values.has('gdes-account-v1:B:recent-workplaces'), false);
    if (stage === 'gps') assert.equal(env.calls.network, 0);
    if (stage === 'network') assert.equal(env.calls.register, 0);
  });
}
for (const outcome of ['success','error']) test(`Home descarta carga inicial ${outcome} de A tardía sin preseleccionar ni publicar en B`, async () => {
  const env = setup({ stage: 'load' }); await env.settle(); env.switchAccount(); const publications = env.calls.publications;
  if (outcome === 'success') env.pending.resolve(env.workplaces); else env.pending.reject(new Error('old network error'));
  await env.settle(); assert.equal(env.store.getState().selectedWorkplace, 'Lugar B'); assert.equal(env.store.getState().observation, 'Observación B');
  assert.equal(env.calls.publications, publications); assert.equal(env.calls.navigation, 0);
});
test('Home vigente conserva éxito, preferencias propias, limpieza y navegación', async () => {
  const env = setup(); await env.settle(); await env.submit();
  assert.equal(env.store.getState().isWorking, true); assert.equal(env.store.getState().observation, ''); assert.equal(env.calls.navigation, 1);
  assert.match(env.values.get('gdes-account-v1:A:used-workplaces'), /a-only/); assert.match(env.values.get(env.recentKey), /a-only/);
});

for (const stage of ['register','load']) test(`Home descarta ${stage} tras desmontarse aunque la generación no cambie`, async () => {
  const env = setup({ stage }); await env.settle();
  const operation = stage === 'register' ? env.submit() : undefined; await env.settle();
  env.unmount(); const publications = env.calls.publications;
  env.store.getState().setObservation('Observación posterior');
  env.pending.resolve(stage === 'register' ? { success: true } : env.workplaces);
  await operation; await env.settle();
  assert.equal(env.store.getState().isWorking, false); assert.equal(env.store.getState().observation, 'Observación posterior');
  assert.equal(env.calls.publications, publications); assert.equal(env.calls.navigation, 0);
  assert.equal(env.values.has('gdes-account-v1:A:used-workplaces'), false);
});
for (const outcome of ['success','error']) test(`Home descarta favorito ${outcome} tardío A→B sin publicar error ni escribir bajo B`, async () => {
  const env = setup({ stage: 'favorite' }); await env.settle(); const operation = env.favorite(); await env.settle();
  env.switchAccount(); const publications = env.calls.publications;
  if (outcome === 'success') env.pending.resolve(); else env.pending.reject(new Error('old storage error'));
  await operation; await env.settle();
  assert.equal(env.calls.publications, publications); assert.equal(env.values.has('gdes-account-v1:B:favorite-workplaces'), false);
  assert.equal(env.store.getState().observation, 'Observación B');
});
