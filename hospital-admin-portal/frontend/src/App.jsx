import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ManageDoctors from './pages/ManageDoctors';
import ManagePharmacies from './pages/ManagePharmacies';

import './index.css';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="w-full"
  >
    {children}
  </motion.div>
);

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
          <Route path="/doctors" element={<PageWrapper><ManageDoctors /></PageWrapper>} />
          <Route path="/pharmacies" element={<PageWrapper><ManagePharmacies /></PageWrapper>} />
          {/* Settings page could be added here if needed */}
          <Route path="/settings" element={<PageWrapper><div className="text-google-grey-600">Settings Page Coming Soon...</div></PageWrapper>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
