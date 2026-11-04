import type { UserRole } from './User';

export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    accessToken: string;
}