import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    MOCK_USERS,
    simulateDelay,
    generateUHID,
} from '../services/mockData';

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
        await simulateDelay(800);
        const found = MOCK_USERS.find(
            (u) => u.email === email && u.password === password && u.role === 'patient'
        );
        if (!found) {
            throw new Error('Invalid email or password');
        }
        const fakeToken = btoa(`${found.id}:${Date.now()}`);
        setToken(fakeToken);
        setUser(found);
        localStorage.setItem('access_token', fakeToken);
        localStorage.setItem('user', JSON.stringify(found));
        return found;
    };

    const register = async (formData) => {
        await simulateDelay(1000);
        if (MOCK_USERS.find((u) => u.email === formData.email)) {
            throw new Error('Email already registered');
        }
        const health_id = generateUHID();
        const newUser = {
            id: MOCK_USERS.length + 1,
            ...formData,
            health_id,
            role: 'patient',
        };
        MOCK_USERS.push(newUser);
        return { ...newUser };
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
