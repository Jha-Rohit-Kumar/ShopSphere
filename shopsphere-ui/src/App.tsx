import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProductListPage from './pages/products/ProductListPage';
import CreateProductPage from './pages/products/CreateProductPage';
import EditProductPage from './pages/products/EditProductPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={ <LoginPage/>}/>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/new" element={<CreateProductPage />} />
                <Route path="/products/edit/:id" element={<EditProductPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;