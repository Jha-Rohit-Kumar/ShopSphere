
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import type { CreateUserRequest } from '../../types/User';

interface UserFormProps {
    onSubmit: (data: CreateUserRequest) => Promise<void>;
}

function UserForm({ onSubmit }: UserFormProps) {

    const navigate = useNavigate();

    const [formData, setFormData] = useState<CreateUserRequest>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'CUSTOMER',
        password: ''
    });

    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');

        if (formData.password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (new TextEncoder().encode(formData.password).length > 72) {
            setError('Password must not exceed 72 UTF-8 bytes.');
            return;
        }

        try {
            setLoading(true);
            await onSubmit(formData);
        } catch (err) {
            console.error('Failed to create user:', err);
            setError('Unable to create user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="mb-3">
                <label className="form-label">First Name</label>
                <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    maxLength={150}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    maxLength={150}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={15}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                    className="form-select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                >
                    <option value="CUSTOMER">Customer</option>
                    <option value="ADMIN">Admin</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    value={confirmPassword}
                    onChange={event => setConfirmPassword(event.target.value)}
                    required
                />
            </div>

            <div className="form-check mb-3">
                <input
                    type="checkbox"
                    className="form-check-input"
                    checked={showPassword}
                    onChange={event => setShowPassword(event.target.checked)}
                    id="showPassword"
                />
                <label className="form-check-label" htmlFor="showPassword">
                    Show password
                </label>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/admin/users')}
                    disabled={loading}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create User'}
                </button>

            </div>

        </form>
    );
}

export default UserForm;
