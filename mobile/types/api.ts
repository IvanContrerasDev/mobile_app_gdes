// API Types for Registration

export type RegisterAction = "entrada" | "salida" | "ausencia";

export interface RegisterRequest {
  workplaceId: string;
  action: RegisterAction;
  observation?: string;
  timestamp: string;
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
