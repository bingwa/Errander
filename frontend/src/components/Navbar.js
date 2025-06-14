// frontend/src/components/Navbar.js
import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // Import the theme hook

const AppNavbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme(); // Use the theme context
    const homeLink = user ? (user.isErrander ? "/errander-dashboard" : "/dashboard") : "/";

    return (
        <Navbar bg="light" expand="lg" className="shadow-sm mb-4">
            <Container>
                <LinkContainer to={homeLink}>
                    <Navbar.Brand className="fw-bold" style={{color: '#667eea'}}>Errander</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {user ? (
                            <>
                                {!user.isErrander && <LinkContainer to="/dashboard"><Nav.Link>Dashboard</Nav.Link></LinkContainer>}
                                {user.isAdmin && <LinkContainer to="/admin"><Nav.Link>Admin Panel</Nav.Link></LinkContainer>}
                                <Button variant="outline-danger" onClick={logout} size="sm" className="mx-2">Logout</Button>
                            </>
                        ) : (
                            <>
                                <LinkContainer to="/login"><Nav.Link>Login</Nav.Link></LinkContainer>
                                <LinkContainer to="/register"><Nav.Link as={Button} variant="primary" className="ms-2 text-black">Sign Up</Nav.Link></LinkContainer>
                            </>
                        )}
                        {/* Theme Toggle Switch */}
                        <Form.Check 
                            type="switch"
                            id="theme-switch"
                            label={theme === 'light' ? '🌙' : '☀️'}
                            checked={theme === 'dark'}
                            onChange={toggleTheme}
                            className="ms-3 fs-5"
                        />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
