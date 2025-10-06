import api from "@/service/api";

export function useAdminApi() {
  return {
    // ---------- SCHOOL ----------
    getSchools: async () => {
      const res = await api.get("/schools");
      return res.data;
    },

    createSchool: async (name: string) => {
      const res = await api.post("/schools", { name });
      return res.data;
    },

    updateSchool: async (id: number, name: string) => {
      const res = await api.patch(`/schools/${id}`, { name });
      return res.data;
    },

    deleteSchool: async (id: number) => {
      const res = await api.delete(`/schools/${id}`);
      return res.data;
    },

    // ---------- SUBJECT ----------
    getSubjects: async () => {
      const res = await api.get("/admin/subjects");
      return res.data;
    },

    createSubject: async (name: string, schoolId: number) => {
      const res = await api.post("/admin/subjects", { name, schoolId });
      return res.data;
    },

    updateSubject: async (id: number, name: string, schoolId: number) => {
      const res = await api.patch(`/admin/subjects/${id}`, { name, schoolId });
      return res.data;
    },

    deleteSubject: async (id: number) => {
      const res = await api.delete(`/admin/subjects/${id}`);
      return res.data;
    },
  };
}
