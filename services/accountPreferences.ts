export interface AccountScope { ownerId: string | null }
interface Storage { getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<unknown> }

/** Las keys legacy quedan intactas; nunca se atribuyen a la primera cuenta autenticada. */
export function createAccountPreferences(storage: Storage, getScope: () => AccountScope) {
  const key = (namespace: string, scope: AccountScope) => `gdes-account-v1:${encodeURIComponent(scope.ownerId!)}:${namespace}`;
  async function read<T>(namespace: string, fallback: T): Promise<T> {
    const scope = getScope();
    if (!scope.ownerId) return fallback;
    const raw = await storage.getItem(key(namespace, scope));
    if (scope !== getScope() || !raw) return fallback;
    return JSON.parse(raw) as T;
  }
  async function update<T>(namespace: string, fallback: T, change: (value: T) => T): Promise<T> {
    const scope = getScope();
    if (!scope.ownerId) throw new Error('Iniciá sesión para guardar preferencias.');
    const raw = await storage.getItem(key(namespace, scope));
    if (scope !== getScope()) throw new Error('La cuenta cambió.');
    const next = change(raw ? JSON.parse(raw) as T : fallback);
    await storage.setItem(key(namespace, scope), JSON.stringify(next));
    if (scope !== getScope()) throw new Error('La cuenta cambió.');
    return next;
  }
  return { read, update };
}
