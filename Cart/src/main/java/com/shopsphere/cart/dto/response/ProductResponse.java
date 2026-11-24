package com.shopsphere.cart.dto.response;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ProductResponse {
    private UUID id;
    private String name;
    private String description;
    private String sku;
    private BigDecimal price;
    private String category;
    private String imageUrl;
}
