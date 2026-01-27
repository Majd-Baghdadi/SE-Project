import api from './api';

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.success) {
        // Auth token is stored in HttpOnly cookie by the backend
        // No need to store anything in localStorage
        window.dispatchEvent(new Event('authStateChanged'));
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userName, email, password, role = 'user') => {
    try {
      console.log('📤 Sending registration request:', { userName, email, role });

      const response = await api.post('/auth/register', {
        userName: userName,
        email,
        password,
        role
      });

      console.log('📥 Registration response:', response);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await api.post('/auth/verifyEmail', { token });
      console.log('response');
      if (response.success && response.user) {
        console.log('hello')
        // Auth token is stored in HttpOnly cookie by the backend
        window.dispatchEvent(new Event('authStateChanged'));
      }

      return response;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  },

  resendVerificationEmail: async (email) => {
    try {
      const response = await api.post('/auth/resendVerificationEmail', { email });
      return response;
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  },

  sendResetEmail: async (email) => {
    try {
      const response = await api.post('/auth/sendResetEmail', { email });
      return response;
    } catch (error) {
      console.error('Send reset email error:', error);
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/resetPassword', { token, newPassword });
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    }
    // Cookie is cleared by the backend
    window.dispatchEvent(new Event('authStateChanged'));

    return { success: true, message: 'Logged out successfully' };
  },

  fetchCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      if (response && response.user) {
        // User data stored in React Context (memory), not localStorage
        return response.user;
      }
      return null;
    } catch (error) {
      // If 401, authentication failed - cookie is invalid/expired
      if (error.response && error.response.status === 401) {
        // No need to clear anything - cookie is already invalid
      }
      throw error;
    }
  },

  // Removed: getCurrentUser, isAuthenticated, getUserRole
  // These relied on localStorage which is insecure
  // Use AuthContext (React state) or call fetchCurrentUser() instead
};

export default authService;