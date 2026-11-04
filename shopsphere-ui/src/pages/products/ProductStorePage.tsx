
import { useEffect, useState } from 'react';
import type { Product } from '../../types/Product';
import { getAllProducts } from '../../services/productService';

function ProductStorePage() {

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                                        disabled
                                    >
                                        Add to Cart (Coming Soon)
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
