/**
 * API Configuration with Axios
 * 
 * Purpose: Centralized API configuration with interceptors for auth and error handling
 * Future-ready: Set up for JWT authentication and automatic token management
 */

import axios from 'axios';
export const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Create Axios instance with base configuration
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Automatically adds JWT token to all requests (when user is logged in)
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (will be set after login)
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles errors globally (401 unauthorized, 500 server error, etc.)
 */
api.interceptors.response.use(
  (response) => {
    // Return only the data portion of the response
    return response.data;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.error('Unauthorized access - redirecting to login');
          localStorage.removeItem('authToken');
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userName');
          // Redirect to sign in page
          if (window.location.pathname !== '/signin' && window.location.pathname !== '/signup') {
            window.location.href = '/signin';
          }
          break;
          
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden');
          break;
          
        case 404:
          // Not found
          console.error('Resource not found');
          break;
          
        case 500:
          // Server error
          console.error('Server error - please try again later');
          break;
          
        default:
          console.error(`Error ${status}:`, error.response.data);
      }
      
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response received (network error)
      console.error('Network error - please check your connection');
      return Promise.reject({ message: 'Network error - please check your connection' });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export default api;
