
import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';

import { useAuth } from '../../context/AuthContext';
import { getActiveCartByCustomerId, updateCartItemQuantity, removeCartItem } from '../../services/cartService';
import type { Cart } from '../../types/Cart';

function CartPage() {

    const { user } = useAuth();

    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
    const [actionError, setActionError] = useState('');

    const handleQuantityChange = async (
        cartItemId: string,
        currentQuantity: number,
        change: number
    ) => {
        if (!cart) return;

        const newQuantity = currentQuantity + change;

        // Quantity cannot be less than 1
        if (newQuantity < 1) return;

        try {
            setUpdatingItemId(cartItemId);
            setActionError('');

            const updatedItem = await updateCartItemQuantity(
                cart.id,
                cartItemId,
                { quantity: newQuantity }
            );

            // Update local cart state with backend response
            setCart(previousCart => {
                if (!previousCart) return previousCart;

                return {
                    ...previousCart,
                    cartItems: previousCart.cartItems.map(item =>
                        item.id === cartItemId ? updatedItem : item
                    )
                };
            });

        } catch (error: unknown) {
            console.error('Failed to update cart quantity:', error);
            setActionError('Unable to update quantity. Please try again.');
        } finally {
            setUpdatingItemId(null);
        }
    };

    const handleRemoveItem = async (cartItemId: string) => {
        if (!cart) return;

        try {
            setUpdatingItemId(cartItemId);
            setActionError('');

            await removeCartItem(cart.id, cartItemId);

            setCart(previousCart => {
                if (!previousCart) return previousCart;

                return {
                    ...previousCart,
                    cartItems: previousCart.cartItems.filter(
                        item => item.id !== cartItemId
                    )
                };
            });

        } catch (error: unknown) {
            console.error('Failed to remove cart item:', error);
            setActionError('Unable to remove this product. Please try again.');
        } finally {
            setUpdatingItemId(null);
        }
    };

    useEffect(() => {

        const fetchCart = async () => {

            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError('');

                const activeCart =
                    await getActiveCartByCustomerId(user.id);

                setCart(activeCart);

            } catch (error: unknown) {

                if (isAxiosError(error) &&
                    error.response?.status === 404) {
                    setCart(null);
                } else {
                    setError('Unable to load your cart. Please try again.');
                }

            } finally {
                setLoading(false);
            }
        };

        fetchCart();

    }, [user?.id]);

    const subtotal = cart?.cartItems?.reduce(
        (total, item) =>
            total + item.unitPrice * item.quantity,
        0
    ) ?? 0;

    const currencyFormatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    });

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" />
                <p className="mt-2">Loading your cart...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    if (!cart || cart.cartItems.length === 0) {
        return (
            <div className="container mt-5 text-center">
                <h3>Your cart is empty</h3>
                <p className="text-muted">
                    Explore our products and add something you love.
                </p>
                <a href="/products" className="btn btn-primary">
                    Continue Shopping
                </a>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            <h2 className="mb-4">Shopping Cart</h2>

            {actionError && (
                <div className="alert alert-danger">
                    {actionError}
                </div>
            )}

            <div className="row">

                <div className="col-lg-8">

                    {cart.cartItems.map(item => (
                        <div key={item.id} className="card mb-3 shadow-sm">
                            <div className="card-body">
                                <div className="row align-items-center g-3">

                                    {/* Product Image */}
                                    <div className="col-4 col-md-2">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.productName || 'Product'}
                                                className="img-fluid rounded"
                                                style={{
                                                    width: '110px',
                                                    height: '110px',
                                                    objectFit: 'contain'
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="bg-light rounded d-flex
                                                        align-items-center justify-content-center"
                                                style={{
                                                    width: '110px',
                                                    height: '110px'
                                                }}
                                            >
                                                <span className="text-muted small text-center">
                                                    No image
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="col-8 col-md-4">
                                        <h6 className="fw-semibold mb-2">
                                            {item.productName || 'Product details unavailable'}
                                        </h6>

                                        <div className="text-muted small">
                                            Unit price
                                        </div>

                                        <strong>
                                            {currencyFormatter.format(item.unitPrice)}
                                        </strong>

                                        <div>
                                            <button
                                                className="btn btn-link text-danger p-0 mt-2 text-decoration-none"
                                                disabled={updatingItemId === item.id}
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="col-6 col-md-3">
                                        <div className="d-flex align-items-center justify-content-center gap-2">

                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                disabled={
                                                    item.quantity <= 1 ||
                                                    updatingItemId === item.id
                                                }
                                                onClick={() =>
                                                    handleQuantityChange(item.id, item.quantity, -1)
                                                }
                                            >
                                                −
                                            </button>

                                            <span className="fw-semibold">
                                                {item.quantity}
                                            </span>

                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                disabled={updatingItemId === item.id}
                                                onClick={() =>
                                                    handleQuantityChange(item.id, item.quantity, 1)
                                                }
                                            >
                                                +
                                            </button>

                                        </div>
                                    </div>

                                    {/* Line Total */}
                                    <div className="col-6 col-md-3 text-end">
                                        <strong className="fs-6">
                                            {currencyFormatter.format(
                                                item.unitPrice * item.quantity
                                            )}
                                        </strong>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}

                </div>

                <div className="col-lg-4">

                    <div className="card">
                        <div className="card-body">

                            <h5 className="card-title">
                                Order Summary
                            </h5>

                            <hr />

                            <div className="d-flex justify-content-between">
                                <span>Subtotal</span>
                                <strong>
                                    {currencyFormatter.format(subtotal)}
                                </strong>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between">
                                <strong>Total</strong>
                                <strong className="text-success">
                                    {currencyFormatter.format(subtotal)}
                                </strong>
                            </div>

                            <button
                                className="btn btn-primary w-100 mt-3"
                                disabled
                            >
                                Proceed to Checkout
                            </button>

                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default CartPage;
