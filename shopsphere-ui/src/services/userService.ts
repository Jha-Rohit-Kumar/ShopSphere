
import type { User, CreateUserRequest } from '../types/User';
import { userApiClient } from './apiClient';

const USER_API = '/api/v1/user';

export const getAllUsers = async (): Promise<User[]> => {
    const response = await userApiClient.get<User[]>(USER_API);
    return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
    const response = await userApiClient.get<User>(`${USER_API}/${id}`);
    return response.data;
};

export const createUser = async (
    request: CreateUserRequest
): Promise<User> => {
    const response = await userApiClient.post<User>(USER_API, request);
    return response.data;
};

export const updateUser = async (
    id: string,
    request: CreateUserRequest
): Promise<User> => {
    const response = await userApiClient.put<User>(
        `${USER_API}/${id}`,
        request
    );
    return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
    await userApiClient.delete(`${USER_API}/${id}`);
};
