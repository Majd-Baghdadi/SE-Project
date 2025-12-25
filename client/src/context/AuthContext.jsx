/**
 * Authentication Context
 * 
 * Purpose: Provide global authentication state and methods
 * 
 * State:
 * - user: { id, name, email, role } | null
 * - isAuthenticated: boolean
 * - isAdmin: boolean
 * - loading: boolean
 * 
 * Methods:
 * - login(email, password): Promise<void>
 * - register(name, email, password): Promise<void>
 * - logout(): Promise<void>
 * - checkAuth(): Promise<void> - validate token on mount
 * 
 * Usage:
 * const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
 * 
 * This context wraps the entire app in App.jsx
 */

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');
      const userRole = localStorage.getItem('userRole');

      if (token && userEmail) {
        setUser({
          email: userEmail,
          name: userName || 'User',
          role: userRole || 'user'
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      if (response.success && response.user && response.token) {
        // Store auth data
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('userName', response.user.name || 'User');
        localStorage.setItem('userRole', response.user.role || 'user');
        
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Dispatch event for other components
        window.dispatchEvent(new Event('authStateChanged'));
        
        return { success: true };
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authService.register(name, email, password);
      
      if (response.success) {
        // Auto-login after registration if token is provided
        if (response.token && response.user) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userEmail', response.user.email);
          localStorage.setItem('userName', response.user.name || name);
          localStorage.setItem('userRole', response.user.role || 'user');
          
          setUser(response.user);
          setIsAuthenticated(true);
          window.dispatchEvent(new Event('authStateChanged'));
        }
        return { success: true };
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    
    setUser(null);
    setIsAuthenticated(false);
    
    // Dispatch event for other components
    window.dispatchEvent(new Event('authStateChanged'));
  };

  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    register,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};