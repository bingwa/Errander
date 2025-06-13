import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 
import AuthContext, { AuthProvider } from './context/AuthContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import AppNavbar from './components/Navbar.js';
import PrivateRoute from './utils/PrivateRoute.js';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import OtpPage from './pages/OtpPage.js';
import UserDashboard from './pages/UserDashboard.js';
import ErranderDashboard from './pages/ErranderDashboard.js';
import AdminPage from './pages/AdminPage.js';
import ServicesPage from './pages/ServicesPage.js';
import BookingPage from './pages/BookingPage.js';
import FindErranderPage from './pages/FindErranderPage.js';
import TaskTrackingPage from './pages/TaskTrackingPage.js';
import CheckoutPage from './pages/CheckoutPage.js';

const AppRoutes = () => {
    const { user } = useContext(AuthContext);
    if (user && (window.location.pathname === '/login' || window.location.pathname === '/register' || window.location.pathname === '/')) {
        const dashboardPath = user.isAdmin ? "/admin" : (user.isErrander ? "/errander-dashboard" : "/dashboard");
        return <Navigate to={dashboardPath} replace />;
    }
    return (
        <><AppNavbar /><main className="container-fluid p-0"><Routes>
            <Route path="/" element={!user ? <HomePage /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<OtpPage />} />
            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/booking/:serviceId" element={<BookingPage />} />
                <Route path="/find-errander/:taskId" element={<FindErranderPage />} />
                <Route path="/track/:taskId" element={<TaskTrackingPage />} />
                <Route path="/checkout/:taskId" element={<CheckoutPage />} />
                <Route path="/errander-dashboard" element={<ErranderDashboard />} />
                <Route path="/admin" element={<AdminPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
        </Routes></main></>
    );
};
function App() { return (<ThemeProvider><Router><AuthProvider><AppRoutes /></AuthProvider></Router></ThemeProvider>); }
export default App;