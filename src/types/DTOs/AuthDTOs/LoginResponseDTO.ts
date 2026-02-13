import { UserDTO } from "../ModelDTOs/UserDTO";

export interface LoginResponseDTO {
    token?: string;
    userDTO?: UserDTO;
}
