
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import type { LoginFormData } from '../../types/Auth';
import { useAuth } from '../../context/AuthContext';

function LoginPage() {

    const navigate = useNavigate();
    const location = useLocation();

    const { login } = useAuth();

    const message = location.state?.message as string | undefined;

    const handleLogin = async (data: LoginFormData) => {

        const authenticatedUser = await login(data);

        const requestedPath = location.state?.from?.pathname;

        // Preserve the originally requested page when permitted.
        if (requestedPath && requestedPath.startsWith('/') &&
            !requestedPath.startsWith('//')) {

            const isAdminRoute = requestedPath.startsWith('/admin');

            if (authenticatedUser.role === 'ADMIN' || !isAdminRoute) {
                navigate(requestedPath, { replace: true });
                return;
            }
        }

        if (authenticatedUser.role === 'ADMIN') {
            navigate('/admin/dashboard', { replace: true });
        } else {
            navigate('/products', { replace: true });
        }
    };

    return (
        <LoginForm
            onSubmit={handleLogin}
            successMessage={message}
        />
    );
}

export default LoginPage;
