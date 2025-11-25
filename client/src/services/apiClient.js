/**
 * API Client
 * 
 * Purpose: Centralized HTTP client with interceptors
 * 
 * Features:
 * - Base URL configuration
 * - Request interceptor: Add auth token to headers
 * - Response interceptor: Handle errors globally
 * - Error handling: Network errors, 401 (redirect to login), 403 (unauthorized), etc.
 * 
 * Usage:
 * import apiClient from './apiClient';
 * const response = await apiClient.get('/documents');
 * const data = await apiClient.post('/propose', proposalData);
 */

import axios from 'axios';
import authService from './authService';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - redirect to login
        authService.removeToken();
        window.location.href = '/';
      } else if (status === 403) {
        // Forbidden - insufficient permissions
        console.error('Access denied');
      }
      
      return Promise.reject(data);
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({ message: 'Network error. Please try again.' });
    } else {
      // Something else happened
      return Promise.reject({ message: error.message });
    }
  }
);

export default apiClient;
