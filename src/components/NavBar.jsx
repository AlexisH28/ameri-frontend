import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-transparent">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold fs-3 text-gradient" to="/">
                    Ameri & Duki
                </Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link text-light hover-gradient" to="/">Home</Link>
                        </li>
                        {user ? (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link text-light hover-gradient" to="/profile">Profile</Link>
                            </li>
                            <li className="nav-item">
                            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                            </li>
                        </>
                        ) : (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link text-light hover-gradient" to="/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-light hover-gradient" to="/register">Register</Link>
                            </li>
                        </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
