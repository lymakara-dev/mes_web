import api from "@/service/api";
import { User } from "@/types/user";

export function AuthApi() {
  return {
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
  };
}
