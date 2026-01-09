import axios from 'axios';
export const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const extractErrorMessageFromHtml = (htmlString) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const preElement = doc.querySelector('pre');
    if (preElement) {
      return preElement.textContent.trim();
    }
    const titleElement = doc.querySelector('title');
    if (titleElement) {
      return titleElement.textContent.trim();
    }
  } catch (parseError) {
    console.warn('Failed to parse HTML error response:', parseError);
  }
  return 'An unexpected error occurred.';
};
// Request interceptor: Remove Content-Type header for FormData uploads
// to allow browser to set correct multipart/form-data boundary automatically
api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor removed as we use HttpOnly cookies for authentication.

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      let errorMessage = error.response.data;

      if (typeof error.response.data === 'string' && error.response.data.startsWith('<!DOCTYPE html>')) {
        errorMessage = extractErrorMessageFromHtml(error.response.data);
      } else if (typeof error.response.data === 'object' && error.response.data !== null) {
        errorMessage = error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
      }

      switch (status) {
        case 401:
          console.error('Unauthorized access');
          // Auth is handled via HttpOnly cookies - no localStorage to clean
          // AuthContext will automatically redirect on 401
          break;

        case 403:
          console.error('Access forbidden');
          break;

        case 404:
          console.error('Resource not found');
          break;

        case 500:
          console.error('Server error - please try again later');
          break;

        default:
          console.error(`Error ${status}:`, errorMessage);
      }

      return Promise.reject({ message: errorMessage, status: status });
    } else if (error.request) {
      console.error('Network error - please check your connection');
      return Promise.reject({ message: 'Network error - please check your connection' });
    } else {
      console.error('Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export default api;