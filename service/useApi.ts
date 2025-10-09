// hooks/useApi.ts

import { School } from "@/types/school";
import api from "./api";
import { Subject } from "@/types/subject";
import { QuestionAnswer } from "@/types/question-answer";
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

    updateUserProgress: async (subjectId: number) => {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await api.patch(`user-progress/${subjectId}/update`);
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

    getSubjectsWithProgress: async () => {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const res = await api.get("/subjects/with-user-progress");
      return res.data;
    },

    getQuestionBySubjectId: async (id: string): Promise<QuestionAnswer[]> => {
      const res = await api.get(`/questions/subject?subjectId=${id}`);

      return res.data;
    },
    // Add more as needed

    // Documents
    getDocuments: async () => {
      const res = await api.get("/documents");
      console.log("doc data", res.data);
      return res.data;
    },
  };
}
