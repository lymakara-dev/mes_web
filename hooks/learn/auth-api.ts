import api from "@/service/api";
import { User } from "@/types/user";
import Cookies from "js-cookie"; // 👈 Import Cookies to manage the token

// Define a minimal response structure for login
interface LoginResponse {
  accessToken: string;
  user: User;
}

export function AuthApi() {
  return {
    /**
     * Handles user login. Saves the token to a cookie for the ApiService interceptor.
     */
    login: async (email: string, password: string): Promise<User> => {
      // 1. Send login request
      // api.post returns the full AxiosResponse, so we extract .data.
      const res = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      console.log("user res", res);
      const { accessToken, user } = res.data;

      // 2. ⭐️ CRITICAL FIX: Save token to Cookies so the ApiService interceptor picks it up. ⭐️
      // This key MUST match the one used in your ApiService interceptor ("auth_token").
      Cookies.set("auth_token", accessToken, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });

      // ❌ Removed: localStorage.setItem("token", accessToken);
      // ❌ Removed: api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return user;
    },

    /**
     * Handles user registration.
     * api.post returns the full AxiosResponse, so we extract .data.
     */
    register: async (
      name: string,
      email: string,
      password: string,
    ): Promise<any> => {
      const res = await api.post("/auth/register", { name, email, password });
      return res.data;
    },

    /**
     * Fetches the authenticated user's profile.
     * ❌ Manual token setting REMOVED. Auth is handled by the ApiService interceptor.
     */
    getProfile: async (): Promise<User> => {
      // Call the protected endpoint
      // api.get returns the full AxiosResponse, so we extract .data.
      const res = await api.get<User>("/auth/profile");
      console.log("profile", res.data);
      return res.data;
    },

    /**
     * Updates the authenticated user's profile.
     * ❌ Manual token setting REMOVED. Auth is handled by the ApiService interceptor.
     * api.patch is assumed to return the data (T) directly.
     */
    updateProfile: async (payload: {
      username?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      gender?: string;
    }): Promise<User> => {
      // api.patch returns the data directly
      const data = await api.patch<User>("auth/profile", payload);
      return data;
    },

    /**
     * Logs the user out by removing the token from the cookies.
     */
    logout: () => {
      // ⭐️ CRITICAL FIX: Remove token from Cookies, not localStorage. ⭐️
      Cookies.remove("auth_token");

      // ❌ Removed: localStorage.removeItem("token");
      // ❌ Removed: delete api.defaults.headers.common["Authorization"];
    },
  };
}
