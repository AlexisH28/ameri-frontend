import { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                return;
            }
            const response = await api.get('/auth/me'); 
            setUser(response.data); 
        } catch (error) {
            console.error('Error verifying authentication:', error);
            setUser(null);
            localStorage.removeItem('token');
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (token) => {
        localStorage.setItem('token', token);
        await checkAuth(); 
    };


    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
