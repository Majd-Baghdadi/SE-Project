import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

export default function SignInModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Mock data for testing
      const mockUsers = {
        'test@example.com': { password: 'password123', name: 'Test User' },
        'user@test.com': { password: 'test123', name: 'Demo User' },
        'admin@test.com': { password: 'admin123', name: 'Admin User' }
      };

      // Check mock data first (for testing without backend)
      if (mockUsers[formData.email] && mockUsers[formData.email].password === formData.password) {
        // Simulate successful login
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userName', mockUsers[formData.email].name);
        window.dispatchEvent(new Event('authStateChanged'));
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
        // Close modal
        onClose();
        // Reset form
        setFormData({ email: '', password: '' });
        setLoading(false);
        return;
      }

      // Try real API call
      const response = await authService.login(formData.email, formData.password);
      
      if (response.success) {
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
        // Close modal
        onClose();
        // Reset form
        setFormData({ email: '', password: '' });
      } else {
        setError(response.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      // If API fails, check mock data as fallback
      const mockUsers = {
        'test@example.com': { password: 'password123', name: 'Test User' },
        'user@test.com': { password: 'test123', name: 'Demo User' },
        'admin@test.com': { password: 'admin123', name: 'Admin User' }
      };
      
      if (mockUsers[formData.email] && mockUsers[formData.email].password === formData.password) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userName', mockUsers[formData.email].name);
        window.dispatchEvent(new Event('authStateChanged'));
        
        if (onSuccess) {
          onSuccess();
        }
        onClose();
        setFormData({ email: '', password: '' });
      } else {
        setError(err.error || err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
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
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
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
                onClick={onClose}
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
              <Link
                to="/signup"
                onClick={onClose}
                className="text-primary hover:underline font-medium"
              >
                Sign up here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

