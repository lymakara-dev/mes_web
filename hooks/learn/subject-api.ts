import api from "@/service/api";

export interface Subject {
  id: number;
  name: string;
  schoolId: number;
  logoUrl?: string;
}
export function SubjectApi() {
  return {
    getSubjectBySchool: async (schoolId: number) => {
      const res = await api.get(`subjects/school`, {
        params: { schoolId },
      });
      console.log("subject res", res.data);
      return res.data;
    },

    getAll: async (): Promise<Subject[]> => {
      const res = await api.get("/subjects");
      console.log("all subject", res.data.rows);
      return res.data.rows;
    },

    create: async (
      name: string,
      schoolId: number,
      file: File,
    ): Promise<Subject> => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("schoolId", schoolId.toString());
      formData.append("file", file);

      const res = await api.post("/subjects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },

    update: async (
      id: number,
      name: string,
      schoolId: number,
      file?: File,
    ): Promise<Subject> => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("schoolId", schoolId.toString());
      if (file) formData.append("image", file);

      const res = await api.patch(`/subjects/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },

    remove: async (id: number): Promise<void> => {
      await api.delete(`/subjects/${id}`);
    },
  };
}
