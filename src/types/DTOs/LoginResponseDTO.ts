import type { UserDTO } from "./UserDTO ";

export interface LoginResponseDTO {
  token?: string | null;
  userDTO?: UserDTO | null;
}
