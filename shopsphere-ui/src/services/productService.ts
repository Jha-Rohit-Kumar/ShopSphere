import axios from 'axios';
import type { Product, CreateProductRequest } from '../types/Product';

const API_BASE_URL = 'http://localhost:8081/api/v1/product';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getAllProducts = async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('');
    return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/${id}`);
    return response.data;
};


export const createProduct = async (request: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post<Product>('', request);
    return response.data;
};

export const updateProduct = async (
    id: string,
    request: CreateProductRequest
): Promise<Product> => {

    const response = await apiClient.put<Product>(`/${id}`, request);
    return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
    await apiClient.delete(`/${id}`);
};
