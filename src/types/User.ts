export type UserRole = "admin" | "employer" | "jobseeker";

export interface UserModel {
  id: number;
  email: string;
  fullName: string;
  userType: UserRole;
  avatarUrl?: string | null;
  paymentPlan: string | null;
}
