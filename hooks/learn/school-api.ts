import api from "@/service/api";
import { AxiosResponse } from "axios"; // 👈 Import AxiosResponse for methods returning the full response

export interface School {
  id: number;
  name: string;
  logoUrl?: string;
}

export function SchoolApi() {
  return {
    // Get all schools
    // api.get returns the full AxiosResponse, so we extract .data
    getAll: async (): Promise<School[]> => {
      const res: AxiosResponse<School[]> = await api.get("/schools");
      return res.data;
    },

    // Get a single school
    // api.get returns the full AxiosResponse, so we extract .data
    getOne: async (id: number): Promise<School> => {
      const res: AxiosResponse<School> = await api.get(`/schools/${id}`);
      return res.data;
    },

    // Create a school with file upload
    // ⭐️ Use the dedicated api.upload method with POST ⭐️
    create: async (name: string, file: File): Promise<School> => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", file);

      // api.upload returns the full AxiosResponse, so we extract .data
      const res: AxiosResponse<School> = await api.upload("/schools", formData, 'POST');
      return res.data;
    },

    // Update school (name and optional file)
    // ⭐️ Use the dedicated api.upload method with PATCH ⭐️
    update: async (id: number, name: string, file?: File): Promise<School> => {
      const formData = new FormData();
      formData.append("name", name);
      if (file) formData.append("file", file);

      // api.upload returns the full AxiosResponse, so we extract .data
      const res: AxiosResponse<School> = await api.upload(`/schools/${id}`, formData, 'PATCH');
      return res.data;
    },

    // Delete school
    // ⭐️ Use api.delete, which returns the data (T) directly ⭐️
    remove: async (id: number): Promise<unknown> => {
      // api.delete takes endpoint and optional payload. We pass {} as payload
      // if your api.delete is defined to require it.
      const data = await api.delete<unknown>(`/schools/${id}`, {}); 
      return data; // data is already the resolved response body
    },
  };
}