import api from "@/service/api";

export interface Question {
  id: number;
  subjectId: number;
  content: string;
  contentType: string; // "TEXT" | "IMAGE" etc
  hint?: string;
  fileUrl?: string;
}

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

    getAll: async (): Promise<Question[]> => {
      const res = await api.get("/questions");
      return res.data;
    },

    create: async (
      subjectId: number,
      content: string,
      contentType: string,
      hint?: string,
      file?: File,
    ): Promise<Question> => {
      const formData = new FormData();
      formData.append("subjectId", subjectId.toString());
      formData.append("content", content);
      formData.append("contentType", contentType);
      if (hint) formData.append("hint", hint);
      if (file) formData.append("file", file);

      const res = await api.post("/questions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },

    update: async (
      id: number,
      subjectId: number,
      content: string,
      contentType: string,
      hint?: string,
      file?: File,
    ): Promise<Question> => {
      const formData = new FormData();
      formData.append("subjectId", subjectId.toString());
      formData.append("content", content);
      formData.append("contentType", contentType);
      if (hint) formData.append("hint", hint);
      if (file) formData.append("file", file);

      const res = await api.patch(`/questions/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },

    remove: async (id: number): Promise<void> => {
      await api.delete(`/questions/${id}`);
    },
  };
}
