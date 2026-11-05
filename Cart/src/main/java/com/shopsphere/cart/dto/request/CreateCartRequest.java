package com.shopsphere.cart.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateCartRequest {
    @NotNull
    private UUID customerId;
}
