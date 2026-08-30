// Recent workplace service
// Remembers the last workplace used per time period (morning / afternoon)
// so the most likely workplace can be preselected on a new registration.
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "recent-workplaces";

// Time period of the day
type TimePeriod = "morning" | "afternoon";

interface RecentWorkplaces {
  morningWorkplaceId: string | null;
  afternoonWorkplaceId: string | null;
}

const EMPTY_STATE: RecentWorkplaces = {
  morningWorkplaceId: null,
  afternoonWorkplaceId: null,
};

/**
 * Determine the current time period.
 * Morning: 06:00 -> 11:59
 * Afternoon: 12:00 -> 23:59
 * (Hours outside these ranges default to afternoon as the closest match.)
 */
function getCurrentPeriod(): TimePeriod {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) {
    return "morning";
  }
  return "afternoon";
}

/**
 * Read the stored recent workplaces.
 */
async function getRecentWorkplaces(): Promise<RecentWorkplaces> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_STATE };
    const parsed = JSON.parse(raw) as RecentWorkplaces;
    return {
      morningWorkplaceId: parsed.morningWorkplaceId ?? null,
      afternoonWorkplaceId: parsed.afternoonWorkplaceId ?? null,
    };
  } catch (error) {
    console.log("[v0] Failed to read recent workplaces:", error);
    return { ...EMPTY_STATE };
  }
}

/**
 * Save a workplace as the most recent one for the current time period.
 */
export async function saveRecentWorkplace(workplaceId: string): Promise<void> {
  try {
    const current = await getRecentWorkplaces();
    const period = getCurrentPeriod();

    const updated: RecentWorkplaces = {
      ...current,
      ...(period === "morning"
        ? { morningWorkplaceId: workplaceId }
        : { afternoonWorkplaceId: workplaceId }),
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.log("[v0] Failed to save recent workplace:", error);
  }
}

/**
 * Get the most recent workplace id for the current time period.
 * Returns null if none stored.
 *
 * TODO: Utilizar esta información para ordenar workplaces por relevancia.
 */
export async function getRecentWorkplaceForCurrentPeriod(): Promise<string | null> {
  const recent = await getRecentWorkplaces();
  const period = getCurrentPeriod();
  return period === "morning"
    ? recent.morningWorkplaceId
    : recent.afternoonWorkplaceId;
}
