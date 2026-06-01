// Offline Register Service
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RegisterRequest } from "../types/api";

const OFFLINE_REGISTERS_KEY = "offline-registers";

/**
 * Offline register record with sync status
 */
export interface OfflineRegister {
  id: string;
  request: RegisterRequest;
  createdAt: string;
  synced: false;
}

/**
 * Generate unique ID for offline register
 */
function generateId(): string {
  return `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Save a register request to local storage for later sync
 * @param request - The complete RegisterRequest to save
 * @returns Promise<OfflineRegister> - The saved offline register
 */
export async function saveOfflineRegister(
  request: RegisterRequest
): Promise<OfflineRegister> {
  try {
    // Get existing registers
    const existing = await getPendingRegisters();
    
    // Create new offline register
    const offlineRegister: OfflineRegister = {
      id: generateId(),
      request,
      createdAt: new Date().toISOString(),
      synced: false,
    };
    
    // Add to list
    const updated = [...existing, offlineRegister];
    
    // Save to AsyncStorage
    await AsyncStorage.setItem(OFFLINE_REGISTERS_KEY, JSON.stringify(updated));
    
    console.log("[v0] Registro guardado offline:", offlineRegister.id);
    
    return offlineRegister;
  } catch (error) {
    console.log("[v0] Error saving offline register:", error);
    throw new Error("No fue posible guardar el registro localmente.");
  }
}

/**
 * Get all pending (unsynced) registers from local storage
 * @returns Promise<OfflineRegister[]> - Array of pending registers
 */
export async function getPendingRegisters(): Promise<OfflineRegister[]> {
  try {
    const data = await AsyncStorage.getItem(OFFLINE_REGISTERS_KEY);
    
    if (!data) {
      return [];
    }
    
    const registers: OfflineRegister[] = JSON.parse(data);
    
    // Filter only unsynced registers
    return registers.filter((r) => r.synced === false);
  } catch (error) {
    console.log("[v0] Error getting pending registers:", error);
    return [];
  }
}

/**
 * Get count of pending registers
 * @returns Promise<number> - Number of pending registers
 */
export async function getPendingCount(): Promise<number> {
  const pending = await getPendingRegisters();
  return pending.length;
}

/**
 * Clear all offline registers (use after successful sync)
 */
export async function clearOfflineRegisters(): Promise<void> {
  try {
    await AsyncStorage.removeItem(OFFLINE_REGISTERS_KEY);
    console.log("[v0] Offline registers cleared");
  } catch (error) {
    console.log("[v0] Error clearing offline registers:", error);
  }
}

/**
 * Remove a specific register by ID (after successful sync)
 */
export async function removeOfflineRegister(id: string): Promise<void> {
  try {
    const existing = await getPendingRegisters();
    const updated = existing.filter((r) => r.id !== id);
    await AsyncStorage.setItem(OFFLINE_REGISTERS_KEY, JSON.stringify(updated));
    console.log("[v0] Offline register removed:", id);
  } catch (error) {
    console.log("[v0] Error removing offline register:", error);
  }
}
