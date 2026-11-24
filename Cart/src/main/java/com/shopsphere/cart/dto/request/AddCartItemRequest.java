package com.shopsphere.cart.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;


@Data
public class AddCartItemRequest {
    @NotNull
    private UUID productId;
    @Positive
    @NotNull
    private Integer quantity = 1;
}
