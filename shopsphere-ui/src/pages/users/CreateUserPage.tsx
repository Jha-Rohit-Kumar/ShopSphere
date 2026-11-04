
import { useNavigate } from 'react-router-dom';
import UserForm from '../../components/users/UserForm';
import type { CreateUserRequest } from '../../types/User';
import { createUser } from '../../services/userService';

function CreateUserPage() {

    const navigate = useNavigate();

    const handleCreateUser = async (data: CreateUserRequest) => {
        await createUser(data);

        navigate('/admin/users', {
            state: { message: 'User created successfully.' }
        });
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <h4 className="mb-0">Add New User</h4>
                        </div>

                        <div className="card-body">
                            <UserForm onSubmit={handleCreateUser} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateUserPage;
