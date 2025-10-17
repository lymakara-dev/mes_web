import api from "@/service/api";

export interface Answer {
  id: number;
  questionId: number;
  content: string;
  contentType: string;
  isCorrect: boolean;
  fileUrl?: string;
}

export function AnswerApi() {
  return {
    getByQuestion: async (questionId: number): Promise<Answer[]> => {
      const res = await api.get("/answers/question", {
        params: { questionId },
      });
      return res.data;
    },

    create: async (
      questionId: number,
      content: string,
      contentType: string,
      isCorrect: boolean,
      file?: File,
    ): Promise<Answer> => {
      const formData = new FormData();
      formData.append("questionId", questionId.toString());
      formData.append("content", content);
      formData.append("contentType", contentType);
      formData.append("isCorrect", String(isCorrect));
      if (file) formData.append("file", file);

      const res = await api.post("/answers", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },

    update: async (
      id: number,
      content: string,
      contentType: string,
      isCorrect: boolean,
      file?: File,
    ): Promise<Answer> => {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("contentType", contentType);
      formData.append("isCorrect", String(isCorrect));
      if (file) formData.append("file", file);

      const res = await api.patch(`/answers/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },

    remove: async (id: number): Promise<void> => {
      await api.delete(`/answers/${id}`);
    },
  };
}
