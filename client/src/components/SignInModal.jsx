import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Mail, Lock, Eye, EyeOff, Sparkles, LogIn } from 'lucide-react';
import authService from '../services/authService';

export default function SignInModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userName', mockUsers[formData.email].name);
        window.dispatchEvent(new Event('authStateChanged'));
        
        if (onSuccess) {
          onSuccess();
        }
        onClose();
        setFormData({ email: '', password: '' });
        setLoading(false);
        return;
      }

      // Try real API call
      const response = await authService.login(formData.email, formData.password);
      
      if (response.success) {
        if (onSuccess) {
          onSuccess();
        }
        onClose();
        setFormData({ email: '', password: '' });
      } else {
        setError(response.error || 'Login failed. Please try again.');
      }
    } catch (err) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 pt-28"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-md w-full relative border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/30 mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-white/60 mt-2">Sign in to continue to your account</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-white/40" />
              </div>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-white/40" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                className="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all ${rememberMe ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 group-hover:border-white/50'}`}>
                    {rememberMe && (
                      <svg className="w-full h-full text-white p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-2 text-sm text-white/60 group-hover:text-white/80 transition-colors">Remember me</span>
              </label>
              <Link
                to="/recover-password"
                onClick={onClose}
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors no-underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-white/60 pt-4 border-t border-white/10">
              Don't have an account?{' '}
              <Link
                to="/signup"
                onClick={onClose}
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors no-underline"
              >
                Create one now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

