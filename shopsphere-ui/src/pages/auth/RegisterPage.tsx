import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import type { RegisterRequest } from '../../types/Auth';

function RegisterPage() {
    const navigate = useNavigate();

    const handleRegister = async (data: RegisterRequest) => {
        // TODO: Connect createUser API
        // After successful registration, navigate to Login
        navigate('/login');
    };

    return (
        <RegisterForm
            onSubmit={handleRegister}
        />
    );
}

export default RegisterPage;