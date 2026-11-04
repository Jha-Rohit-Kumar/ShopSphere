
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../../components/products/ProductForm';
import {
    getProductById,
    updateProduct
} from '../../services/productService';
import type {
    CreateProductRequest,
    Product
} from '../../types/Product';

function EditProductPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (!id) {
                    throw new Error('Product ID is missing');
                }

                const response = await getProductById(id);
                setProduct(response);
            } catch (err) {
                setError('Failed to load product.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleUpdate = async (data: CreateProductRequest) => {
        if (!id) return;

        await updateProduct(id, data);
        navigate('/admin/products');
    };

    if (loading) {
        return <p>Loading product...</p>;
    }

    if (error || !product) {
        return <p>{error || 'Product not found.'}</p>;
    }

    return (
        <ProductForm
            initialData={product}
            onSubmit={handleUpdate}
            submitLabel="Update Product"
            onCancel={() => navigate('/admin/products')}
        />
    );
}

export default EditProductPage;
