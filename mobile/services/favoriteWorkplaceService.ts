// Favorite Workplaces Service
// Encapsulates local persistence of favorite workplace IDs.
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "favorite-workplaces";

// TODO: Sincronizar favoritos con backend cuando exista API.

/**
 * Get all favorite workplace IDs from local storage.
 * @returns Promise<string[]> - array of workplace IDs
 */
export async function getFavorites(): Promise<string[]> {
  try {
    const stored = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.log("[v0] Error reading favorites:", error);
    return [];
  }
}

/**
 * Add a workplace to favorites.
 * @param workplaceId - the workplace ID to add
 * @returns Promise<string[]> - the updated list of favorite IDs
 */
export async function addFavorite(workplaceId: string): Promise<string[]> {
  const favorites = await getFavorites();
  if (favorites.includes(workplaceId)) {
    return favorites;
  }
  const updated = [...favorites, workplaceId];
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Remove a workplace from favorites.
 * @param workplaceId - the workplace ID to remove
 * @returns Promise<string[]> - the updated list of favorite IDs
 */
export async function removeFavorite(workplaceId: string): Promise<string[]> {
  const favorites = await getFavorites();
  const updated = favorites.filter((id) => id !== workplaceId);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Check whether a workplace is marked as favorite.
 * @param workplaceId - the workplace ID to check
 * @returns Promise<boolean>
 */
export async function isFavorite(workplaceId: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.includes(workplaceId);
}
