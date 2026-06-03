// Document upload service
import { DocumentUploadRequest, DocumentUploadResponse } from "../types/document";

/**
 * Upload documents to the server (placeholder implementation)
 * @param request - Document upload request containing workplace, months, and file URIs
 * @returns Promise<DocumentUploadResponse> - Upload result
 */
export async function uploadDocuments(
  request: DocumentUploadRequest
): Promise<DocumentUploadResponse> {
  // Log the request for debugging
  console.log("[v0] DocumentUploadRequest:", request);

  try {
    // Simulate network delay (1 second)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Implementar llamada real a la API de carga de documentos
    // El request contiene:
    // - workplace: ID del lugar de trabajo
    // - months: Array de meses seleccionados
    // - files: Array de URIs de los archivos a subir
    // - uploadedAt: Timestamp de la carga

    // Simulate successful upload
    return {
      success: true,
      message: "La planilla fue cargada correctamente.",
      documentId: `doc-${Date.now()}`,
    };
  } catch (error) {
    // Return error response
    return {
      success: false,
      message: "No fue posible cargar la planilla.\n\nPor favor, intente nuevamente.",
    };
  }
}
