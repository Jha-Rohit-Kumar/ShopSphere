package com.shopsphere.cart.service;

import com.shopsphere.cart.client.ProductClient;
import com.shopsphere.cart.dto.request.AddCartItemRequest;
import com.shopsphere.cart.dto.request.UpdateCartItemRequest;
import com.shopsphere.cart.dto.response.ProductResponse;
import com.shopsphere.cart.entity.Cart;
import com.shopsphere.cart.entity.CartItem;
import com.shopsphere.cart.enums.CartStatus;
import com.shopsphere.cart.expetion.*;
import com.shopsphere.cart.respository.CartItemRepository;
import com.shopsphere.cart.respository.CartRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class CartItemService {

    private final CartItemRepository cartItemRepository;

    private final CartRepository cartRepository;

    private final ProductClient productClient;

    public CartItemService(CartItemRepository cartItemRepository, CartRepository cartRepository, ProductClient productClient) {
        this.cartItemRepository = cartItemRepository;
        this.cartRepository = cartRepository;
        this.productClient = productClient;
    }

    @Transactional
    public CartItem addProductToCart(UUID cartId, AddCartItemRequest addCartItemRequest) {

        //Validate cart
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new CartNotFoundException("Not able to add item to Cart, as cart does not exist!"));

        if (cart.getStatus() != CartStatus.ACTIVE) {
            throw new IllegalCartStatusException("Cart is not active");
        }

        //Validate product
        ProductResponse productResponse = productClient.fetchProduct(addCartItemRequest.getProductId());

        if (productResponse == null) {
            throw new ProductNotFoundException("Not able to find product " + addCartItemRequest.getProductId());
        }

        if (productResponse.getPrice() == null || productResponse.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidProductStateException("Product price is not available");
        }

        CartItem cartItem = cartItemRepository.findByCart_IdAndProductId(cartId, addCartItemRequest.getProductId()).orElse(null);

        if (cartItem == null){
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setUnitPrice(productResponse.getPrice());
            cartItem.setProductId(addCartItemRequest.getProductId());
            cartItem.setQuantity(addCartItemRequest.getQuantity());
            cartItem.setProductName(productResponse.getName());
            cartItem.setImageUrl(productResponse.getImageUrl());
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + addCartItemRequest.getQuantity());
        }


        return cartItemRepository.save(cartItem);
    }


    public List<CartItem> getCartItemByCartId(UUID cartId) {

        cartRepository.findById(cartId).orElseThrow(() ->  new CartNotFoundException("Cart is not available"));

        return cartItemRepository.findByCart_Id(cartId);
    }

    public CartItem updateCartItemQuantity(UUID cartId, UUID cartItemId, @Valid UpdateCartItemRequest updateCartItemRequest) {

        Cart cart = cartRepository.findById(cartId).orElseThrow(() ->  new CartNotFoundException("Cart is not available"));

        if (cart.getStatus() != CartStatus.ACTIVE) {
            throw new IllegalCartStatusException(
                    "Only active carts can change their status"
            );
        }

        CartItem cartItem = cartItemRepository
                .findByIdAndCart_Id(cartItemId, cartId)
                .orElseThrow(() ->
                        new CartItemNotFoundException(
                                "Cart item not found in the requested cart"
                        ));
        cartItem.setQuantity(updateCartItemRequest.getQuantity());

        return cartItemRepository.save(cartItem);
    }

    public void removeCartItemFromCart(UUID cartId, UUID cartItemId) {
        Cart cart = cartRepository.findById(cartId).orElseThrow(() ->  new CartNotFoundException("Cart is not available"));

        if (cart.getStatus() != CartStatus.ACTIVE) {
            throw new IllegalCartStatusException(
                    "Cannot remove items from a non-active cart"
            );
        }

        CartItem cartItem = cartItemRepository
                .findByIdAndCart_Id(cartItemId, cartId)
                .orElseThrow(() ->
                        new CartItemNotFoundException(
                                "Cart item not found in the requested cart"
                        ));


        cartItemRepository.delete(cartItem);
    }

    public void removeAllCartItemFromCart(UUID cartId) {
        Cart cart = cartRepository.findById(cartId).orElseThrow(() ->  new CartNotFoundException("Cart is not available"));

        if (cart.getStatus() != CartStatus.ACTIVE) {
            throw new IllegalCartStatusException(
                    "Cannot remove items from a non-active cart"
            );
        }

        cartItemRepository.deleteByCart_Id(cartId);
    }
}
