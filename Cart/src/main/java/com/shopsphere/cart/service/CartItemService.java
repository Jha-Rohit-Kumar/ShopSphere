package com.shopsphere.cart.service;

import com.shopsphere.cart.respository.CartItemRepository;
import org.springframework.stereotype.Service;

@Service
public class CartItemService {

    private final CartItemRepository cartItemRepository;

    public CartItemService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }
}
