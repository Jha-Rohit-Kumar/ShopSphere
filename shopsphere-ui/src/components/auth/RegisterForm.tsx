import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { RegisterRequest } from '../../types/Auth';

interface RegisterFormProps {
    onSubmit: (data: RegisterRequest) => Promise<void>;
}

interface RegisterFormData extends RegisterRequest {
    confirmPassword: string;
}

function RegisterForm({ onSubmit }: RegisterFormProps) {

    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');

        if (
            !formData.firstName.trim() ||
            !formData.lastName.trim() ||
            !formData.email.trim() ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError('Please fill in all required fields.');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must contain at least 8 characters.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Password and Confirm Password do not match.');
            return;
        }

        // Exclude confirmPassword from the backend request.
        const { confirmPassword, ...registrationData } = formData;

        try {
            setLoading(true);
            await onSubmit(registrationData);
        } catch {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">

            <div className="card shadow p-4" style={{ width: '100%', maxWidth: '500px' }}>

                <div className="card-body">

                    <div className="text-center mb-4">
                        <h1 className="fw-bold">ShopSphere</h1>
                        <p className="text-muted">Create your customer account</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="row">

                            <div className="col-md-6 mb-3">
                                <label htmlFor="firstName" className="form-label">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    className="form-control"
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    maxLength={100}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="lastName" className="form-label">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    className="form-control"
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    maxLength={100}
                                    required
                                />
                            </div>

                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                maxLength={150}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={8}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-control"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                minLength={8}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>

                    </form>

                    <div className="text-center mt-4">
                        <span className="text-muted">
                            Already have an account?
                        </span>{' '}
                        <Link to="/login" className="text-decoration-none">
                            Login here
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default RegisterForm;