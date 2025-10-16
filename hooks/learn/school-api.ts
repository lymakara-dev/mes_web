import api from "@/service/api";

export interface School {
  id: number;
  name: string;
  logoUrl?: string;
}

export function SchoolApi() {
  return {
    // Get all schools
    getAll: async (): Promise<School[]> => {
      const res = await api.get("/schools");
      return res.data;
    },

    // Get a single school
    getOne: async (id: number): Promise<School> => {
      const res = await api.get(`/schools/${id}`);
      return res.data;
    },

    // Create a school with file upload
    create: async (name: string, file: File): Promise<School> => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", file);

      const res = await api.post("/schools", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },

    // Update school (name and optional file)
    update: async (id: number, name: string, file?: File): Promise<School> => {
      const formData = new FormData();
      formData.append("name", name);
      if (file) formData.append("file", file);

      const res = await api.patch(`/schools/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },

    // Delete school
    remove: async (id: number) => {
      const res = await api.delete(`/schools/${id}`);
      return res.data;
    },
  };
}
