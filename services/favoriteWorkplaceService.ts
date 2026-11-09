import { localPreferences } from './localPreferences';
const KEY = 'favorite-workplaces';
const strings = (v: unknown): string[] => Array.isArray(v) ? v.filter((s): s is string => typeof s === 'string') : [];
export async function getFavorites(): Promise<string[]> { return strings(await localPreferences.read(KEY, [])); }
export async function addFavorite(id: string): Promise<string[]> {
  return localPreferences.update<string[]>(KEY, [], (value) => [...new Set([...strings(value), id])]);
}
export async function removeFavorite(id: string): Promise<string[]> {
  return localPreferences.update<string[]>(KEY, [], (value) => strings(value).filter(v => v !== id));
}
export async function isFavorite(id: string): Promise<boolean> { return (await getFavorites()).includes(id); }
