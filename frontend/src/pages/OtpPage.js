import React, { useState, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import AuthContext from '../context/AuthContext';
import { Button, Alert, Spinner } from 'react-bootstrap';
import './Auth.css';

const OtpPage = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginAction } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = location.state || {};
    const inputsRef = useRef([]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.nextSibling) { element.nextSibling.focus(); }
    };
    const handleKeyDown = (e, index) => { if (e.key === 'Backspace' && !otp[index] && inputsRef.current[index - 1]) { inputsRef.current[index - 1].focus(); } };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) { return setError("Session error. Please try logging in again."); }
        setLoading(true);
        setError('');
        try {
            const response = await authService.verifyOtp(userId, otp.join(""));
            loginAction(response.data.token);
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.msg || 'OTP verification failed.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header"><h2>Two-Factor Authentication</h2></div>
                <div className="auth-body">
                    <p className="text-center text-muted">A 6-digit code has been sent to your phone.</p>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <div className="otp-inputs">{otp.map((data, index) => <input className="otp-input" type="text" maxLength="1" key={index} value={data} onChange={e => handleChange(e.target, index)} onFocus={e => e.target.select()} onKeyDown={e => handleKeyDown(e, index)} ref={el => (inputsRef.current[index] = el)} />)}</div>
                        <Button className="auth-btn" type="submit" disabled={loading}>{loading ? <Spinner animation="border" size="sm" /> : 'Verify Account'}</Button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default OtpPage;
