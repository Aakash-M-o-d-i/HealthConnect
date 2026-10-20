import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/common/Navbar";

// Pages
import LoginPage from "./pages/LoginPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import SearchPatient from "./pages/SearchPatient";
import PatientDetails from "./pages/PatientDetails";
import CreateVisit from "./pages/CreateVisit";
import WritePrescription from "./pages/WritePrescription";
import PrescriptionSuccess from "./pages/PrescriptionSuccess";

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col font-inter bg-background text-foreground transition-colors duration-300">
      {user && <Navbar />}
      <main className={`flex-grow ${user ? "container mx-auto px-4 py-8 max-w-7xl" : "w-full"}`}>
        <Routes>
          {/* Public Route / Clinical Gateway */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPatient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/:id"
            element={
              <ProtectedRoute>
                <PatientDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visits/create"
            element={
              <ProtectedRoute>
                <CreateVisit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prescriptions/create"
            element={
              <ProtectedRoute>
                <WritePrescription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prescriptions/success"
            element={
              <ProtectedRoute>
                <PrescriptionSuccess />
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
