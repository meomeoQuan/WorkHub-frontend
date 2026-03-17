// mappers/MappingUser.ts
import type { UserDTO } from "../types/DTOs/ModelDTOs/UserDTO";
import type { UserModel, UserRole } from "../types/User";

const roleMap: Record<number, UserRole> = {
  0: "admin",
  1: "employer",
  2: "jobseeker",
};

export function mapUserDTOToUser(dto: UserDTO): UserModel {
  const roleValue = (dto as any).role !== undefined ? (dto as any).role : (dto as any).Role;
  return {
    id: dto.id,
    email: dto.email,
    fullName: dto.fullName,
    userType: roleMap[roleValue] ?? "jobseeker", // safe fallback
    role: roleValue,
    avatarUrl: dto.avatarUrl ?? null,
    paymentPlan: (dto as any).paymentPlan || (dto as any).PaymentPlan || 'free',
    status: (dto as any).status || (dto as any).Status || 'active',
  };
}
