
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { User, UserRole } from '../../types/User';

interface UserEditFormProps {
    initialData: User;
    onSubmit: (data: UserEditRequest) => Promise<void>;
}

export interface UserEditRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: UserRole;
}

function UserEditForm({ initialData, onSubmit }: UserEditFormProps) {
    const [formData, setFormData] = useState<UserEditRequest>({
        firstName: initialData.firstName,
        lastName: initialData.lastName || '',
        email: initialData.email,
        phone: initialData.phone || '',
        role: initialData.role
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setFormData({
            firstName: initialData.firstName,
            lastName: initialData.lastName || '',
            email: initialData.email,
            phone: initialData.phone || '',
            role: initialData.role
        });
    }, [initialData]);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');

        if (!formData.firstName.trim()) {
            setError('First name is required.');
            return;
        }

        if (!formData.email.trim()) {
            setError('Email is required.');
            return;
        }

        try {
            setLoading(true);
            await onSubmit({
                ...formData,
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim()
            });
        } catch (err) {
            console.error('Failed to update user:', err);
            setError('Unable to update user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">First Name *</label>
                    <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        value={formData.firstName}
                        onChange={handleChange}
                        maxLength={150}
                        required
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        value={formData.lastName}
                        onChange={handleChange}
                        maxLength={150}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        maxLength={254}
                        required
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={15}
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Role *</label>
                    <select
                        name="role"
                        className="form-select"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="CUSTOMER">Customer</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => window.history.back()}
                    disabled={loading}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Update User'}
                </button>
            </div>
        </form>
    );
}

export default UserEditForm;
