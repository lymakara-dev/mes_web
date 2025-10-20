export interface IUserInfo {
  id: number;
  userId: number;
  imageUrl: string | null;
  phone: string | null;
  email: string | null; // This is the primary email we're using
  firstname: string | null;
  lastname: string | null;
  dob: string | null;
  gender: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IStudent {
  id: number; // Based on API response
  username: string; // Used as a fallback for name
  role: "STUDENT" | "TEACHER" | "ADMIN"; // Allowing other roles based on common API practice, but STUDENT for now
  status: "ACTIVE" | "INACTIVE"; // Based on API response
  createdAt: string; // The join date
  updatedAt: string;
  deletedAt: string | null;
  userInfo: IUserInfo | null; // The nested object containing name and email
}

// And based on the API response, the paginated structure should be:
export interface IPaginatedStudents {
  count: number;
  rows: IStudent[];
}

// --- Mutation Payloads ---

// This type remains correct based on your previous creation DTO.
export interface ICreateStudentPayload {
  username: string;
  password?: string;
  firstname: string;
  lastname: string;
}

/**
 * FIX: This payload is updated to fully match the backend's UpdateProfileDto,
 * allowing the frontend to update any available user fields.
 * (The 'image' property is excluded as it involves file upload logic, but is noted).
 */
export interface IUpdateStudentPayload {
  username?: string;
  phone?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  dob?: string;
  gender?: string;
  // Note: The original DTO also included 'image?: Express.Multer.File;'
  // If you need to update the password, a separate mutation/payload is likely required.
}

// Define IReport (for a single report item)
export interface IReport {
  id: number;
  userId: number;
  questionId: number;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

// Define IPaginatedReports (for the API response structure)
export interface IPaginatedReports {
  count: number;
  rows: IReport[];
}

// Assumed types from your context
export interface School {
  id: number;
  name: string;
  // Assuming a logoUrl for symmetry with Subject
  logoUrl?: string; 
}
// Assumed SchoolApi functions:
// SchoolApi().getAll(): Promise<School[]>;
// SchoolApi().create(name: string, file: File): Promise<School>;
// SchoolApi().update(id: number, name: string, file?: File): Promise<School>;
// SchoolApi().remove(id: number): Promise<void>;
