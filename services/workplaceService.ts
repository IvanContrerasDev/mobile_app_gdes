import { Workplace } from "../types/workplace";

// TODO: Reemplazar datos mock por endpoint real de workplaces.
const MOCK_WORKPLACES: Workplace[] = [
  {
    id: "wp-1",
    name: "Hospital Central",
    siteId: "site-1",
    siteName: "Córdoba Capital",
    active: true,
  },
  {
    id: "wp-2",
    name: "Hospital Norte",
    siteId: "site-1",
    siteName: "Córdoba Capital",
    active: true,
  },
  {
    id: "wp-3",
    name: "Clínica San José",
    siteId: "site-1",
    siteName: "Córdoba Capital",
    active: true,
  },
];

/**
 * Obtiene la lista de lugares de trabajo disponibles.
 * Actualmente retorna datos mock simulando una llamada a la API.
 *
 * TODO: Reemplazar datos mock por endpoint real de workplaces.
 */
export async function getWorkplaces(): Promise<Workplace[]> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  return MOCK_WORKPLACES;
}
