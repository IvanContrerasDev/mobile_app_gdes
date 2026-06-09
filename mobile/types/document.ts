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

// Allowed file extensions for contingency documentation
export const ALLOWED_EXTENSIONS = [
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "docx",
  "doc",
  "txt",
] as const;

// A single attached file selected by the user
export interface SelectedFile {
  uri: string;
  name: string;
  type: string; // extension, e.g. "pdf"
  size: number; // bytes
}

export interface ContingencyUploadRequest {
  workplaceId: string | null;
  files: SelectedFile[];
  uploadedAt: string;
}

export interface ContingencyUploadResponse {
  success: boolean;
  message: string;
}

// Mock workplaces for document upload
export const documentWorkplaces = [
  { id: "wp-001", name: "Hospital Central" },
  { id: "wp-002", name: "Hospital Norte" },
  { id: "wp-003", name: "Clinica San Jose" },
];
