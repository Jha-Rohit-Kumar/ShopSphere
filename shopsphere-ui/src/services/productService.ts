import type { Product, CreateProductRequest } from '../types/Product';
import { productApiClient } from './apiClient';

const PRODUCT_API = '/api/v1/product';

export const getAllProducts = async (): Promise<Product[]> => {
    const response = await productApiClient.get<Product[]>(PRODUCT_API);
    return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
    const response = await productApiClient.get<Product>(`${PRODUCT_API}/${id}`);
    return response.data;
};


export const createProduct = async (request: CreateProductRequest): Promise<Product> => {
    const response = await productApiClient.post<Product>(PRODUCT_API, request);
    return response.data;
};

export const updateProduct = async (
    id: string,
    request: CreateProductRequest
): Promise<Product> => {

    const response = await productApiClient.put<Product>(`${PRODUCT_API}/${id}`, request);
    return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
    await productApiClient.delete(`${PRODUCT_API}/${id}`);
};
