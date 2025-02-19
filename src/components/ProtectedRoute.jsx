import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, checkAuth } = useContext(AuthContext);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            await checkAuth();
            setIsLoading(false);
        };
        verifyAuth();
    }, []);

    if (isLoading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Verificando autenticación...</span>
                </div>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;




