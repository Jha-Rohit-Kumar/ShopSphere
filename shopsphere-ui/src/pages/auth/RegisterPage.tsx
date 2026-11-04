
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import type { RegisterRequest } from '../../types/Auth';
import { registerUser } from '../../services/authService';

function RegisterPage() {

    const navigate = useNavigate();

    const handleRegister = async (data: RegisterRequest) => {

        await registerUser(data);

        // Registration successful.
        // Redirect customer to login page.
        navigate('/login', {
            state: {
                message: 'Registration successful! Please login.'
            }
        });
    };

    return (
        <RegisterForm
            onSubmit={handleRegister}
        />
    );
}

export default RegisterPage;
