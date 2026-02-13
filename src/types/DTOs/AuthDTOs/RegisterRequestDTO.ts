export interface RegisterRequestDTO {
    email: string;
    fullName?: string;
    password?: string;
    confirmPassword?: string;
    role?: number;
}
