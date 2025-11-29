import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import authService from '../services/authService';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        navigate('/');
        setLoading(false);
        return;
      }

      // Try real API call
      const response = await authService.login(formData.email, formData.password);
      
      if (response.success) {
        // Navigate to home or previous page
        navigate('/');
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
        navigate('/');
      } else {
        setError(err.error || err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
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

            {/* Right Section - Sign In Form */}
            <div className="p-6 lg:p-10">
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

