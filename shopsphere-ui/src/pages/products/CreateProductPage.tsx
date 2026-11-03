import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/products/ProductForm';
import { createProduct } from '../../services/productService';
import type { CreateProductRequest } from '../../types/Product';

function CreateProductPage() {
    const navigate = useNavigate();

    const handleCreate = async (data: CreateProductRequest) => {
        await createProduct(data);
        navigate('/products');
    };

    return (
        <ProductForm
            onSubmit={handleCreate}
            submitLabel="Add Product"
            onCancel={() => navigate('/products')}
        />
    );
}

export default CreateProductPage;