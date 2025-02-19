import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, checkAuth } = useContext(AuthContext);
    const location = useLocation();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (user === null) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;


