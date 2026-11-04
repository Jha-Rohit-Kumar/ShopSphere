
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
            <div className="container-fluid">

                <Link className="navbar-brand fw-bold" to="/products">
                    ShopSphere
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#shopsphereNavbar"
                    aria-controls="shopsphereNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="shopsphereNavbar">

                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        {/* Shopping: ADMIN + CUSTOMER */}
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/products">
                                Products
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/cart">
                                Cart
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/my-orders">
                                My Orders
                            </NavLink>
                        </li>

                        {/* Admin-only navigation */}
                        {user?.role === 'ADMIN' && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/admin/dashboard">
                                        Dashboard
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/admin/users">
                                        Manage Users
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/admin/products">
                                        Manage Products
                                    </NavLink>
                                </li>
                            </>
                        )}

                    </ul>

                    <div className="d-flex align-items-center gap-3">

                        <span className="text-white">
                            Welcome, {user?.firstName}
                        </span>

                        <button
                            className="btn btn-outline-light btn-sm"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;
