// Contingency documentation upload service (mock)
import { ContingencyUploadRequest, ContingencyUploadResponse } from "../types/document";

/**
 * Upload contingency documentation to the server.
 *
 * TODO: Integrar endpoint real de carga documental.
 * TODO: Asociar documentos al usuario autenticado.
 * TODO: Asociar documentos al workplace seleccionado.
 */
export async function uploadDocuments(
  request: ContingencyUploadRequest
): Promise<ContingencyUploadResponse> {
  console.log("[v0] ContingencyUploadRequest:", request);

  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      success: true,
      message: "Documentación enviada correctamente.",
    };
  } catch (error) {
    return {
      success: false,
      message: "No fue posible enviar la documentación.\n\nPor favor, intente nuevamente.",
    };
  }
}
