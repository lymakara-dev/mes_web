import api from "./api";
import { User } from "@/types/user";

export function useApi() {
  return {
    getUser: async (id: number): Promise<User> => {
      const res = await api.get(`/users/${id}`);

      return res.data;
    },

    getUsers: async (): Promise<User[]> => {
      const res = await api.get("/users");

      return res.data;
    },

    createUser: async (payload: Partial<User>): Promise<User> => {
      const res = await api.post("/users", payload);

      return res.data;
    },

    getUserProgress: async () => {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await api.get("/user-progress");
      console.log("progress", res.data);
      return res.data;
    },

    getSchools: async (): Promise<School[]> => {
      const res = await api.get("/schools");
      console.log("school data", res.data);
      return res.data;
    },

    getSchoolsPaginated: async (
      page: number = 1,
      pageSize: number = 10,
    ): Promise<{
      data: School[];
      total: number;
      page: number;
      pageSize: number;
    }> => {
      const res = await api.get(`/schools?page=${page}&pageSize=${pageSize}`);
      console.log("user api ", res);
      return res.data;
    },

    getSubjectsWithProgress: async () => {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await api.get("/subjects/with-user-progress");
      return res.data;
    },
  };
}
