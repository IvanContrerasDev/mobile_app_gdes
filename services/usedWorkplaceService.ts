import { localPreferences } from './localPreferences';
const KEY = 'used-workplaces';
const strings = (v: unknown): string[] => Array.isArray(v) ? v.filter((s): s is string => typeof s === 'string') : [];
export async function getUsedWorkplaces(): Promise<string[]> { return strings(await localPreferences.read(KEY, [])); }
export async function saveUsedWorkplace(id: string): Promise<string[]> {
  return localPreferences.update<string[]>(KEY, [], value => [id, ...strings(value).filter(v => v !== id)]);
}
