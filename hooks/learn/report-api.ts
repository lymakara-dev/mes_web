import api from "@/service/api";

export function ReportApi() {
  // Helper to attach token
  const setAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  };

  return {
    // 📝 Create a report (requires authentication)
    create: async (payload: { questionId: number; reason: string }) => {
      setAuthHeader();
      const res = await api.post("/reports", payload);
      return res.data;
    },

    // 📋 Get all reports (admin/public)
    getAll: async () => {
      const res = await api.get("/reports");
      return res.data;
    },

    // 👤 Get all reports belonging to the authenticated user for a question
    getMyReports: async (questionId: number) => {
      setAuthHeader();
      const res = await api.get("/reports/my-report", {
        params: { questionId },
      });
      return res.data;
    },

    // 🔍 Get one report by ID
    getById: async (id: number) => {
      const res = await api.get(`/reports/${id}`);
      return res.data;
    },

    // ✏️ Update a report (requires auth if needed)
    update: async (
      id: number,
      payload: {
        reason?: string;
      },
    ) => {
      setAuthHeader();
      const res = await api.patch(`/reports/${id}`, payload);
      return res.data;
    },

    // ❌ Delete a report (requires auth if needed)
    delete: async (id: number) => {
      setAuthHeader();
      const res = await api.delete(`/reports/${id}`);
      return res.data;
    },
  };
}
