
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ProductListPage from './pages/products/ProductListPage';
import ProductStorePage from './pages/products/ProductStorePage';
import CreateProductPage from './pages/products/CreateProductPage';
import EditProductPage from './pages/products/EditProductPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import UserListPage from './pages/users/UserListPage';

import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import AppLayout from './components/layout/AppLayout';
import CreateUserPage from './pages/users/CreateUserPage';
import ViewUserPage from './pages/users/ViewUserPage';
import EditUserPage from './pages/users/EditUserPage';

function App() {

    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Authenticated Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>

                        {/* Shared CUSTOMER + ADMIN Routes */}
                        <Route
                            path="/products"
                            element={<ProductStorePage />}
                        />

                        {/* Admin-only Routes */}
                        <Route element={<AdminRoute />}>
                            <Route
                                path="/admin/dashboard"
                                element={<Navigate to="/admin/products" replace />}
                            />

                            {/* User Management */}
                            <Route
                                path="/admin/users"
                                element={<UserListPage />}
                            />

                            <Route
                                path="/admin/users/new"
                                element={<CreateUserPage />}
                            />
                            <Route 
                                path="/admin/users/:id" 
                                element={<ViewUserPage />}
                            />
                            <Route
                                path="/admin/users/edit/:id"
                                element={<EditUserPage />}
                            />
                            {/* Product Management */}
                            <Route
                                path="/admin/products"
                                element={<ProductListPage />}
                            />

                            <Route
                                path="/admin/products/new"
                                element={<CreateProductPage />}
                            />

                            <Route
                                path="/admin/products/edit/:id"
                                element={<EditProductPage />}
                            />

                        </Route>

                    </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/login" replace />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
