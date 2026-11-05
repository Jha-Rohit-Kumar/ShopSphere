package com.shopsphere.cart.service;

import com.shopsphere.cart.dto.request.CreateCartRequest;
import com.shopsphere.cart.entity.Cart;
import com.shopsphere.cart.enums.CartStatus;
import com.shopsphere.cart.expetion.CartNotFoundException;
import com.shopsphere.cart.expetion.IllegalCartStatusException;
import com.shopsphere.cart.respository.CartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;


@Service
@Transactional
public class CartService {

    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public Cart createCart(CreateCartRequest request) {
        return cartRepository.findByCustomerIdAndStatus(request.getCustomerId(), CartStatus.ACTIVE)
                .orElseGet(() -> {
                                    Cart cart = new Cart();
                                    cart.setCustomerId(request.getCustomerId());
                                    return cartRepository.save(cart);
                });
    }

    @Transactional(readOnly = true)
    public Cart getCartById(UUID id) {
        return cartRepository.findById(id).orElseThrow(() -> new CartNotFoundException("Cart for the user not found"));
    }

    public Cart getActiveCartByCustomerId(UUID customerId) {
        return cartRepository.findByCustomerIdAndStatus(customerId, CartStatus.ACTIVE).orElseThrow(() -> new CartNotFoundException("Active cart doesn't exist for the customer"));
    }

    public void deleteCartById(UUID id) {
        Cart cart = getCartById(id);
        cartRepository.delete(cart);
    }

    public Cart updateCartStatus(UUID id, CartStatus status) {

        Cart cart = getCartById(id);

        if (cart.getStatus() != CartStatus.ACTIVE) {
            throw new IllegalCartStatusException("Only active carts can change their status");
        }

        if (status == CartStatus.ACTIVE) {
            throw new IllegalCartStatusException("Cart is already active");
        }

        cart.setStatus(status);

        return cartRepository.save(cart);
    }
}
