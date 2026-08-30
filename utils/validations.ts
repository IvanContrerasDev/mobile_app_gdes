export function validateEmailOrLegajo(value: string): string | null {
  if (!value.trim()) return "Este campo es obligatorio";
  
  if (value.includes("@")) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "El email debe tener un formato valido (ej: usuario@gmail.com)";
    }
    return null;
  }
  
  const legajoRegex = /^\d+$/;
  if (!legajoRegex.test(value)) {
    return "El legajo debe contener solo numeros";
  }
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "Este campo es obligatorio";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "El email debe tener un formato valido (ej: usuario@gmail.com)";
  }
  return null;
}

/**
 * Reusable password validation.
 * Enforces the system password policy:
 * - minimo 8 caracteres
 * - al menos una letra mayuscula
 * - al menos una letra minuscula
 * - al menos un numero
 * - al menos un simbolo especial
 * - sin espacios
 *
 * TODO: Reutilizar en Registro, Cambio de contraseña, Recuperación y backend.
 */
export function validatePassword(password: string): string | null {
  if (!password.trim()) return "Este campo es obligatorio";
  
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const hasNoSpaces = !/\s/.test(password);
  
  if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSymbol || !hasNoSpaces) {
    return "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un numero y un símbolo, sin espacios.";
  }
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone.trim()) return "Este campo es obligatorio";
  if (!/^\d+$/.test(phone)) {
    return "Solo numeros, sin espacios ni símbolos";
  }
  if (phone.length < 10 || phone.length > 13) {
    return "El numero debe tener entre 10 y 13 dígitos";
  }
  return null;
}

export function validateDNI(dni: string): string | null {
  if (!dni.trim()) return "Este campo es obligatorio";
  if (!/^\d+$/.test(dni)) {
    return "Solo numeros, sin puntos ni espacios";
  }
  if (dni.length < 7 || dni.length > 8) {
    return "El DNI debe tener 7 u 8 dígitos";
  }
  return null;
}

export function validateLegajo(legajo: string): string | null {
  if (!legajo.trim()) return "Este campo es obligatorio";
  if (!/^\d+$/.test(legajo)) {
    return "El legajo debe contener solo numeros";
  }
  return null;
}

export function validateOTPCode(code: string): string | null {
  if (!code || code.length < 6) {
    return "Código inválido. Debe contener 6 dígitos numéricos sin letras ni símbolos.";
  }
  if (!/^\d{6}$/.test(code)) {
    return "Código inválido. Debe contener 6 dígitos numéricos sin letras ni símbolos.";
  }
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value.trim()) return "Este campo es obligatorio";
  return null;
}
