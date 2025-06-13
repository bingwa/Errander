// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        navigate('/login');
    }, [navigate]);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwt_decode(token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser(decodedToken.user);
                }
            } catch (error) {
                logout();
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, [token, logout]);

    const loginAction = (newToken) => {
        localStorage.setItem('token', newToken);
        const decoded = jwt_decode(newToken);
        setToken(newToken);
        
        if (decoded.user.isAdmin) { navigate('/admin'); } 
        else if (decoded.user.isErrander) { navigate('/errander-dashboard'); } 
        else { navigate('/dashboard'); }
    };
    
    const authContextValue = { user, token, loading, loginAction, logout };

    return (
        <AuthContext.Provider value={authContextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;