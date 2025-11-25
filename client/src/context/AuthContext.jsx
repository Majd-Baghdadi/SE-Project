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
  // Implementation will be added
  return null;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
