import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("doctor_token");
        const doctorData = localStorage.getItem("doctor_data");
        if (token && doctorData) {
            try {
                setUser({ ...JSON.parse(doctorData), token });
            } catch {
                setUser({ role: "doctor", token });
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            const { token, doctor } = response.data;
            localStorage.setItem("doctor_token", token);
            localStorage.setItem("doctor_data", JSON.stringify(doctor));
            setUser({ ...doctor, token });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Login failed. Please check your credentials." };
        }
    };

    const logout = () => {
        localStorage.removeItem("doctor_token");
        localStorage.removeItem("doctor_data");
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
