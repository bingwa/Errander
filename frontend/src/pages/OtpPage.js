import React, { useState } from 'react';
// FIX: Removed 'useNavigate' since it was assigned but never used.
// If navigation is needed after OTP verification, this import and the
// 'navigate' constant should be re-added and implemented in the handler.
import { useLocation } from 'react-router-dom';
import authService from '../services/authService';

const OtpPage = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // We might still need the location to get user info, e.g., email
    const location = useLocation();
    const { email } = location.state || {};

    // FIX: Removed 'navigate' as it was defined but not used.
    // const navigate = useNavigate();

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authService.verifyOtp(email, otp);
            // On success, you would navigate the user. For example:
            // navigate('/dashboard'); 
            // Since this logic wasn't present, the variable was unused.
            alert('OTP Verified Successfully! Navigation logic would go here.');
        } catch (err) {
            setError('Invalid OTP. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-2">Verify OTP</h2>
                <p className="text-center text-gray-600 mb-6">
                    An OTP has been sent to {email || 'your email'}.
                </p>
                <form onSubmit={handleVerifyOtp}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="otp">
                            Enter OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 text-center tracking-[0.5em]"
                            maxLength="6"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpPage;
