import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on mount
        const savedToken = localStorage.getItem('access_token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token: jwtToken, user: userData } = response.data;
            
            setToken(jwtToken);
            setUser(userData);
            localStorage.setItem('access_token', jwtToken);
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error("Login failed", error);
            throw new Error(error.response?.data?.message || 'Invalid email or password');
        }
    };

    const register = async (formData) => {
        try {
            const response = await api.post('/auth/register', formData);
            const { token: jwtToken, user: userData } = response.data;
            
            // Only login immediately if UI expects it. Our context here expects a returned user block
            return { ...userData };
        } catch (error) {
            console.error("Registration failed", error);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
