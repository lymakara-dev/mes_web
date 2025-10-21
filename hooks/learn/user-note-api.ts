import api from "@/service/api";
import { AxiosResponse } from "axios";

// Define a basic interface for the UserNote
export interface UserNote {
  id: number;
  userId: number;
  questionId: number;
  title: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

const USER_NOTES_ENDPOINT = "/user-notes";

export function UserNoteApi() {
  // ❌ REMOVED: setAuthHeader and manual token logic. 
  // Authentication is handled automatically by the apiService interceptor.

  return {
    // Create a user note
    // api.post returns the full AxiosResponse, so we extract .data
    createUserNote: async (payload: {
      userId: number;
      questionId: number;
      title: string;
      note: string;
    }): Promise<UserNote> => {
      const res: AxiosResponse<UserNote> = await api.post(USER_NOTES_ENDPOINT, payload);
      return res.data;
    },

    // Get all user notes (admin/public)
    // api.get returns the full AxiosResponse, so we extract .data
    getAllUserNote: async (): Promise<UserNote[]> => {
      const res: AxiosResponse<UserNote[]> = await api.get(USER_NOTES_ENDPOINT);
      return res.data;
    },

    // Get notes belonging to the authenticated user & a specific question
    // api.get returns the full AxiosResponse, so we extract .data
    getMyQuestionNotes: async (query: { questionId: number }): Promise<UserNote[]> => {
      const res: AxiosResponse<UserNote[]> = await api.get(`${USER_NOTES_ENDPOINT}/my-question-notes`, {
        params: query, // Pass the query object as params
      });

      console.log("my note", res.data);
      return res.data;
    },

    // Get a single note by ID
    // api.get returns the full AxiosResponse, so we extract .data
    getUserNoteById: async (id: number): Promise<UserNote> => {
      const res: AxiosResponse<UserNote> = await api.get(`${USER_NOTES_ENDPOINT}/${id}`);
      return res.data;
    },

    // Update a user note
    // api.patch is assumed to return the data (T) directly
    updateUserNote: async (
      id: number,
      payload: {
        note?: string;
      },
    ): Promise<UserNote> => {
      const data: UserNote = await api.patch(`${USER_NOTES_ENDPOINT}/${id}`, payload);
      return data;
    },

    // Delete a user note
    // api.delete is assumed to return the data (T/unknown) directly
    deleteUserNote: async (id: number): Promise<unknown> => {
      // api.delete returns the response body directly, pass {} as payload for consistency
      const data = await api.delete<unknown>(`${USER_NOTES_ENDPOINT}/${id}`, {});
      return data;
    },
  };
}