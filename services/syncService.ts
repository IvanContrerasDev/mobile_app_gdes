// Sync Service
// Handles automatic synchronization of offline registers when connectivity is restored

import { getPendingRegisters, removeOfflineRegister } from "./offlineRegisterService";
import { registerEvent } from "./registerService";
import { getAccountScope } from "./accountScope";

/**
 * Synchronize all pending offline registers
 * Processes each register one by one, removing successfully synced ones
 * Failed syncs are kept in the queue for the next attempt
 */
export async function syncPendingRegisters(): Promise<void> {
  console.log("[v0] Sincronizando pendientes...");
  
  const scope = getAccountScope();
  if (!scope.ownerId) return;
  const pendingRegisters = await getPendingRegisters();
  
  if (pendingRegisters.length === 0) {
    console.log("[v0] No hay registros pendientes para sincronizar");
    return;
  }
  
  console.log(`[v0] Encontrados ${pendingRegisters.length} registros pendientes`);
  
  for (const offlineRegister of pendingRegisters) {
    if (scope !== getAccountScope() || offlineRegister.ownerId !== scope.ownerId) return;
    try {
      // Attempt to sync this register
      const response = await registerEvent(offlineRegister.request);
      
      if (scope !== getAccountScope()) return;
      if (response.success) {
        // Successfully synced - remove from queue
        await removeOfflineRegister(offlineRegister.id);
        console.log("[v0] Registro sincronizado:", offlineRegister.id);
      } else {
        // API returned error - keep in queue for retry
        console.log("[v0] Fallo al sincronizar (API error):", offlineRegister.id, response.message);
      }
    } catch (error) {
      // Network or other error - keep in queue for retry
      console.log("[v0] Fallo al sincronizar (exception):", offlineRegister.id, error);
    }
  }
  
  console.log("[v0] Sincronizacion finalizada");
}
