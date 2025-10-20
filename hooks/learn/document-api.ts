import { IPaginatedDocuments } from "@/app/learn/admin/documents/page";
import api from "@/service/api";

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

export function DocumentApi() {
  return {
    getDocuments: async (
      queryString: string = "",
    ): Promise<IPaginatedDocuments> => {
      const res = await api.get(`/documents${queryString}`);
      console.log("data doc calls", res.data);
      return res.data;
    },

    getDocument: async (id: number): Promise<Document> => {
      const res = await api.get(`/documents/${id}`);
      return res.data;
    },

    createDocument: async (dto: CreateDocumentDto, file?: File) => {
      const formData = new FormData();
      formData.append("title", dto.title);
      if (dto.description) formData.append("description", dto.description);
      if (file) formData.append("file", file);

      const res = await api.post("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },

    updateDocument: async (id: number, dto: UpdateDocumentDto, file?: File) => {
      const formData = new FormData();
      if (dto.title) formData.append("title", dto.title);
      if (dto.description) formData.append("description", dto.description);
      if (file) formData.append("file", file);

      const res = await api.patch(`/documents/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },

    deleteDocument: async (id: number) => {
      const res = await api.delete(`/documents/${id}`);
      return res.data;
    },
  };
}
