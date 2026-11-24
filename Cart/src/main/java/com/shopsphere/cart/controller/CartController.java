package com.shopsphere.cart.controller;

import com.shopsphere.cart.dto.request.AddCartItemRequest;
import com.shopsphere.cart.dto.request.CreateCartRequest;
import com.shopsphere.cart.dto.request.UpdateCartItemRequest;
import com.shopsphere.cart.entity.Cart;
import com.shopsphere.cart.entity.CartItem;
import com.shopsphere.cart.enums.CartStatus;
import com.shopsphere.cart.service.CartItemService;
import com.shopsphere.cart.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService cartService;
    private final CartItemService cartItemService;

    public CartController(CartService cartService, CartItemService cartItemService) {
        this.cartService = cartService;
        this.cartItemService = cartItemService;
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
    @PostMapping("{cartId}/items")
    public ResponseEntity<CartItem> addProductToCart(@PathVariable UUID cartId, @Valid @RequestBody AddCartItemRequest addCartItemRequest){
        CartItem updatedCartItem =  cartItemService.addProductToCart(cartId, addCartItemRequest);
        return ResponseEntity.ok(updatedCartItem);
    }

    @GetMapping("{cartId}/items")
    public List<CartItem> getCartItemByCartId(@PathVariable UUID cartId){
        return cartItemService.getCartItemByCartId(cartId);
    }

    @PutMapping("{cartId}/items/{cartItemId}")
    public CartItem updateCartItemQuantity(@PathVariable UUID cartId, @PathVariable UUID cartItemId, @Valid @RequestBody UpdateCartItemRequest updateCartItemRequest){
        return cartItemService.updateCartItemQuantity(cartId, cartItemId, updateCartItemRequest);
    }

    @DeleteMapping("{cartId}/items/{cartItemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCartItem(@PathVariable UUID cartId, @PathVariable UUID cartItemId){
        cartItemService.removeCartItemFromCart(cartId, cartItemId);
    }

    @DeleteMapping("{cartId}/items")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCartItems(@PathVariable UUID cartId){
        cartItemService.removeAllCartItemFromCart(cartId);
    }
}
