
import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import type { LoginFormData } from '../../types/Auth';
import axios from 'axios';

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => Promise<void>;
    successMessage?: string;

}

function LoginForm({ onSubmit, successMessage}: LoginFormProps) {

    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
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

        if (!formData.email.trim() || !formData.password) {
            setError('Please enter both email and password.');
            return;
        }

        try {
            setLoading(true);
            await onSubmit(formData);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.message;

                setError(
                    typeof message === 'string'
                        ? message
                        : 'Unable to process your request.'
                );
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow p-4" style={{ width: '100%', maxWidth: '420px' }}>
                <div className="card-body">

                    <div className="text-center mb-4">
                        <h1 className="fw-bold">ShopSphere</h1>
                        <p className="text-muted">Welcome back! Please login.</p>
                    </div>
                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            {successMessage}
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
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
                                autoComplete="email"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <span className="text-muted">
                            Don't have an account?
                        </span>{' '}
                        <Link to="/register" className="text-decoration-none">
                            Register here
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default LoginForm;
