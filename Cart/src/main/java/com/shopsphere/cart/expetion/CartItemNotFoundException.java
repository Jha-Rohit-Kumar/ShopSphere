package com.shopsphere.cart.expetion;

public class CartItemNotFoundException extends RuntimeException{
    public CartItemNotFoundException(String message) {
        super(message);
    }
}
