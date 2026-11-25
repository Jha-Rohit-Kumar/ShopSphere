
import { useEffect, useState } from 'react';
import type { Product } from '../../types/Product';
import { getAllProducts } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';
import { isAxiosError } from 'axios';

import { getActiveCartByCustomerId, createCart, addProductToCart} from '../../services/cartService';
import type { Cart } from '../../types/Cart';

function ProductStorePage() {

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { user, isAuthenticated } = useAuth();

    const [addingProductId, setAddingProductId] = useState<string | null>(null);
    const [cartMessage, setCartMessage] = useState('');
    const [cartError, setCartError] = useState('');

    const handleAddToCart = async (productId: string) => {

    if (!isAuthenticated || !user) {
        setCartError('Please login to add products to your cart.');
        return;
    }

    try {
        setAddingProductId(productId);
        setCartMessage('');
        setCartError('');

        let cart: Cart;

        try {
            cart = await getActiveCartByCustomerId(user.id);

        } catch (error: unknown) {

            if (isAxiosError(error) && error.response?.status === 404) {

                // Customer does not have an active cart.
                cart = await createCart({
                    customerId: user.id
                });

            } else {
                throw error;
            }
        }

        // Add product to the existing or newly created cart.
        await addProductToCart(cart.id, {
            productId,
            quantity: 1
        });

        setCartMessage('Product added to cart successfully!');

    } catch (error: unknown) {

        console.error('Failed to add product to cart:', error);

        setCartError(
            isAxiosError(error)
                ? error.response?.data?.message || 'Unable to add product to cart.'
                : 'Something went wrong. Please try again.'
        );

    } finally {
        setAddingProductId(null);
    }
};

    useEffect(() => {

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await getAllProducts();
                setProducts(data);

            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError('Unable to load products. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

    }, []);

    if (loading) {
        return <div className="text-center mt-5">Loading products...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Shop Products</h2>

            {cartMessage && (
                <div className="alert alert-success">
                    {cartMessage}
                </div>
            )}

            {cartError && (
                <div className="alert alert-danger">
                    {cartError}
                </div>
            )}

            {products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <div className="row">
                    {products.map((product) => (
                        <div className="col-md-4 col-lg-3 mb-4" key={product.id}>
                            <div className="card h-100 shadow-sm">
                                <div className="product-image-container">
                                    <img
                                        src={product.imageUrl || '/images/product-placeholder.png'}
                                        className="card-img-top"
                                        alt={product.name}
                                        style={{
                                            height: '220px',
                                            objectFit: 'contain',
                                            padding: '15px'
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.src = '/images/product-placeholder.png';
                                        }}
                                    />
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {product.name}
                                    </h5>

                                    <p className="card-text text-muted">
                                        {product.description}
                                    </p>

                                    <p className="fw-bold">
                                        ₹{Number(product.price).toFixed(2)}
                                    </p>

                                    <span className="badge bg-secondary">
                                        {product.category}
                                    </span>
                                </div>

                                <div className="card-footer bg-white">
                                    <button
                                        type="button"
                                        className="btn btn-primary w-100"
                                        onClick={() => handleAddToCart(product.id)}
                                        disabled={addingProductId !== null}
                                    >
                                        {addingProductId === product.id
                                            ? 'Adding...'
                                            : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductStorePage;
