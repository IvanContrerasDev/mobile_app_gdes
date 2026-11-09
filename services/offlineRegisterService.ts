import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RegisterRequest } from '../types/api';
import { getAccountScope } from './accountScope';

/** Infraestructura todavía inactiva; M-05 reemplazará el DTO y activará sincronización durable. */
export interface OfflineRegister {
  id: string;
  ownerId: string;
  request: RegisterRequest;
  createdAt: string;
  synced: false;
}
// La key legacy offline-registers queda preservada y fuera del sync: carece de dueño verificable.
const key = (ownerId: string) => `offline-registers:v1:${encodeURIComponent(ownerId)}`;
let tail: Promise<unknown> = Promise.resolve();
function exclusive<T>(fn: () => Promise<T>): Promise<T> { const task = tail.then(fn); tail = task.catch(() => {}); return task; }
async function read(ownerId: string): Promise<OfflineRegister[]> {
  const raw = await AsyncStorage.getItem(key(ownerId));
  if (raw === null) return [];
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value) || value.some(v => !v || v.ownerId !== ownerId || typeof v.id !== 'string' || v.synced !== false)) throw new Error('La cola pendiente no es válida.');
  return value;
}
export async function saveOfflineRegister(request: RegisterRequest): Promise<OfflineRegister> {
  const scope = getAccountScope();
  if (!scope.ownerId) throw new Error('Iniciá sesión antes de guardar registros.');
  return exclusive(async () => {
    const existing = await read(scope.ownerId!);
    if (scope !== getAccountScope()) throw new Error('La cuenta cambió.');
    const entry: OfflineRegister = { id: `offline-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`, ownerId: scope.ownerId!, request, createdAt: new Date().toISOString(), synced: false };
    await AsyncStorage.setItem(key(scope.ownerId!), JSON.stringify([...existing, entry]));
    if (scope !== getAccountScope()) throw new Error('La cuenta cambió; el registro conserva su propietario original.');
    return entry;
  });
}
export async function getPendingRegisters(): Promise<OfflineRegister[]> {
  const scope = getAccountScope();
  if (!scope.ownerId) return [];
  const pending = await read(scope.ownerId);
  return scope === getAccountScope() ? pending : [];
}
export async function getPendingCount(): Promise<number> { return (await getPendingRegisters()).length; }
export async function clearOfflineRegisters(): Promise<void> {
  const scope = getAccountScope();
  if (!scope.ownerId) return;
  await exclusive(async () => {
    if (scope !== getAccountScope()) throw new Error('La cuenta cambió.');
    await AsyncStorage.removeItem(key(scope.ownerId!));
  });
}
export async function removeOfflineRegister(id: string): Promise<void> {
  const scope = getAccountScope();
  if (!scope.ownerId) throw new Error('Iniciá sesión para sincronizar.');
  await exclusive(async () => {
    const pending = await read(scope.ownerId!);
    if (scope !== getAccountScope()) throw new Error('La cuenta cambió.');
    await AsyncStorage.setItem(key(scope.ownerId!), JSON.stringify(pending.filter(v => v.id !== id)));
  });
}
