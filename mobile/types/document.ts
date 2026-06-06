// Document upload types

export interface DocumentUploadRequest {
  workplace: string;
  months: string[];
  files: string[]; // Array of file URIs
  uploadedAt: string;
}

export interface DocumentUploadResponse {
  success: boolean;
  message: string;
  documentId?: string;
}

// Mock workplaces for document upload
export const documentWorkplaces = [
  { id: "wp-001", name: "Hospital Central" },
  { id: "wp-002", name: "Hospital Norte" },
  { id: "wp-003", name: "Clinica San Jose" },
];
