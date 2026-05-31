// Registration Service
// This service handles all registration-related API calls
// Currently uses placeholder/mock implementation

import { RegisterRequest, RegisterResponse } from "../types/api";

/**
 * Register an event (entrada, salida, ausencia)
 * @param request - The registration request data
 * @returns Promise with the registration response
 */
export async function registerEvent(
  request: RegisterRequest
): Promise<RegisterResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Placeholder response - will be replaced with real API call
  // TODO: Replace with actual fetch/axios call when backend is ready
  
  return {
    success: true,
    message: "Registro realizado correctamente",
    registrationId: `REG-${Date.now()}`,
  };
}

/**
 * Simulate an API error for testing purposes
 * Can be toggled during development
 */
export async function registerEventWithError(
  request: RegisterRequest
): Promise<RegisterResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate error response
  return {
    success: false,
    message: "Error del sistema al registrar. Por favor, intente nuevamente.",
  };
}
