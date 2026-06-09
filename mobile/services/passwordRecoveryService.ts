// Password recovery service (MVP - mock)
//
// TODO: Integrar endpoint real de recuperación de contraseña.
// TODO: Reemplazar respuesta mock por respuesta del backend.

export interface PasswordRecoveryResponse {
  success: boolean;
}

/**
 * Request a password recovery email.
 * Currently simulated; no real email is sent and no token is generated.
 *
 * @param email - The email address to send recovery instructions to.
 * @returns Promise resolving with the operation result.
 */
export async function requestPasswordRecovery(
  email: string
): Promise<PasswordRecoveryResponse> {
  // Simulate network/API latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // TODO: Reemplazar respuesta mock por respuesta del backend.
  return {
    success: true,
  };
}
