import api from "@/service/api";
import { darkLayout } from "@heroui/react";
import { AxiosResponse } from "axios";

export interface Answer {
  id: number;
  questionId: number;
  content: string;
  contentType: string;
  isCorrect: boolean;
  fileUrl?: string;
}

const ANSWERS_ENDPOINT = "/answers";

export function AnswerApi() {
  return {
    // Fetches answers for a specific question.
    // api.get returns the full AxiosResponse, so we extract .data.
    getByQuestion: async (questionId: number): Promise<Answer[]> => {
      const res: AxiosResponse<Answer[]> = await api.get(
        `${ANSWERS_ENDPOINT}/question`,
        {
          params: { questionId },
        },
      );

      console.log("========answer", res.data);
      return res.data;
    },

    // Creates a new answer, supporting file upload (multipart).
    // ⭐️ Uses the dedicated api.upload (POST) ⭐️
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
      if (file) formData.append("file", file); // Assuming backend expects 'file'

      // Use api.upload (POST), which handles FormData and headers correctly
      const res: AxiosResponse<Answer> = await api.upload(
        ANSWERS_ENDPOINT,
        formData,
        "POST",
      );
      return res.data; // api.upload returns full response
    },

    // Updates an existing answer, supporting file upload (multipart).
    // ⭐️ Uses the dedicated api.upload (PATCH) ⭐️
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
      if (file) formData.append("file", file); // Assuming backend expects 'file'

      // Use api.upload (PATCH), which handles FormData and headers correctly
      const res: AxiosResponse<Answer> = await api.upload(
        `${ANSWERS_ENDPOINT}/${id}`,
        formData,
        "PATCH",
      );
      return res.data; // api.upload returns full response
    },

    // Deletes an answer.
    // ⭐️ Uses api.delete, which returns the data (T) directly ⭐️
    remove: async (id: number): Promise<void> => {
      // api.delete returns the response body directly, pass {} as payload for consistency
      await api.delete<void>(`${ANSWERS_ENDPOINT}/${id}`, {});
    },
  };
}
