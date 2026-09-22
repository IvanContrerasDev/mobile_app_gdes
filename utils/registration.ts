export function formatBirthDate(value: string, previous = ""): string {
  let digits = value.replace(/\D/g, "").slice(0, 8);
  // Al borrar una barra automática también se borra el dígito anterior.
  if (previous.endsWith("/") && value === previous.slice(0, -1)) {
    digits = digits.slice(0, -1);
  }
  if (digits.length < 2) return digits;
  if (digits.length < 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function validatePasswordConfirmation(password: string, confirmation: string): string | null {
  if (!confirmation) return "Repetí la contraseña";
  return password === confirmation ? null : "Las contraseñas no coinciden";
}

export function validateBirthDate(value: string): string | null {
  if (!value) return "Este campo es obligatorio";
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return "Completá la fecha en formato DD/MM/AAAA";
  const [day, month, year] = value.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  if (year < 1000 || date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day || date > new Date()) {
    return "Ingresá una fecha de nacimiento válida";
  }
  return null;
}
