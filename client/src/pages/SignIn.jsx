import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setNeedsVerification(false);
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.resendVerificationEmail(formData.email);
      if (response.success) {
        alert('A new verification link has been sent to your email.');
        setNeedsVerification(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);

      if (response.success) {
        navigate('/');
      } else {
        // Check if the failure was due to verification
        if (response.status === 403 || response.error?.includes('verified')) {
          setNeedsVerification(true);
          setError('Your email is not verified yet. Please check your inbox or verify below.');
        } else {
          setError(response.error || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Login error details:', err);

      // The error object thrown by api.js interceptor has status and message
      if (err.status === 403) {
        setNeedsVerification(true);
        setError('Your email is not verified yet. Please check your inbox or verify below.');
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
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

            {/* Right Section - Sign In Form */}
            <div className="p-6 lg:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex flex-col gap-2">
                  <span>{error}</span>
                  {needsVerification && (
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      className="text-primary hover:underline font-semibold text-left mt-1"
                    >
                      Click here to resend verification email
                    </button>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email/Username Input */}
                <div>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Username or Email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleShowPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Remember me</span>
                  </label>
                  <Link
                    to="/recover-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'SIGN IN'}
                </button>

                {/* Sign Up Link */}
                <div className="text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary hover:underline font-medium">
                    Sign up here
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

