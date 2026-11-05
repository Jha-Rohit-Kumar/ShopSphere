package com.shopsphere.cart.expetion;

public class IllegalCartStatusException extends RuntimeException{
    public IllegalCartStatusException(String message){
        super(message);
    }
}
