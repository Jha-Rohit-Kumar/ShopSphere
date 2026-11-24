package com.shopsphere.cart.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class UpdateCartItemRequest {
    @NotNull
    @Positive
    int quantity;
}
