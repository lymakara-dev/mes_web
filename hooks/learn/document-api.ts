import api from "@/service/api";
import { AxiosResponse } from "axios";

// Assuming IPaginatedDocuments structure from the file import:
// interface IPaginatedDocuments { rows: Document[]; count: number; }
import { IPaginatedDocuments } from "@/app/learn/admin/documents/page";

export interface Document {
  id: number;
  title: string;
  description?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  uploadedBy?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentDto {
  title: string;
  description?: string;
}

export interface UpdateDocumentDto {
  title?: string;
  description?: string;
}

const DOCUMENTS_ENDPOINT = "/documents";

export function DocumentApi() {
  return {
    // Fetches paginated documents.
    // api.get returns the full AxiosResponse, so we extract .data.
    getDocuments: async (
      queryString: string = "",
    ): Promise<IPaginatedDocuments> => {
      // Note: If using query string, ensure it starts with '?' if not empty.
      // Better to pass query params as an object to api.get if possible.
      const endpoint = queryString
        ? `${DOCUMENTS_ENDPOINT}${queryString}`
        : DOCUMENTS_ENDPOINT;

      const res: AxiosResponse<IPaginatedDocuments> = await api.get(endpoint);
      console.log("data doc calls", res.data);
      return res.data;
    },

    // Fetches a single document.
    // api.get returns the full AxiosResponse, so we extract .data.
    getDocument: async (id: number): Promise<Document> => {
      const res: AxiosResponse<Document> = await api.get(
        `${DOCUMENTS_ENDPOINT}/${id}`,
      );
      return res.data;
    },

    // Creates a document, supporting file upload (multipart).
    // ⭐️ Uses the dedicated api.upload (POST) ⭐️
    createDocument: async (
      dto: CreateDocumentDto,
      file?: File,
    ): Promise<Document> => {
      const formData = new FormData();
      formData.append("title", dto.title);
      if (dto.description) formData.append("description", dto.description);
      // Assuming backend expects 'file' for the document file
      if (file) formData.append("file", file);

      // Use api.upload (POST), which handles FormData and headers correctly
      const res: AxiosResponse<Document> = await api.upload(
        DOCUMENTS_ENDPOINT,
        formData,
        "POST",
      );
      return res.data;
    },

    // Updates a document, supporting file upload (multipart).
    // ⭐️ Uses the dedicated api.upload (PATCH) ⭐️
    updateDocument: async (
      id: number,
      dto: UpdateDocumentDto,
      file?: File,
    ): Promise<Document> => {
      const formData = new FormData();
      // Only append fields that are present in the DTO or the file
      if (dto.title) formData.append("title", dto.title);
      if (dto.description) formData.append("description", dto.description);
      if (file) formData.append("file", file);

      // Use api.upload (PATCH), which handles FormData and headers correctly
      const res: AxiosResponse<Document> = await api.upload(
        `${DOCUMENTS_ENDPOINT}/${id}`,
        formData,
        "PATCH",
      );
      return res.data;
    },

    // Deletes a document.
    // ⭐️ Uses api.delete, which returns the data (T) directly ⭐️
    deleteDocument: async (id: number): Promise<unknown> => {
      // api.delete returns the response body directly, so no .data access is needed.
      const data = await api.delete<unknown>(`${DOCUMENTS_ENDPOINT}/${id}`, {});
      return data;
    },
  };
}
