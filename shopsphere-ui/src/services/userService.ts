
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/User';
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
    request: UpdateUserRequest
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

export const uploadUserPhoto = async (
    id: string,
    file: File
): Promise<User> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await userApiClient.post<User>(
        `${USER_API}/${id}/photo`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );

    return response.data;
};

export const getUserPhoto = async (id: string): Promise<Blob> => {
    const response = await userApiClient.get<Blob>(
        `${USER_API}/${id}/photo`,
        {
            responseType: 'blob'
        }
    );

    return response.data;
};

export const deleteUserPhoto = async (id: string): Promise<void> => {
    await userApiClient.delete(`${USER_API}/${id}/photo`);
};