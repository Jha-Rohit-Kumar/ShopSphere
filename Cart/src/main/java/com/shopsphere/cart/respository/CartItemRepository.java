package com.shopsphere.cart.respository;

import com.shopsphere.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {

    Optional<CartItem> findByCart_IdAndProductId(UUID cartId, UUID productId);

    List<CartItem> findByCart_Id(UUID cartId);

    Optional<CartItem> findByIdAndCart_Id(UUID cartItemId, UUID cartId);

    void deleteByCart_Id(UUID cartId);
}
