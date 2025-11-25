/**
 * Fix Service
 * 
 * Purpose: Handle fix/issue reporting
 * 
 * Endpoints:
 * - submitFix(docId, problemType, details) -> POST /fix
 * 
 * Request Shape:
 * {
 *   docId: string,
 *   problemType: 'steps' | 'document' | 'other',
 *   details: string
 * }
 * 
 * Response Shape:
 * { fixId, success: boolean }
 * 
 * Note: userId is extracted from auth token automatically
 */

import apiClient from './apiClient';

const fixService = {
  submitFix: async (docId, problemType, details) => {
    // Returns { fixId, success }
  },
};

export default fixService;
