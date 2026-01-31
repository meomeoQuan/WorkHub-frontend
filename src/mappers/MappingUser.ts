// mappers/MappingUser.ts
import type { UserDTO } from "../types/DTOs/UserDTO ";
import type { UserModel, UserRole } from "../types/User";

const roleMap: Record<number, UserRole> = {
  0: "admin",
  1: "employer",
  2: "jobseeker",
};

export function mapUserDTOToUser(dto: UserDTO): UserModel {
  return {
    id: dto.id,
    email: dto.email,
    fullName: dto.fullName,
    userType: roleMap[dto.role] ?? "jobseeker", // safe fallback
  };
}
