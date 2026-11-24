
package com.shopsphere.cart.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Bean
    public RestClient productRestClient(RestClient.Builder builder) {
        return builder
                .baseUrl("http://localhost:8081/api/v1/product")
                .build();
    }
}
