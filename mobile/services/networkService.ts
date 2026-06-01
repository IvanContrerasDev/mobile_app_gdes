// Network connectivity service
import NetInfo from "@react-native-community/netinfo";

/**
 * Check if device has internet connectivity
 * @returns Promise<boolean> - true if online, false if offline
 */
export async function isOnline(): Promise<boolean> {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected === true && state.isInternetReachable === true;
  } catch (error) {
    // If we can't determine connectivity, assume offline for safety
    console.log("[v0] Network check failed, assuming offline:", error);
    return false;
  }
}
