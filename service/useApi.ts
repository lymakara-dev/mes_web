// hooks/useApi.ts

import { School } from "@/types/school";
import api from "./api";
import { Subject } from "@/types/subject";
import { QuestionAnswer } from "@/types/question-answer";
import { AwardIcon } from "lucide-react";

// --- Types
export type User = {
  id: number;
  name: string;
  email: string;
};

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

    getSchools: async (): Promise<School[]> => {
      const res = await api.get("/schools");

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
