import { localPreferences } from './localPreferences';
const KEY = 'recent-workplaces';
interface RecentWorkplaces { morningWorkplaceId: string | null; afternoonWorkplaceId: string | null }
const EMPTY: RecentWorkplaces = { morningWorkplaceId: null, afternoonWorkplaceId: null };
const period = () => { const hour = new Date().getHours(); return hour >= 6 && hour < 12 ? 'morningWorkplaceId' : 'afternoonWorkplaceId'; };
export async function saveRecentWorkplace(id: string): Promise<void> {
  await localPreferences.update<RecentWorkplaces>(KEY, EMPTY, current => ({ ...current, [period()]: id }));
}
export async function getRecentWorkplaceForCurrentPeriod(): Promise<string | null> {
  const recent = await localPreferences.read<RecentWorkplaces>(KEY, EMPTY);
  const id = recent?.[period()]; return typeof id === 'string' ? id : null;
}
