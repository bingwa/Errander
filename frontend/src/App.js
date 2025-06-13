import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// FIX: Import the Ant Design CSS file to apply styles globally.
// This will fix the unstyled components on the login page.
import 'antd/dist/reset.css'; // or 'antd/dist/antd.css' for older versions

// Import your page components
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ErranderDashboard from './pages/ErranderDashboard';
import OtpPage from './pages/OtpPage';
// Add any other page imports here

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/dashboard" efrlement={<ErranderDashboard />} />
          <Route path="/verify-otp" element={<OtpPage />} />
          {/* Define a default route, e.g., to the login page */}
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
