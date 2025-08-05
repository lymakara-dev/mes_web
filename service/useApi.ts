// hooks/useApi.ts

import api from "./api";

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
      const res = await api.get('/users');
      return res.data;
    },

    createUser: async (payload: Partial<User>): Promise<User> => {
      const res = await api.post('/users', payload);
      return res.data;
    },

    // Add more as needed
  };
}
