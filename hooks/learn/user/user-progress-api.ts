import api from "@/service/api";

export function UserProgressApi() {
  return {
    startLearning: async (subjectId: number) => {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await api.post(`user-progress/${subjectId}/start`);
      return res.data;
    },

    resetProgress: async (subjectId: number) => {
      const token = localStorage.getItem("token");

      if (token) {
        api.defaults.headers.common["Authorization"] = `Barear ${token}`;
      }

      const res = await api.delete(`user-progress/${subjectId}/reset`);
      return res.data;
    },
  };
}
