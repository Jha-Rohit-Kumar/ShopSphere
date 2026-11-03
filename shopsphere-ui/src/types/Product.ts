export interface Product {
    id: string;
    name: string;
    description: string;
    sku: string;
    price: number;
    category: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductRequest {
    name: string;
    description: string;
    sku: string;
    price: number;
    category: string;
    imageUrl?: string;
}