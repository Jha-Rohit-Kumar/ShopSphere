
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { User } from '../../types/User';
import { getUserById } from '../../services/userService';
import UserPhoto from '../../components/users/UserPhoto';

function ViewUserPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError('Invalid user ID.');
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getUserById(id);
                setUser(response);
            } catch (err) {
                console.error('Failed to fetch user:', err);
                setError('Unable to load user details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading user details...</p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    {error || 'User not found.'}
                </div>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin/users')}
                >
                    Back to Users
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>User Details</h2>
                    <p className="text-muted mb-0">
                        View customer information
                    </p>
                </div>

                <div className="d-flex gap-2">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/admin/users')}
                    >
                        Back
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                    >
                        Edit User
                    </button>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <UserPhoto user={user} />

                        <div>
                            <h4 className="mb-1">
                                {user.firstName} {user.lastName}
                            </h4>
                            <span className={`badge ${
                                user.role === 'ADMIN'
                                    ? 'bg-primary'
                                    : 'bg-success'
                            }`}>
                                {user.role}
                            </span>
                        </div>
                    </div>

                    <hr />

                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="text-muted">First Name</label>
                            <p className="fw-semibold">{user.firstName}</p>
                        </div>

                        <div className="col-md-6">
                            <label className="text-muted">Last Name</label>
                            <p className="fw-semibold">{user.lastName || '-'}</p>
                        </div>

                        <div className="col-md-6">
                            <label className="text-muted">Email</label>
                            <p className="fw-semibold">{user.email}</p>
                        </div>

                        <div className="col-md-6">
                            <label className="text-muted">Phone</label>
                            <p className="fw-semibold">{user.phone || '-'}</p>
                        </div>

                        <div className="col-md-6">
                            <label className="text-muted">Created At</label>
                            <p className="fw-semibold">
                                {new Date(user.createdAt).toLocaleString()}
                            </p>
                        </div>

                        <div className="col-md-6">
                            <label className="text-muted">Updated At</label>
                            <p className="fw-semibold">
                                {new Date(user.updatedAt).toLocaleString()}
                            </p>
                        </div>

                        <div className="col-12">
                            <label className="text-muted">User ID</label>
                            <p className="fw-semibold text-break">{user.id}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewUserPage;
