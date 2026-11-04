
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { User } from '../../types/User';
import { deleteUser, getAllUsers } from '../../services/userService';
import UserPhoto from '../../components/users/UserPhoto';
import { useAuth } from '../../context/AuthContext';

function UserListPage() {

    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const location = useLocation();
    const successMessage = location.state?.message as string | undefined;

    const navigate = useNavigate();

    const { user: loggedInUser } = useAuth();
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getAllUsers();
                setUsers(data);

            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Something went wrong while fetching users.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const callDeleteUser = async (id: string) => {

        const confirmed = window.confirm(
            'Are you sure you want to delete this user?'
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingUserId(id);
            setError(null);

            await deleteUser(id);

            setUsers(prevUsers =>
                prevUsers.filter(user => user.id !== id)
            );

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Something went wrong while deleting user.');
            }
        } finally {
            setDeletingUserId(null);
        }
    };

    return (
        <div className="page-container">

            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Users</h1>
                    <p className="page-subtitle">
                        Manage your customers
                    </p>
                </div>

                <button
                    className="btn btn-primary px-4"
                    onClick={() => navigate('/admin/users/new')}
                >
                    + Add User
                </button>
            </div>

            {/* User Count */}
            <div className="content-card">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h5 className="mb-1">All Users</h5>
                        <span className="text-secondary small">
                            {users.length} users found
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
                            Loading users...
                        </p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="alert alert-success">
                        {successMessage}
                    </div>
                )}
                {/* User Table */}
                {!loading && (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">

                            <thead>
                                <tr>
                                    <th>Photo</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-5">
                                            <p className="text-secondary mb-2">
                                                No users found.
                                            </p>

                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => navigate('/admin/users/new')}
                                            >
                                                Add your first user
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id}>
                                            <td>
                                                <UserPhoto user={user} />
                                            </td>
                                            <td className="fw-semibold">
                                                {user.firstName}
                                            </td>

                                            <td className="text-secondary">
                                                {user.lastName}
                                            </td>

                                            <td>{user.email}</td>

                                            <td>{user.phone}</td>

                                            <td>
                                                <span className={`badge ${
                                                    user.role === 'ADMIN'
                                                        ? 'bg-primary'
                                                        : 'bg-light text-dark border'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="d-flex gap-2">

                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() =>
                                                            navigate(`/admin/users/${user.id}`)
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() =>
                                                            navigate(`/admin/users/edit/${user.id}`)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        disabled={
                                                            deletingUserId !== null ||
                                                            loggedInUser?.id === user.id
                                                        }
                                                        title={
                                                            loggedInUser?.id === user.id
                                                                ? "You cannot delete your own account"
                                                                : "Delete user"
                                                        }
                                                        onClick={() => callDeleteUser(user.id)}
                                                    >
                                                        {deletingUserId === user.id ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-1" />
                                                                Deleting...
                                                            </>
                                                        ) : (
                                                            'Delete'
                                                        )}
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

export default UserListPage;
