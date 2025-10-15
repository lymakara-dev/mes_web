import api from "@/service/api";

export function UserQuestionHistoryApi() {
  return {
    startQuestion: async (questionId: number) => {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await api.post(
        `user/user-question-history/${questionId}/start`,
      );
      return res.data;
    },

    endQuestion: async (questionId: number) => {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await api.post(
        `user/user-question-history/${questionId}/end`,
      );
      return res.data;
    },
  };
}
