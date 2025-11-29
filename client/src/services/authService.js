/**
 * Authentication Service
 * 
 * Purpose: Handle user authentication
 * 
 * Endpoints:
 * - login(email, password) -> POST /api/auth/login
 * - register(userName, email, password, role) -> POST /api/auth/register
 * - verifyEmail(token) -> POST /api/auth/verifyEmail
 * 
 * Response Shape (login):
 * {
 *   success: true,
 *   message: "Login successfully"
 * }
 * 
 * Response Shape (register):
 * {
 *   success: true,
 *   message: "Registration successful. Please check your email to verify it."
 * }
 * 
 * Note: Token is stored in HTTP-only cookie by backend
 */

import api from './api';

const authService = {
  /**
   * Login user
   * Backend: POST /api/auth/login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} Response with success and message
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.success) {
        // Store auth state in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        // Dispatch custom event for NavBar to update
        window.dispatchEvent(new Event('authStateChanged'));
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      // Re-throw with proper structure
      throw {
        success: false,
        error: error.error || error.message || 'Login failed. Please try again.'
      };
    }
  },

  /**
   * Register new user
   * Backend: POST /api/auth/register
   * @param {string} userName - User full name
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} role - User role (default: 'user')
   * @returns {Promise<object>} Response with success and message
   */
  register: async (userName, email, password, role = 'user') => {
    try {
      const response = await api.post('/auth/register', { userName, email, password, role });
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      // Re-throw with proper structure
      throw {
        success: false,
        error: error.error || error.message || 'Registration failed. Please try again.'
      };
    }
  },

  /**
   * Verify email with token
   * Backend: POST /api/auth/verifyEmail
   * @param {string} token - Verification token
   * @returns {Promise<object>} Response with success, message, and user data
   */
  verifyEmail: async (token) => {
    try {
      const response = await api.post('/auth/verifyEmail', { token });
      
      if (response.success && response.user) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('userName', response.user.userName);
        // Dispatch custom event for NavBar to update
        window.dispatchEvent(new Event('authStateChanged'));
      }
      
      return response;
    } catch (error) {
      console.error('Email verification error:', error);
      // Re-throw with proper structure
      throw {
        success: false,
        error: error.error || error.message || 'Email verification failed. Please try again.'
      };
    }
  },

  /**
   * Logout user
   * Clears authentication state and cookies
   */
  logout: async () => {
    // Clear localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    
    // Dispatch custom event for NavBar to update
    window.dispatchEvent(new Event('authStateChanged'));
    
    // Optional: Call backend to clear cookie (if you have a logout endpoint)
    // try {
    //   await api.post('/auth/logout');
    // } catch (error) {
    //   console.error('Logout error:', error);
    // }
    
    return { success: true, message: 'Logged out successfully' };
  },

  /**
   * Get current user from localStorage
   * @returns {object|null} User object or null
   */
  getCurrentUser: () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      return {
        email: localStorage.getItem('userEmail'),
        userName: localStorage.getItem('userName'),
      };
    }
    return null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },
};

export default authService;