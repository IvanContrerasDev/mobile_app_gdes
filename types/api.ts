// API Types for Registration

export type RegisterAction = "entrada" | "salida" | "ausencia";

export interface RegisterRequest {
  workplaceId: string;
  action: RegisterAction;
  observation?: string;
  timestamp: string;
  // Location data
  latitude: number;
  longitude: number;
  accuracy: number;
  locationTimestamp: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  registrationId?: string;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
}
