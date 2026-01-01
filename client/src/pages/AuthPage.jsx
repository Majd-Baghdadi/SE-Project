import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Home, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

// Pattern background style (defined separately to avoid JSX parsing issues)
const patternStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
};

export default function AuthPage() {
  const location = useLocation();
  const initialMode = location.pathname === '/signup' ? 'signup' : 'signin';
  const [isFlipped, setIsFlipped] = useState(initialMode === 'signup');
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipped(!isFlipped);
      setTimeout(() => setIsFlipping(false), 400);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Home button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-50 group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white/80 hover:text-white transition-all duration-300 border border-white/20"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <Home className="w-4 h-4" />
        <span className="text-sm font-medium">Home</span>
      </Link>

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large gradient orbs */}
        <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-white/10 rounded-2xl rotate-12 animate-float"></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 border border-emerald-500/20 rounded-full animate-float delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-lg rotate-45 animate-float delay-500"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Card Container */}
      <div className="relative w-full max-w-4xl h-[620px] z-10">
        {/* Sign In Card */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            isFlipped 
              ? 'opacity-0 pointer-events-none scale-95 rotate-y-12' 
              : 'opacity-100 pointer-events-auto scale-100 rotate-y-0'
          }`}
          style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        >
          <SignInCard onFlip={handleFlip} isFlipping={isFlipping} />
        </div>

        {/* Sign Up Card */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            isFlipped 
              ? 'opacity-100 pointer-events-auto scale-100 rotate-y-0' 
              : 'opacity-0 pointer-events-none scale-95 -rotate-y-12'
          }`}
          style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        >
          <SignUpCard onFlip={handleFlip} isFlipping={isFlipping} />
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SignInCard({ onFlip, isFlipping }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setNeedsVerification(false);
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const response = await authService.resendVerificationEmail(formData.email);
      if (response.success) {
        Swal.fire({
          title: 'Email Sent!',
          text: 'A new verification link has been sent to your email.',
          icon: 'success',
          confirmButtonColor: '#10b981',
        });
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
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        Toast.fire({ icon: 'success', title: 'Signed in successfully' });

        const userRole = localStorage.getItem('userRole');
        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        if (response.status === 403 || response.error?.includes('verified')) {
          setNeedsVerification(true);
          setError('Your email is not verified yet. Please check your inbox.');
        } else {
          setError(response.error || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      if (err.status === 403) {
        setNeedsVerification(true);
        setError('Your email is not verified yet. Please check your inbox.');
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex flex-col justify-center items-center p-10 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={patternStyle}></div>
          
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Welcome Back!</h1>
            <p className="text-white/80 text-lg mb-8 max-w-xs">
              Sign in to continue your journey with us
            </p>
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
              <span>Don't have an account?</span>
            </div>
            <button
              onClick={onFlip}
              disabled={isFlipping}
              className="mt-4 group inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-105 disabled:opacity-50"
            >
              Create Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex flex-col justify-center p-8 lg:p-12">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back!</h1>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
          <p className="text-white/60 mb-8">Enter your credentials to continue</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm backdrop-blur-sm">
              <span>{error}</span>
              {needsVerification && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  className="block mt-2 text-primary hover:text-primary-dark font-semibold transition-colors"
                >
                  Resend verification email
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                required
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:bg-white/15"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:bg-white/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/30 bg-white/10 text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                to="/recover-password"
                className="text-sm text-primary hover:text-primary-dark transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Mobile flip button */}
            <div className="lg:hidden text-center pt-4">
              <p className="text-white/60 text-sm mb-2">Don't have an account?</p>
              <button
                type="button"
                onClick={onFlip}
                disabled={isFlipping}
                className="text-primary hover:text-primary-dark font-semibold transition-colors"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function SignUpCard({ onFlip, isFlipping }) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validatePassword = (password) => {
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one digit';
    if (!/[a-zA-Z]/.test(password)) return 'Password must contain at least one letter';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character';
    return null;
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await register(formData.fullName, formData.email, formData.password);

      if (response.success) {
        Swal.fire({
          title: 'Registration Successful!',
          text: response.message || 'Please check your email to verify your account.',
          icon: 'success',
          confirmButtonColor: '#10b981',
        }).then(() => {
          onFlip(); // Flip back to sign in
        });

        setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(typeof err.message === 'string' ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
        {/* Left Panel - Form */}
        <div className="flex flex-col justify-center p-8 lg:p-12 order-2 lg:order-1">
          <div className="lg:hidden text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Join Us Today!</h1>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-white/60 mb-6">Start your journey with us</p>

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full name"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:bg-white/15"
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:bg-white/15"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-primary transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                className="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:bg-white/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-white/40 -mt-2 ml-1">
              Min 6 chars, 1 digit, 1 letter, 1 special character
            </p>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-primary transition-colors" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                required
                className="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:bg-white/15"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Mobile flip button */}
            <div className="lg:hidden text-center pt-2">
              <p className="text-white/60 text-sm mb-2">Already have an account?</p>
              <button
                type="button"
                onClick={onFlip}
                disabled={isFlipping}
                className="text-primary hover:text-primary-dark font-semibold transition-colors"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel - Branding */}
        <div className="hidden lg:flex flex-col justify-center items-center p-10 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden order-1 lg:order-2">
          <div className="absolute inset-0 opacity-30" style={patternStyle}></div>
          
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Join Us Today!</h1>
            <p className="text-white/80 text-lg mb-8 max-w-xs">
              Create an account and start your journey with our community
            </p>
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
              <span>Already have an account?</span>
            </div>
            <button
              onClick={onFlip}
              disabled={isFlipping}
              className="mt-4 group inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-105 disabled:opacity-50"
            >
              Sign In
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
