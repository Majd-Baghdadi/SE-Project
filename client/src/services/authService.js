import api from './api';

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
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
      const response = await api.post('/verifyEmail', { token });
      
      if (response.success && response.user) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('userName', response.user.userName);
        window.dispatchEvent(new Event('authStateChanged'));
      }
      
      return response;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error; 
    }
  },

  logout: async () => {
    localStorage.removeItem('authToken');s
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
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