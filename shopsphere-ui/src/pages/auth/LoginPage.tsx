import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import type { LoginFormData } from '../../types/Auth';

function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = async (data: LoginFormData) => {
    // Authentication API integration will be added later.
        navigate('/products');
    };

    return (
        <LoginForm
            onSubmit={handleLogin}
        />
    );
}

export default LoginPage;