export interface UserDTO {
  id: number;
  email: string;
  phone?: string | null;
  password: string;
  role: number;
  rating?: number | null;
  fullName: string;
  avatarUrl?: string | null;
  location?: string | null;
  age: number;
  provider?: string | null;
}
