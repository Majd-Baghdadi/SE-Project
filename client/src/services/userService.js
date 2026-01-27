/**
 * User/Profile Service
 * 
 * Purpose: Handle user profile operations
 * 
 * Endpoints:
 * - getUserProfile() -> GET /profile
 * 
 * Response Shape:
 * {
 *   name: string,
 *   email: string,
 *   role: 'user' | 'admin',
 *   contributions: {
 *     proposals: [{ proposedDocId, docName }],
 *     fixes: [{ fixId, docId, problemType }]
 *   }
 * }
 * 
 * Note: User is identified by auth token
 */

import api from './api';

const userService = {
  getUserProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/user/profile', profileData);
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};

export default userService;
