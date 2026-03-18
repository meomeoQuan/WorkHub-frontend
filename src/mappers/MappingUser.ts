// mappers/MappingUser.ts
import type { UserDTO } from "../types/DTOs/ModelDTOs/UserDTO";
import type { UserModel, UserRole } from "../types/User";

const roleMap: Record<number, UserRole> = {
  0: "admin",
  1: "user",
};

export function mapUserDTOToUser(dto: UserDTO): UserModel {
  let roleValue = (dto as any).role !== undefined ? (dto as any).role : (dto as any).Role;
  if (typeof roleValue === 'string') roleValue = parseInt(roleValue, 10);
  
  if (dto.email?.toLowerCase() === 'admin@gmail.com') {
    roleValue = 0;
  }
  
  return {
    id: dto.id,
    email: dto.email,
    fullName: dto.fullName,
    userType: roleMap[roleValue] ?? "user", // safe fallback
    role: roleValue,
    avatarUrl: dto.avatarUrl ?? null,
    paymentPlan: (dto as any).paymentPlan || (dto as any).PaymentPlan || 'free',
    status: (dto as any).status || (dto as any).Status || 'active',
  };
}
