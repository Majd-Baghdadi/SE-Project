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

import apiClient from './apiClient';

const userService = {
  getUserProfile: async () => {
    // Returns user profile with contributions
  },
};

export default userService;
