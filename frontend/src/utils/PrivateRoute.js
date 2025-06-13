// frontend/src/utils/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Spinner } from 'react-bootstrap';

const PrivateRoute = ({ roles }) => {
    const { user, token, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // This is a simple role check. 'user' can be true, 'errander' can be true.
    // If roles are specified, check if the user has one of the required roles.
    // For now, we are just checking if the user object exists from a valid token.
    // We will enhance this later if we need more granular roles.
    
    // A simple check to see if the user is an errander or a regular user
    const userHasRequiredRole = user && (roles ? roles.includes(user.isErrander ? 'errander' : 'user') : true);

    if (!userHasRequiredRole) {
         // Redirect them to a relevant page if they don't have the role
         // For example, a user trying to access an errander-only page
        return <Navigate to="/" replace />;
    }


    return <Outlet />;
};

export default PrivateRoute;
