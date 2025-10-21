import api from "@/service/api";
import { AxiosResponse } from "axios";

// Define a basic interface for the UserProgress record returned by the API
export interface UserProgress {
  id: number;
  userId: number;
  subjectId: number;
  status: "STARTED" | "COMPLETED" | "IN_PROGRESS";
  progressPercentage: number;
  lastUpdated: string;
}

const PROGRESS_BASE_ENDPOINT = "user-progress";

export function UserProgressApi() {
  // ❌ REMOVED: Manual token handling using localStorage and api.defaults.headers.
  // Authentication is handled automatically by the apiService interceptor (using Cookies).

  return {
    /**
     * Starts the learning progress for a subject.
     * api.post returns the full AxiosResponse, so we extract .data.
     */
    startLearning: async (subjectId: number): Promise<UserProgress> => {
      const res: AxiosResponse<UserProgress> = await api.post(
        `${PROGRESS_BASE_ENDPOINT}/${subjectId}/start`,
        {}, // Pass empty body if the API expects one, or just the endpoint
      );
      return res.data;
    },

    /**
     * Updates the user's progress for a subject (e.g., marks a new question as complete).
     * api.patch is assumed to return the data (T) directly.
     */
    updateUserProgress: async (subjectId: number): Promise<UserProgress> => {
      // api.patch returns the data directly
      const data: UserProgress = await api.patch(
        `${PROGRESS_BASE_ENDPOINT}/${subjectId}/update`,
        {}, // Pass empty body if the API expects one
      );
      return data;
    },

    /**
     * Resets the user's progress for a subject.
     * api.delete is assumed to return the data (T/unknown) directly.
     */
    resetProgress: async (subjectId: number): Promise<unknown> => {
      // api.delete returns the response body directly, pass {} as payload for consistency
      const data = await api.delete<unknown>(
        `${PROGRESS_BASE_ENDPOINT}/${subjectId}/reset`,
        {},
      );
      return data;
    },
  };
}
