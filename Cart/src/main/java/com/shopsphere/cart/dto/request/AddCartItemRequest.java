package com.shopsphere.cart.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public class AddCartItemRequest {
    @NotNull
    private UUID cartId;
    @NotNull
    private UUID productId;
    @NotNull
    private BigDecimal unitPrice;
    @Positive
    private int quantity;
}
