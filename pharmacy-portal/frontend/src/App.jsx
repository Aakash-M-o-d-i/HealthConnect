import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/common/Navbar";

// Pages
import LoginPage from "./pages/LoginPage";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import VerifyPrescription from "./pages/VerifyPrescription";
import PharmacyProfile from "./pages/PharmacyProfile";

function AppContent() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen flex flex-col font-inter bg-background text-foreground transition-colors duration-300">
            {user && <Navbar />}
            <main className={`flex-grow ${user ? "container mx-auto px-4 py-8 max-w-7xl" : "w-full"}`}>
                <Routes>
                    {/* Public Route / Dispensation Gateway */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <PharmacyDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/verify"
                        element={
                            <ProtectedRoute>
                                <VerifyPrescription />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <PharmacyProfile />
                            </ProtectedRoute>
                        }
                    />

                    {/* Default Redirects */}
                    <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
                    <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;
