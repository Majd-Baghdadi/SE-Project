import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import authService from '../services/authService';
import NavBar from '../components/NavBar';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [resending, setResending] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid or missing verification token.');
            return;
        }

        const verify = async () => {
            try {
                const response = await authService.verifyEmail(token);
                if (response.success) {
                    setStatus('success');
                    setMessage('Your email has been successfully verified! You are now logged in.');
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                }
            } catch (error) {
                setStatus('error');
                setMessage(error.message || 'Verification failed. The link might be expired or invalid.');
            }
        };

        verify();
    }, [token, navigate]);

    const handleResend = async () => {
        if (!email) {
            setMessage('Please enter your email to resend the verification link.');
            return;
        }

        setResending(true);
        try {
            const response = await authService.resendVerificationEmail(email);
            if (response.success) {
                setMessage('A new verification link has been sent to your email.');
            }
        } catch (error) {
            setMessage(error.message || 'Failed to resend verification link.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavBar />
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    {status === 'loading' && (
                        <div className="space-y-4">
                            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
                            <h2 className="text-2xl font-bold text-gray-900">Verifying Email...</h2>
                            <p className="text-gray-600">Please wait while we verify your account.</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                            <h2 className="text-2xl font-bold text-gray-900">Verification Successful!</h2>
                            <p className="text-green-600 font-medium">{message}</p>
                            <p className="text-gray-500 text-sm italic">Redirecting you to the home page...</p>
                            <Link
                                to="/"
                                className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                Go to Home
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                            <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
                            <p className="text-red-600 font-medium">{message}</p>

                            <div className="pt-6 border-t border-gray-100">
                                <p className="text-gray-600 text-sm mb-4">
                                    Link expired? Enter your email below to get a new one.
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    />
                                    <button
                                        onClick={handleResend}
                                        disabled={resending}
                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {resending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                                        Resend
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Link to="/signin" className="text-primary hover:underline text-sm font-medium">
                                    Return to Sign In
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
