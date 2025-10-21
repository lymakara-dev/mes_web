import api from "@/service/api";
import { AxiosResponse } from "axios";

// Assuming a basic interface for the history record returned by the API
export interface UserQuestionHistory {
  id: number;
  userId: number;
  questionId: number;
  startTime: string;
  endTime?: string;
}

const HISTORY_BASE_ENDPOINT = "user/user-question-history";

export function UserQuestionHistoryApi() {
  // ❌ Token handling REMOVED. Authentication is handled automatically 
  // by the apiService interceptor (using Cookies).

  return {
    /**
     * Records the start time of a user engaging with a question.
     * api.post returns the full AxiosResponse, so we extract .data.
     */
    startQuestion: async (questionId: number): Promise<UserQuestionHistory> => {
      const res: AxiosResponse<UserQuestionHistory> = await api.post(
        `${HISTORY_BASE_ENDPOINT}/${questionId}/start`,
        {}, // Pass empty body if the API expects one, or just the endpoint
      );
      return res.data;
    },

    /**
     * Records the end time of a user engaging with a question.
     * api.post returns the full AxiosResponse, so we extract .data.
     */
    endQuestion: async (questionId: number): Promise<UserQuestionHistory> => {
      const res: AxiosResponse<UserQuestionHistory> = await api.post(
        `${HISTORY_BASE_ENDPOINT}/${questionId}/end`,
        {}, // Pass empty body if the API expects one, or just the endpoint
      );
      return res.data;
    },
  };
}