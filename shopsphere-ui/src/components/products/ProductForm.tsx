
import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import type { CreateProductRequest } from '../../types/Product';

interface ProductFormProps {
    initialData?: CreateProductRequest;
    onSubmit: (data: CreateProductRequest) => Promise<void>;
    submitLabel: string;
    onCancel?: () => void;
}

function ProductForm({
    initialData,
    onSubmit,
    submitLabel,
    onCancel
}: ProductFormProps) {

    const [formData, setFormData] = useState<CreateProductRequest>({
        name: initialData?.name ?? '',
        description: initialData?.description ?? '',
        sku: initialData?.sku ?? '',
        price: initialData?.price ?? 0,
        category: initialData?.category ?? '',
        imageUrl: initialData?.imageUrl ?? ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? Number(value) : value
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError(null);

            await onSubmit(formData);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Something went wrong.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">

            <div className="page-header">
                <div>
                    <h1 className="page-title">{submitLabel}</h1>
                    <p className="page-subtitle">
                        Enter product details and manage its appearance.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>

                <div className="content-card">

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <div className="row g-4">

                        {/* Left Column - Product Details */}
                        <div className="col-lg-8">

                            <h5 className="form-section-title">
                                Product Information
                            </h5>

                            <div className="row g-3">

                                <div className="col-md-6">
                                    <label className="form-label">
                                        Product Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="Enter product name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        maxLength={150}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">
                                        SKU *
                                    </label>

                                    <input
                                        type="text"
                                        name="sku"
                                        className="form-control"
                                        placeholder="Enter SKU"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        maxLength={50}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">
                                        Category *
                                    </label>

                                    <input
                                        type="text"
                                        name="category"
                                        className="form-control"
                                        placeholder="Enter category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        maxLength={100}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">
                                        Price (₹) *
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        className="form-control"
                                        placeholder="Enter price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        min="0.01"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        className="form-control"
                                        placeholder="Describe your product..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={5}
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Right Column - Product Image */}
                        <div className="col-lg-4">

                            <h5 className="form-section-title">
                                Product Image
                            </h5>

                            <div className="product-image-card">

                                <div className="product-image-preview">
                                    {formData.imageUrl ? (
                                        <img
                                            src={formData.imageUrl}
                                            alt="Product preview"
                                            onError={(event) => {
                                                event.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="image-placeholder">
                                            <span>📦</span>
                                            <p>No image selected</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-3">
                                    <label className="form-label">
                                        Image URL
                                    </label>

                                    <input
                                        type="url"
                                        name="imageUrl"
                                        className="form-control"
                                        placeholder="https://example.com/image.jpg"
                                        value={formData.imageUrl ?? ''}
                                        onChange={handleChange}
                                    />

                                    <small className="text-secondary">
                                        Paste an image URL to preview your product.
                                    </small>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">

                        {onCancel && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary px-4"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary px-4"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Saving...
                                </>
                            ) : submitLabel}
                        </button>

                    </div>

                </div>

            </form>

        </div>
    );
}

export default ProductForm;
