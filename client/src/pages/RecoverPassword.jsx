import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function RecoverPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: email input, 2: password reset
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.sendResetEmail(email);
      if (response.success) {
        setSuccess(response.message || 'If an account exists with this email, a reset link has been sent.');
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-5 py-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Section - Welcome Message */}
            <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-6 lg:p-10 flex flex-col justify-center">
              <h1 className="text-3xl font-bold mb-3">Welcome to our community</h1>
              <p className="text-white/90 text-base mb-6">
                Start your new journey with us and join our community
              </p>
              <Link
                to="/"
                className="inline-block px-5 py-2.5 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md text-sm"
              >
                Explore our community
              </Link>
            </div>

            {/* Right Section - Password Recovery Form */}
            <div className="p-6 lg:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reset Your Password</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Recovery Link'}
                </button>

                <div className="text-center text-sm text-gray-600">
                  <Link to="/signin" className="text-primary hover:underline">
                    Back to Sign in
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

