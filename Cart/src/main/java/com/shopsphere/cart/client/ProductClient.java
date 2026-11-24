
package com.shopsphere.cart.client;

import com.shopsphere.cart.dto.response.ProductResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.UUID;

@Component
public class ProductClient {

    private final RestClient productRestClient;

    public ProductClient(RestClient productRestClient) {
        this.productRestClient = productRestClient;
    }

    public ProductResponse fetchProduct(UUID productId) {

        return productRestClient
                .get()
                .uri("/{id}", productId)
                .retrieve()
                .body(ProductResponse.class);
    }
}
