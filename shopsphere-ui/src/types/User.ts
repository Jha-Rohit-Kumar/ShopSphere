export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface User {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    role: UserRole,
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserRequest {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    role: UserRole
}