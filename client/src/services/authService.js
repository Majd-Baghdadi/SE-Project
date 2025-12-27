import api from './api';

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        if (response.user && response.user.role) localStorage.setItem('userRole', response.user.role || 'user');
        if (response.user && response.user.name) localStorage.setItem('userName', response.user.name);
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

      if (response.success && response.user) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', response.user.userName || response.user.name);
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('userRole', response.user.role);
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
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.dispatchEvent(new Event('authStateChanged'));

    return { success: true, message: 'Logged out successfully' };
  },

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

  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },
};

export default authService;