export type UserRole = "admin" | "employer" | "jobseeker";

export interface UserModel {
  id: number;
  email: string;
  fullName: string;
  userType: UserRole;
}
