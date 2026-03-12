import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import PatientRegister from './pages/PatientRegister';
import RegistrationSuccess from './pages/RegistrationSuccess';
import PatientDashboard from './pages/PatientDashboard';
import MyRecords from './pages/MyRecords';
import MyPrescriptions from './pages/MyPrescriptions';
import PatientProfile from './pages/PatientProfile';
import AboutPage from './pages/AboutPage';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('hc_dark_mode');
    return saved === 'true';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('hc_dark_mode', darkMode);
  }, [darkMode]);

  const themeProps = { darkMode, setDarkMode };

  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage {...themeProps} />} />
        <Route path="/login" element={<LoginPage {...themeProps} />} />
        <Route path="/register" element={<PatientRegister {...themeProps} />} />
        <Route path="/register/success" element={<RegistrationSuccess {...themeProps} />} />
        <Route path="/about" element={<AboutPage {...themeProps} />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><PatientDashboard {...themeProps} /></ProtectedRoute>
        } />
        <Route path="/records" element={
          <ProtectedRoute><MyRecords {...themeProps} /></ProtectedRoute>
        } />
        <Route path="/prescriptions" element={
          <ProtectedRoute><MyPrescriptions {...themeProps} /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><PatientProfile {...themeProps} /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
