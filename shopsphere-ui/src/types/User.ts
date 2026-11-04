
export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: UserRole;
    profileImageUrl?: string;
    profileImageName?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: UserRole;
    password: string;
}
