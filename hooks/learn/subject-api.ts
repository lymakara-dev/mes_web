import api from "@/service/api";
import { AxiosResponse } from "axios"; // Import AxiosResponse for correct typing

export interface Subject {
  id: number;
  name: string;
  schoolId: number;
  logoUrl?: string;
}

// Assuming your Subject API endpoints are under '/subjects'
const SUBJECTS_ENDPOINT = "/subjects"; 

export function SubjectApi() {
  return {
    // Get subjects filtered by schoolId
    // api.get returns the full AxiosResponse, so we extract .data
    getSubjectBySchool: async (schoolId: number): Promise<Subject[]> => {
      const res: AxiosResponse<Subject[]> = await api.get(`${SUBJECTS_ENDPOINT}/school`, {
        params: { schoolId },
      });
      console.log("subject res==============", res.data);
      return res.data; // Assuming res.data is an array of Subject
    },

    // Get all subjects
    // api.get returns the full AxiosResponse, which might contain { rows: Subject[] }
    getAll: async (): Promise<Subject[]> => {
      // Assuming your API response shape is { rows: Subject[], count: number }
      const res: AxiosResponse<{ rows: Subject[] }> = await api.get(SUBJECTS_ENDPOINT);
      console.log("all subject", res.data.rows);
      return res.data.rows; // Extracting the 'rows' array
    },

    // Create a subject with file upload
    // ⭐️ Uses the dedicated api.upload (POST) ⭐️
    create: async (
      name: string,
      schoolId: number,
      file: File,
    ): Promise<Subject> => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("schoolId", schoolId.toString());
      formData.append("file", file); // Assuming backend expects 'file'

      // Use api.upload, which correctly handles the FormData and headers
      const res: AxiosResponse<Subject> = await api.upload(SUBJECTS_ENDPOINT, formData, 'POST');
      return res.data; // api.upload returns full response
    },

    // Update subject (name, schoolId, and optional file)
    // ⭐️ Uses the dedicated api.upload (PATCH) ⭐️
    update: async (
      id: number,
      name: string,
      schoolId: number,
      file?: File,
    ): Promise<Subject> => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("schoolId", schoolId.toString());
      // Check the key your backend expects: the original code used 'image', 
      // but 'file' is more consistent with 'create'. Stick with 'file' for consistency.
      if (file) formData.append("file", file); 

      // Use api.upload, which correctly handles the FormData and headers
      const res: AxiosResponse<Subject> = await api.upload(`${SUBJECTS_ENDPOINT}/${id}`, formData, 'PATCH');
      return res.data; // api.upload returns full response
    },

    // Delete subject
    // ⭐️ Uses api.delete, which returns the data (T) directly ⭐️
    remove: async (id: number): Promise<void> => {
      // Assuming api.delete returns T (void in this case) directly, 
      // and takes an optional payload as the second argument.
      await api.delete<void>(`${SUBJECTS_ENDPOINT}/${id}`, {}); 
    },
  };
}