import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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

