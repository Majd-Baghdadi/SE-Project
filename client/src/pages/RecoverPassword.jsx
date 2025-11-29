import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
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

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Basic email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    // Simulate processing delay (frontend only)
    setTimeout(() => {
      // Move to step 2 (password reset) - frontend only
      setStep(2);
      setLoading(false);
    }, 800);
  };

  // Password validation function
  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one digit';
    }
    if (!/[a-zA-Z]/.test(password)) {
      return 'Password must contain at least one letter';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    // Frontend-only password reset (no backend calls)
    // Simulate processing delay
    setTimeout(() => {
      // Set authentication state (log user in after password reset)
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', email.split('@')[0]); // Use email prefix as username
      window.dispatchEvent(new Event('authStateChanged'));
      
      setSuccess('Password reset successfully! Redirecting to home...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {step === 1 ? 'Reset Your Password' : 'Reset Your Password'}
              </h2>
              
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

              {step === 1 ? (
                // Step 1: Enter email
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
                    {loading ? 'Sending...' : 'Continue'}
                  </button>

                  <div className="text-center text-sm text-gray-600">
                    <Link to="/signin" className="text-primary hover:underline">
                      Back to Sign in
                    </Link>
                  </div>
                </form>
              ) : (
                // Step 2: Reset password
                <form onSubmit={handlePasswordReset} className="space-y-5">
                  <div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter New Password"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Password must contain: at least 6 characters, one digit, one letter, and one special character
                    </p>
                  </div>

                  <div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Your Password"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>

                  <div className="text-center text-sm text-gray-600 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setNewPassword('');
                        setConfirmPassword('');
                        setError('');
                        setSuccess('');
                      }}
                      className="text-primary hover:underline"
                    >
                      ← Back to Email
                    </button>
                    <div className="border-t border-gray-300 pt-4">
                      <Link to="/signin" className="text-primary hover:underline">
                        Back to Sign In
                      </Link>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

