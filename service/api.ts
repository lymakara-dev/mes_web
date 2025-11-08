import axios, { AxiosInstance, AxiosResponse } from "axios";
import Cookies from "js-cookie";

class ApiService {
  private axiosInstance: AxiosInstance;
  private API_URL = process.env.NEXT_PUBLIC_API_URL || "https://mockexamkh.com";

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.axiosInstance.interceptors.request.use((config) => {
      const token = Cookies.get("auth_token");

      // If the token exists, add it to the Authorization header
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Return the modified config
      return config;
    });
  }

  // Method to set the language for API requests
  setLanguage(locale: string) {
    this.axiosInstance.defaults.headers.common["Accept-Language"] = locale;
  }

  async post<T>(endpoint: string, data: any) {
    try {
      const response = await this.axiosInstance.post(`${endpoint}`, data);
      return response;
    } catch (error: any) {
      // console.error("Error updating data:", error.response?.data || error.message);
      throw error;
    }
  }

  async patch<T>(endpoint: string, data: any) {
    try {
      const response = await this.axiosInstance.patch(`${endpoint}`, data);
      return response.data;
    } catch (error: any) {
      // console.error("Error updating data:", error.response?.data || error.message);
      throw error;
    }
  }

  async get<T>(endpoint: string, params = {}) {
    try {
      const response = await this.axiosInstance.get(endpoint, { params });
      return response;
    } catch (error) {
      console.error(`GET request to ${endpoint} failed:`, error);
      throw error;
    }
  }

  async updateById<T>(endpoint: string, id: string | number, data: T) {
    try {
      const response = await this.axiosInstance.put(`${endpoint}/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error updating data:",
        error.response?.data || error.message,
      );  
      throw error;
    }
  }

  async deleteById<T>(endpoint: string) {
    try {
      const response = await this.axiosInstance.delete(endpoint);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error updating data:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async delete<T>(endpoint: string, payload?: any) {
    try {
      const response = await this.axiosInstance.delete(`${endpoint}`, {
        data: payload,
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "Error updating data:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async patchById<T>(endpoint: string, data: T) {
    try {
      const response = await this.axiosInstance.patch(`${endpoint}`, data);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error updating data:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async postMultipart<T>(endpoint: string, formData: FormData) {
    try {
      // Axios automatically sets the correct 'multipart/form-data' header
      // with the boundary when it receives a FormData object.
      const token = Cookies.get("auth_token");
      const response = await axios.post<T>(
        `${this.API_URL}${endpoint}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response;
    } catch (error: any) {
      console.error(
        `Multipart POST to ${endpoint} failed:`,
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async upload<T>(
    endpoint: string,
    formData: FormData,
    method: "POST" | "PATCH" = "POST",
  ): Promise<AxiosResponse<T>> {
    try {
      const response = await this.axiosInstance.request<T>({
        method: method,
        url: endpoint,
        data: formData,
        // Axios automatically sets 'multipart/form-data' boundary
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      console.error(`Multipart ${method} to ${endpoint} failed:`, error);
      throw error;
    }
  }
}

// Export a singleton instance of the service
const apiService = new ApiService();
export default apiService;
