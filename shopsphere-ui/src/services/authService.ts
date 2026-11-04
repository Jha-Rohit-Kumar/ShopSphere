import type {
    LoginFormData,
    RegisterRequest,
    AuthResponse
} from '../types/Auth';
import { userApiClient } from './apiClient';

export const loginUser = async (
    request: LoginFormData
): Promise<AuthResponse> => {

    const response = await userApiClient.post<AuthResponse>(
        '/api/v1/auth/login',
        request
    );

    return response.data;
};

export const registerUser = async (
    request: RegisterRequest
): Promise<AuthResponse> => {

    const response = await userApiClient.post<AuthResponse>(
        '/api/v1/auth/register',
        request
    );

    return response.data;
};