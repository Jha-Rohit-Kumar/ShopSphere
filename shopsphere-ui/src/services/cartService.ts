import { cartApiClient } from './apiClient';
import type { Cart, CartItem, CartStatus, CreateCartRequest, AddCartItemRequest, UpdateCartItemRequest} from '../types/Cart';

const CART_API = '/api/v1/cart';

export const createCart = async (request: CreateCartRequest): Promise<Cart> => {
    const response = await cartApiClient.post<Cart>(CART_API, request);
        return response.data;
};

export const getCartById = async (cartId: string): Promise<Cart> => {
    const response = await cartApiClient.get<Cart>(`${CART_API}/${cartId}`);
    return response.data;
};

export const updateCartStatus = async (cartId: string, status: CartStatus): Promise<Cart> => {
    const response = await cartApiClient.patch<Cart>(`${CART_API}/${cartId}/status`,null,{params: { status }});
    return response.data;
};

export const getActiveCartByCustomerId = async (customerId : string): Promise<Cart> => {
    const response = await cartApiClient.get<Cart>(`${CART_API}/customer/${customerId}`);
    return response.data;

};

export const deleteCartById = async (cartId: string): Promise<void> => {
    await cartApiClient.delete(`${CART_API}/${cartId}`);
};

export const addProductToCart = async ( cartId: string,request: AddCartItemRequest): Promise<CartItem> => {
    const response = await cartApiClient.post<CartItem>(`${CART_API}/${cartId}/items`, request);
    return response.data;
};

export const getCartItems = async (cartId: string): Promise<CartItem[]> => {
    const response = await cartApiClient.get<CartItem[]>(`${CART_API}/${cartId}/items`);
    return response.data;
};

export const updateCartItemQuantity = async ( cartId: string, cartItemId: string, request: UpdateCartItemRequest): Promise<CartItem> => {
    const response = await cartApiClient.put<CartItem>(`${CART_API}/${cartId}/items/${cartItemId}`, request);
    return response.data;
};

export const removeCartItem = async (cartId: string, cartItemId: string): Promise<void> => {
    await cartApiClient.delete(`${CART_API}/${cartId}/items/${cartItemId}`);
}

export const clearCart = async (cartId: string): Promise<void> => {
    await cartApiClient.delete(`${CART_API}/${cartId}/items`);
};