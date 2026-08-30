// Network connectivity service
import NetInfo, { NetInfoState, NetInfoSubscription } from "@react-native-community/netinfo";

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

/**
 * Subscribe to connectivity changes
 * Detects when device transitions from offline to online
 * @param onOnline - Callback to execute when device comes online
 * @returns Unsubscribe function to remove the listener
 */
export function subscribeToConnectivity(
  onOnline: () => void
): NetInfoSubscription {
  let wasOffline = false;
  
  return NetInfo.addEventListener((state: NetInfoState) => {
    const isCurrentlyOnline = state.isConnected === true && state.isInternetReachable === true;
    
    if (wasOffline && isCurrentlyOnline) {
      // Transition from offline to online detected
      console.log("[v0] Conectividad restaurada - ejecutando sync");
      onOnline();
    }
    
    // Update previous state
    wasOffline = !isCurrentlyOnline;
  });
}
