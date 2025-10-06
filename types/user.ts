export type UserInfo = {
  id: number;
  userId: number;
  imageUrl: string | null;
  phone: string | null;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
  dob: string | null;
  gender: string | null;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: number;
  username: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userInfo?: UserInfo;
};
