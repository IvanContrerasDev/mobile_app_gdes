// Workplace relevance sorting
// Orders workplaces to reduce the interactions needed to find the right one.
import { Workplace } from "../types/workplace";

// TODO: Reemplazar ranking local por preferencias calculadas desde backend.

/**
 * Sort workplaces by relevance, following the product-defined priority:
 *   1. Last workplace used in the current time period
 *   2. Favorites
 *   3. Previously used workplaces
 *   4. All remaining workplaces
 *
 * Each workplace appears only once (first matching tier wins).
 *
 * @param workplaces - the full list of workplaces
 * @param recentWorkplaceId - the last used workplace ID for the current period (or null)
 * @param favoriteIds - list of favorite workplace IDs
 * @param usedWorkplaceIds - list of previously used workplace IDs (most recent first)
 * @returns Workplace[] - ordered by relevance
 */
export function sortWorkplacesByRelevance(
  workplaces: Workplace[],
  recentWorkplaceId: string | null,
  favoriteIds: string[],
  usedWorkplaceIds: string[]
): Workplace[] {
  const byId = new Map(workplaces.map((wp) => [wp.id, wp]));
  const ordered: Workplace[] = [];
  const seen = new Set<string>();

  const push = (id: string) => {
    if (seen.has(id)) return;
    const wp = byId.get(id);
    if (!wp) return;
    ordered.push(wp);
    seen.add(id);
  };

  // 1. Last used in current period
  if (recentWorkplaceId) {
    push(recentWorkplaceId);
  }

  // 2. Favorites (preserve their given order)
  for (const id of favoriteIds) {
    push(id);
  }

  // 3. Previously used (most recent first)
  for (const id of usedWorkplaceIds) {
    push(id);
  }

  // 4. Everything else (preserve original order)
  for (const wp of workplaces) {
    push(wp.id);
  }

  return ordered;
}
