import * as Location from "expo-location";

/**
 * Location data returned by getCurrentLocation
 */
export interface CurrentLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

/**
 * Location error types for specific handling
 */
export type LocationErrorType = 
  | "PERMISSION_DENIED"
  | "TIMEOUT"
  | "GENERIC";

export class LocationError extends Error {
  type: LocationErrorType;
  
  constructor(message: string, type: LocationErrorType) {
    super(message);
    this.type = type;
    this.name = "LocationError";
  }
}

// Timeout duration in milliseconds (120 seconds)
const LOCATION_TIMEOUT_MS = 120000;

/**
 * Get current device location with high accuracy
 * 
 * - Requests foreground permissions if not granted
 * - Uses real-time location (not cached or last known)
 * - Implements 120 second timeout
 * 
 * @returns CurrentLocation object with lat, lng, accuracy, and timestamp
 * @throws LocationError with specific type for permission denied, timeout, or generic errors
 */
export async function getCurrentLocation(): Promise<CurrentLocation> {
  // Request foreground permissions
  const { status } = await Location.requestForegroundPermissionsAsync();
  
  if (status !== "granted") {
    throw new LocationError(
      "No se otorgaron permisos de ubicación.",
      "PERMISSION_DENIED"
    );
  }
  
  // Create a promise race between location fetch and timeout
  const locationPromise = Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new LocationError(
        "No fue posible obtener su ubicación actual dentro del tiempo permitido.",
        "TIMEOUT"
      ));
    }, LOCATION_TIMEOUT_MS);
  });
  
  try {
    // Race between getting location and timeout
    const position = await Promise.race([locationPromise, timeoutPromise]);
    
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy ?? 0,
      timestamp: new Date(position.timestamp).toISOString(),
    };
  } catch (error) {
    // Re-throw if it's already a LocationError (permission or timeout)
    if (error instanceof LocationError) {
      throw error;
    }
    
    // Generic error for any other issues
    throw new LocationError(
      "No fue posible obtener su ubicación actual. Verifique que el GPS esté habilitado e intente nuevamente.",
      "GENERIC"
    );
  }
}
