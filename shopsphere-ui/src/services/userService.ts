import axios from "axios";
import type { User, CreateUserRequest } from "../types/User";

const API_BASE_URL = 'http://localhost:8081/api/v1/user';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getAllUsers = async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('');
    return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/${id}`);
    return response.data;
};

export const createUser = async (request: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<User>('', request);
    return response.data;
};

export const updateUser = async (
    id: string,
    request: CreateUserRequest
): Promise<User> => {

    const response = await apiClient.put<User>(`/${id}`, request);
    return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
    await apiClient.delete(`/${id}`);
};
