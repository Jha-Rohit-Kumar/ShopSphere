import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Product } from '../../types/Product';
import { getAllProducts, deleteProduct } from '../../services/productService';

function ProductListPage() {

    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
    const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAllProducts();
                setProducts(data);

            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Something went wrong while fetching products.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const callDeleteProduct = async (id: string) => {
            try {
                setLoading(true);
                setError(null);
                await deleteProduct(id);
                setProducts(products.filter(product => product.id != id));

            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Something went wrong while deleting products.');
                }
            } finally {
                setLoading(false);
            }
        };

return (
    <div className="page-container">

        {/* Page Header */}
        <div className="page-header">
            <div>
                <h1 className="page-title">Products</h1>
                <p className="page-subtitle">
                    Manage your product catalogue and inventory.
                </p>
            </div>

            <button
                className="btn btn-primary px-4"
                onClick={() => navigate('/admin/products/new')}
            >
                + Add Product
            </button>
        </div>

        {/* Product Count */}
        <div className="content-card">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="mb-1">All Products</h5>
                    <span className="text-secondary small">
                        {products.length} products found
                    </span>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-secondary mt-2">
                        Loading products...
                    </p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* Product Table */}
            {!loading && !error && (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>SKU</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-5">
                                        <p className="text-secondary mb-2">
                                            No products found.
                                        </p>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => navigate('/admin/products/new')}
                                        >
                                            Add your first product
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <img
                                                src={product.imageUrl || '/placeholder.png'}
                                                alt={product.name}
                                                className="product-thumbnail"
                                                onError={(event) => {
                                                    event.currentTarget.src = '/placeholder.png';
                                                }}
                                            />
                                        </td>

                                        <td className="fw-semibold">
                                            {product.name}
                                        </td>

                                        <td className="text-secondary">
                                            {product.sku}
                                        </td>

                                        <td>
                                            <span className="badge bg-light text-dark border">
                                                {product.category}
                                            </span>
                                        </td>

                                        <td className="fw-semibold">
                                            ₹{product.price.toLocaleString('en-IN')}
                                        </td>

                                        <td>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => callDeleteProduct(product.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </div>
);

}

export default ProductListPage;