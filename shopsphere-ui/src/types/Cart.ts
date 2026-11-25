export type CartStatus =
    | 'ACTIVE'
    | 'CHECKED_OUT'
    | 'ABANDONED'
    | 'CANCELLED';

export interface CartItem {
    id: string;
    productId: string;
    productName: string;
    imageUrl: string;
    quantity: number;
    unitPrice: number;
    createdAt: string;
    updatedAt: string;
}

export interface Cart {
    id: string;
    customerId: string;
    status: CartStatus;
    cartItems: CartItem[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateCartRequest {
    customerId: string;
}

export interface AddCartItemRequest {
    productId: string;
    quantity: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
}