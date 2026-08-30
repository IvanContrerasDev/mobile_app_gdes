// Used Workplaces Service
// Encapsulates local persistence of workplace IDs that have been used before.
import AsyncStorage from "@react-native-async-storage/async-storage";

const USED_KEY = "used-workplaces";

// TODO: Reemplazar ranking local por preferencias calculadas desde backend.

/**
 * Get all previously used workplace IDs from local storage.
 * @returns Promise<string[]> - array of workplace IDs
 */
export async function getUsedWorkplaces(): Promise<string[]> {
  try {
    const stored = await AsyncStorage.getItem(USED_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.log("[v0] Error reading used workplaces:", error);
    return [];
  }
}

/**
 * Save a workplace as used. Most recently used is kept at the front,
 * without duplicates.
 * @param workplaceId - the workplace ID that was used
 * @returns Promise<string[]> - the updated list of used IDs
 */
export async function saveUsedWorkplace(workplaceId: string): Promise<string[]> {
  try {
    const used = await getUsedWorkplaces();
    // Move to front, remove any existing duplicate
    const updated = [workplaceId, ...used.filter((id) => id !== workplaceId)];
    await AsyncStorage.setItem(USED_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.log("[v0] Error saving used workplace:", error);
    return [];
  }
}
