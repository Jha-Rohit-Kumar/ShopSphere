package com.shopsphere.cart.expetion;

public class CartNotFoundException extends RuntimeException{
    public CartNotFoundException(String message ){
        super(message);
    }
}
