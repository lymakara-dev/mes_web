import api from "@/service/api";

export function UserNoteApi() {
  // Helper to attach token automatically
  const setAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  };

  return {
    // Create a user note
    createUserNote: async (payload: {
      userId: number;
      questionId: number;
      title: string;
      note: string;
    }) => {
      setAuthHeader();
      const res = await api.post("/user-notes", payload);
      return res.data;
    },

    // Get all user notes (admin/public)
    getAllUserNote: async () => {
      const res = await api.get("/user-notes");
      return res.data;
    },

    // Get notes belonging to the authenticated user & a specific question
    getMyQuestionNotes: async (query: { questionId: number }) => {
      setAuthHeader();
      const res = await api.get("/user-notes/my-question-notes", {
        params: query,
      });

      console.log("my note", res.data);
      return res.data;
    },

    // Get a single note by ID
    getUserNoteById: async (id: number) => {
      const res = await api.get(`/user-notes/${id}`);
      return res.data;
    },

    // Update a user note (requires auth)
    updateUserNote: async (
      id: number,
      payload: {
        note?: string;
      },
    ) => {
      setAuthHeader();
      const res = await api.patch(`/user-notes/${id}`, payload);
      return res.data;
    },

    // Delete a user note (optional: could require auth)
    deleteUserNote: async (id: number) => {
      setAuthHeader();
      const res = await api.delete(`/user-notes/${id}`);
      return res.data;
    },
  };
}
