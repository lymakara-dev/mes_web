import api from "@/service/api";
import { AxiosResponse } from "axios";

export interface Question {
  id: number;
  subjectId: number;
  content: string;
  contentType: string; // "TEXT" | "IMAGE" etc
  hint?: string;
  fileUrl?: string;
}

const QUESTIONS_ENDPOINT = "/questions";

export function QuestionApi() {
  return {
    /**
     * Fetches questions filtered by subject ID.
     * Note: Token handling is removed here as it belongs in the apiService interceptor.
     */
    getQuestionBySubjectId: async (id: string): Promise<Question[]> => {
      // ❌ Token handling REMOVED from here. It's centralized in apiService.

      // api.get returns the full AxiosResponse
      const res: AxiosResponse<Question[]> = await api.get(
        `${QUESTIONS_ENDPOINT}/subject`,
        { subjectId: id }, // Pass params object directly
      );

      return res.data;
    },

    /**
     * Fetches all questions.
     */
    getAll: async (): Promise<Question[]> => {
      // api.get returns the full AxiosResponse
      const res: AxiosResponse<Question[]> = await api.get(QUESTIONS_ENDPOINT);
      return res.data;
    },

    /**
     * Creates a new question, supporting file upload (multipart).
     * ⭐️ Uses the dedicated api.upload (POST) ⭐️
     */
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

      // Use api.upload (POST), which handles FormData and headers correctly
      const res: AxiosResponse<Question> = await api.upload(
        QUESTIONS_ENDPOINT,
        formData,
        "POST",
      );
      return res.data; // api.upload returns full response
    },

    /**
     * Updates an existing question, supporting file upload (multipart).
     * ⭐️ Uses the dedicated api.upload (PATCH) ⭐️
     */
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

      // Use api.upload (PATCH), which handles FormData and headers correctly
      const res: AxiosResponse<Question> = await api.upload(
        `${QUESTIONS_ENDPOINT}/${id}`,
        formData,
        "PATCH",
      );
      return res.data; // api.upload returns full response
    },

    /**
     * Deletes a question.
     * ⭐️ Uses api.delete, which returns the data (T) directly ⭐️
     */
    remove: async (id: number): Promise<void> => {
      // api.delete returns the response body directly.
      // We pass an empty object as payload for consistency if required by the definition.
      await api.delete<void>(`${QUESTIONS_ENDPOINT}/${id}`, {});
    },
  };
}
