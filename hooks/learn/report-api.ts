import api from "@/service/api";
import { AxiosResponse } from "axios";

// Interface for the Report data (assuming the API returns a Report object)
export interface Report {
  id: number;
  questionId: number;
  reason: string;
  userId: number;
  createdAt: string;
}

const REPORTS_ENDPOINT = "/reports";

export function ReportApi() {
  // ❌ REMOVED: setAuthHeader and manual token logic. 
  // Authentication is handled automatically by the apiService interceptor (using Cookies).

  return {
    // 📝 Create a report
    // api.post returns the full AxiosResponse, so we extract .data
    create: async (payload: { questionId: number; reason: string }): Promise<Report> => {
      const res: AxiosResponse<Report> = await api.post(REPORTS_ENDPOINT, payload);
      return res.data;
    },

    // 📋 Get all reports (admin/public)
    // api.get returns the full AxiosResponse, so we extract .data
    getAll: async (): Promise<Report[]> => {
      const res: AxiosResponse<Report[]> = await api.get(REPORTS_ENDPOINT);
      return res.data;
    },

    // 👤 Get all reports belonging to the authenticated user for a question
    // api.get returns the full AxiosResponse, so we extract .data
    getMyReports: async (questionId: number): Promise<Report[]> => {
      const res: AxiosResponse<Report[]> = await api.get(`${REPORTS_ENDPOINT}/my-report`, {
        params: { questionId },
      });
      return res.data;
    },

    // 🔍 Get one report by ID
    // api.get returns the full AxiosResponse, so we extract .data
    getById: async (id: number): Promise<Report> => {
      const res: AxiosResponse<Report> = await api.get(`${REPORTS_ENDPOINT}/${id}`);
      return res.data;
    },

    // ✏️ Update a report
    // api.patch is assumed to return the data (T) directly, as per previous refactoring decisions
    update: async (
      id: number,
      payload: {
        reason?: string;
      },
    ): Promise<Report> => {
      // api.patch returns the data directly
      const data: Report = await api.patch(`${REPORTS_ENDPOINT}/${id}`, payload);
      return data;
    },

    // ❌ Delete a report
    // api.delete is assumed to return the data (T/unknown) directly
    delete: async (id: number): Promise<unknown> => {
      // api.delete returns the response body directly, pass {} as payload for consistency
      const data = await api.delete<unknown>(`${REPORTS_ENDPOINT}/${id}`, {});
      return data;
    },
  };
}