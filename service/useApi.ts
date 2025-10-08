// hooks/useApi.ts

import { School } from "@/types/school";
import api from "./api";
import { Subject } from "@/types/subject";
import { QuestionAnswer } from "@/types/question-answer";
import { User } from "@/types/user";

export function useApi() {
  return {
    // --- Auth ---
    login: async (username: string, password: string) => {
      const res = await api.post("/auth/sign-in", {
        username,
        password,
      });

      console.log("user res", res);
      const { accessToken, user } = res.data;

      // Save token to localStorage for persistence
      localStorage.setItem("token", accessToken);

      // Set token in axios headers
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return user;
    },

    register: async (name: string, email: string, password: string) => {
      const res = await api.post("/auth/register", { name, email, password });
      return res.data;
    },

    getProfile: async (): Promise<User> => {
      // Ensure the token is set (in case of page reload)
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      // Call the protected endpoint
      const res = await api.get("/auth/profile");
      console.log("profile", res.data);
      return res.data;
    },

    updateProfile: async (payload: {
      username?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      gender?: string;
    }): Promise<User> => {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await api.patch("auth/profile", payload);
      return res.data;
    },

    logout: () => {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    },

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

    getSubject: async (id: string): Promise<Subject[]> => {
      const res = await api.get(`/subjects/school?schoolId=${id}`);

      return res.data;
    },

    getQuestionBySubjectId: async (id: string): Promise<QuestionAnswer[]> => {
      const res = await api.get(`/questions/subject?subjectId=${id}`);

      return res.data;
    },
    // Add more as needed
  };
}
