export interface UserDTO {
    id: number;
    email: string;
    phone?: string;
    password?: string;
    role: number;
    rating?: number;
    fullName: string;
    avatarUrl?: string;
    location?: string;
    age: number;
    provider?: string;
    paymentPlan?: string;
}
