import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/common/Navbar";

// Pages
import LoginPage from "./pages/LoginPage";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import VerifyPrescription from "./pages/VerifyPrescription";
import PharmacyProfile from "./pages/PharmacyProfile";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen flex flex-col font-inter bg-background text-foreground transition-colors duration-300">
                    <Navbar />
                    <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
                        <Routes>
                            {/* Public Routes */}
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
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
