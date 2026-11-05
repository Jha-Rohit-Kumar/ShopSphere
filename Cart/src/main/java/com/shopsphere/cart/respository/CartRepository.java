package com.shopsphere.cart.respository;

import com.shopsphere.cart.entity.Cart;
import com.shopsphere.cart.enums.CartStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartRepository extends JpaRepository<Cart, UUID> {
    Optional<Cart> findByCustomerIdAndStatus(UUID customerId, CartStatus status);
}