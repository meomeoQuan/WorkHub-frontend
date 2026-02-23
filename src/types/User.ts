export type UserRole = "admin" | "employer" | "jobseeker";
export type PaymentPlan = 'free' | 'silver' | 'gold';

export interface UserModel {
  id: number;
  email: string;
  fullName: string;
  userType: UserRole;
  avatarUrl?: string | null;
  paymentPlan: string | null;
  subscription?: {
    plan: string;
    isActive: boolean;
    startAt: string;
    endAt: string;
  } | null;
}
