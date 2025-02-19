import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';
import SearchService from '../api/SearchService';

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleNavbar = () => {
        setIsCollapsed(!isCollapsed);
    };

    useEffect(() => {
        document.body.classList.add('transition-theme');
        document.body.classList.toggle('light-mode', theme === 'light');
        document.body.classList.toggle('dark-mode', theme === 'dark');
    }, [theme]);

    useEffect(() => {
        SearchService.connect();
        SearchService.onSearchResults((results) => {
            setSearchResults(results);
            setShowResults(true);
        });

        return () => {
            SearchService.disconnect();
        };
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value.trim() !== '') {
            fetchSearchResults(e.target.value);
        } else {
            setShowResults(false);
        }
    };

    const fetchSearchResults = async (query) => {
        try {
            const results = await SearchService.search(query);
            setSearchResults(results);
            setShowResults(true);
        } catch (error) {
            console.error('Error al buscar:', error);
        }
    };

    const handleSearchSelect = (result) => {
        setShowResults(false);
        setSearchQuery('');
        navigate(`/profile/${result.username}`);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-transparent shadow-sm">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold fs-3 text-gradient" to="/">
                    Ameri & Duki
                </Link>
                <button 
                    className={`navbar-toggler ${isCollapsed ? '' : 'collapsed'}`} 
                    type="button" 
                    onClick={toggleNavbar} 
                    aria-controls="navbarNav" 
                    aria-expanded={!isCollapsed} 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isCollapsed ? '' : 'show'}`} id="navbarNav">
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
                                <button className="btn btn-outline-danger rounded-pill" onClick={handleLogout}>Logout</button>
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
                        <li className="nav-item">
                            <button 
                                className="btn-toggle-mode ms-3" 
                                onClick={toggleTheme}
                                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                            >
                                {theme === 'light' ? '🌙' : '☀️'}
                            </button>
                        </li>
                    </ul>
                    <form className="d-flex ms-3 position-relative">
                        <input 
                            type="search" 
                            className="form-control" 
                            placeholder="Search users or posts..." 
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </form>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
