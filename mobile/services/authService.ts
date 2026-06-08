import { AuthUser } from "../stores/authStore";

// TODO: Reemplazar autenticación mock por API real.

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  message?: string;
}

// Mock credentials (MVP only)
const MOCK_EMAIL = "empleado@gdes.com";
const MOCK_PASSWORD = "123456";

const MOCK_USER: AuthUser = {
  id: "usr-001",
  nombre: "Juan",
  apellido: "Pérez",
  email: MOCK_EMAIL,
  legajo: "12345",
};

/**
 * Simulated login.
 * TODO: Reemplazar autenticación mock por API real.
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === MOCK_EMAIL && password === MOCK_PASSWORD) {
    return {
      success: true,
      user: MOCK_USER,
    };
  }

  return {
    success: false,
    message: "Usuario o contraseña incorrectos.",
  };
}
