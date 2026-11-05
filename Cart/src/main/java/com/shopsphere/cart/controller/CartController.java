package com.shopsphere.cart.controller;

import com.shopsphere.cart.dto.request.CreateCartRequest;
import com.shopsphere.cart.entity.Cart;
import com.shopsphere.cart.enums.CartStatus;
import com.shopsphere.cart.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/carts")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Cart createCart(@RequestBody CreateCartRequest request){
        return cartService.createCart(request);
    }

    @GetMapping("/{id}")
    public Cart getCartById(@PathVariable UUID id){
        return cartService.getCartById(id);
    }

    @GetMapping("/customer/{customerId}")
    public Cart getActiveCartByCustomerId(@PathVariable UUID customerId){
        return cartService.getActiveCartByCustomerId(customerId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCartById(@PathVariable UUID id){
        cartService.deleteCartById(id);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Cart> updateCartStatus(@PathVariable UUID id, @RequestParam CartStatus status) {
        Cart updatedCart = cartService.updateCartStatus(id, status);
        return ResponseEntity.ok(updatedCart);
    }

    //--------------------------------Apis for cart items


}
