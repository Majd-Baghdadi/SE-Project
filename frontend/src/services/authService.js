/**
 * Authentication Service
 * 
 * Purpose: Handle user authentication
 * 
 * Endpoints:
 * - login(email, password) -> POST /auth/login
 * - register(name, email, password) -> POST /auth/register
 * - logout() -> POST /auth/logout
 * - validateToken() -> GET /auth/validate
 * 
 * Response Shape (login/register):
 * {
 *   token: string,
 *   user: { id, name, email, role }
 * }
 * 
 * Note: Token is stored in localStorage and added to all subsequent requests
 */

import apiClient from './apiClient';

const authService = {
  login: async (email, password) => {
    // Returns { token, user }
  },

  register: async (name, email, password) => {
    // Returns { token, user }
  },

  logout: async () => {
    // Clears token and returns success
  },

  validateToken: async () => {
    // Validates current token, returns user info
  },

  getCurrentUser: () => {
    // Returns user from localStorage if exists
  },

  getToken: () => {
    // Returns stored token
  },

  setToken: (token) => {
    // Stores token in localStorage
  },

  removeToken: () => {
    // Removes token from localStorage
  },
};

export default authService;
