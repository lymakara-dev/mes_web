import api from "@/service/api";

export function QuestionApi() {
  return {
    getQuestionBySubjectId: async (id: string) => {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await api.get(`/questions/subject?subjectId=${id}`);

      return res.data;
    },
  };
}
