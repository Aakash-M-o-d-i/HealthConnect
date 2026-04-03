import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("pharmacy_token");
        const savedUser = localStorage.getItem("pharmacy_user");
        if (token && savedUser) {
            try {
                setUser({ ...JSON.parse(savedUser), token });
            } catch {
                setUser({ role: "pharmacy", token });
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            const { token, pharmacy } = response.data;
            localStorage.setItem("pharmacy_token", token);
            localStorage.setItem("pharmacy_user", JSON.stringify(pharmacy));
            setUser({ ...pharmacy, token });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem("pharmacy_token");
        localStorage.removeItem("pharmacy_user");
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
