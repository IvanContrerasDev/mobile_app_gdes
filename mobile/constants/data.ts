export const workplaces = [
  { id: "1", name: "Oficina Central" },
  { id: "2", name: "Sucursal Norte" },
  { id: "3", name: "Sucursal Sur" },
  { id: "4", name: "Bodega Principal" },
  { id: "5", name: "Centro de Distribucion" },
  { id: "6", name: "Oficina Administrativa" },
  { id: "7", name: "Planta de Produccion" },
];

export const documents = [
  { id: "1", name: "planilla_enero_01.jpg", date: "15 Ene 2024", status: "Cargado", month: "Enero" },
  { id: "2", name: "planilla_enero_02.jpg", date: "16 Ene 2024", status: "Pendiente", month: "Enero" },
  { id: "3", name: "planilla_febrero_01.jpg", date: "01 Feb 2024", status: "Cargado", month: "Febrero" },
  { id: "4", name: "planilla_febrero_02.jpg", date: "05 Feb 2024", status: "Cargado", month: "Febrero" },
  { id: "5", name: "planilla_marzo_01.jpg", date: "10 Mar 2024", status: "Pendiente", month: "Marzo" },
];

export const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const userProfile = {
  nombre: "Gina",
  apellido: "Tini",
  fechaNacimiento: "1990-05-15",
  fechaInicioContrato: "2024-01-10",
  dni: "32.456.789",
  cuil: "27-32456789-4",
  legajo: "EMP-2024-0156",
  telefono: "+54 11 5678-1234",
  email: "gina.tini@gmail.com",
  domicilio: "Av. Corrientes 1234, CABA",
  puesto: "Analista de Operaciones",
};

export const googleAccounts = [
  { id: "1", email: "gina.tini@gmail.com", name: "Gina Tini", avatar: "G" },
  { id: "2", email: "gina.trabajo@gmail.com", name: "Gina Trabajo", avatar: "G" },
  { id: "3", email: "usuario.demo@gmail.com", name: "Usuario Demo", avatar: "U" },
];

export const provincias = ["San Juan", "Mendoza", "Catamarca", "La Rioja", "Salta", "San Luis"];

export type ActionType = "entrada" | "salida" | "ausencia";
export type StatusState = "initial" | "entrada" | "salida" | "ausencia";
