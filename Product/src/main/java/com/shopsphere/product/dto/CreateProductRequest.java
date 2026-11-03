
package com.shopsphere.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;


@Data
public class CreateProductRequest {

    @NotBlank
    @Size(max = 150)
    private String name;

    private String description;

    private String imageUrl;

    @NotBlank
    @Size(max = 50)
    private String sku;

    @NotNull
    @Positive
    private BigDecimal price;

    @NotBlank
    @Size(max = 100)
    private String category;
}
