
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { User } from '../../types/User';
import {
    getUserById,
    updateUser
} from '../../services/userService';
import type { UpdateUserRequest } from '../../types/User';

import UserEditForm, {
    type UserEditRequest
} from '../../components/users/UserEditForm';

import UserPhoto from '../../components/users/UserPhoto';

function EditUserPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) {
            setError('Invalid user ID.');
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await getUserById(id);
                setUser(response);
            } catch (err) {
                console.error('Failed to fetch user:', err);
                setError('Unable to load user details.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleUpdateUser = async (data: UpdateUserRequest) => {
        if (!id) return;

        await updateUser(id, data);

        navigate('/admin/users', {
            state: {
                message: 'User updated successfully.'
            }
        });
    };

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status" />
                <p className="mt-2">Loading user...</p>
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
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <h4 className="mb-0">Edit User</h4>
                        </div>

                        <div className="card-body">
                            <div className="mb-4">
                                <label className="form-label">
                                    Profile Photo
                                </label>
                                <UserPhoto user={user} />
                            </div>

                            <hr />

                            <UserEditForm
                                initialData={user}
                                onSubmit={handleUpdateUser}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditUserPage;
