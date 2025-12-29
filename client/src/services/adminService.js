/**
 * Admin Service
 * 
 * Purpose: Handle all admin-related operations
 * 
 * Endpoints:
 * 
 * PROPOSALS:
 * - getAllProposals() -> GET /admin/proposals
 * - validateProposal(proposedDocId) -> POST /admin/proposals/:id/approve
 * - discardProposal(proposedDocId) -> POST /admin/proposals/:id/reject
 * - editProposal(proposedDocId, data) -> PUT /admin/proposals/:id
 * 
 * FIXES:
 * - getAllFixes() -> GET /admin/fixes
 * - validateFix(fixId) -> POST /admin/fixes/:id/approve
 * - discardFix(fixId) -> POST /admin/fixes/:id/reject
 * 
 * DOCUMENTS:
 * - editDocument(docId, data) -> PUT /admin/documents/:id
 * - deleteDocument(docId) -> DELETE /admin/documents/:id
 * 
 * DASHBOARD:
 * - getDashboardStats() -> GET /admin/dashboard
 * 
 * Response Shapes:
 * - Proposal: Full ProposedDocument structure + userId
 * - Fix: Full Fix structure
 * - Stats: { totalDocs, pendingProposals, pendingFixes, totalUsers }
 * 
 * Note: All endpoints require admin role
 */

import api from './api';

const adminService = {
  // Proposals
  getAllProposals: async () => {
    try {
      const response = await api.get('/admin/proposedDocuments');
      return response.documents || response.data || response;
    } catch (error) {
      console.error('Error fetching proposals:', error);
      throw error;
    }
  },

  validateProposal: async (proposedDocId) => {
    try {
      const response = await api.post(`/admin/validateProposition/${proposedDocId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error approving proposal:', error);
      throw error;
    }
  },

  discardProposal: async (proposedDocId) => {
    try {
      const response = await api.delete(`/propose/document/${proposedDocId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      throw error;
    }
  },

  // Fixes
  getAllFixes: async () => {
    try {
      const response = await api.get('/admin/proposedFixes');
      return response.fixes || response.data || response;
    } catch (error) {
      console.error('Error fetching fixes:', error);
      throw error;
    }
  },

  validateFix: async (fixId, data) => {
    try {
      // Backend uses PATCH /validateFix/:fixId and expects the updated document data
      const response = await api.patch(`/admin/validateFix/${fixId}`, data);
      return response.data || response;
    } catch (error) {
      console.error('Error approving fix:', error);
      throw error;
    }
  },

  discardFix: async (fixId) => {
    try {
      const response = await api.delete(`/propose/fix/${fixId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error rejecting fix:', error);
      throw error;
    }
  },

  // Documents
  editDocument: async (docId, data) => {
    try {
      const response = await api.put(`/admin/documents/${docId}`, data);
      return response.data || response;
    } catch (error) {
      console.error('Error editing document:', error);
      throw error;
    }
  },

  deleteDocument: async (docId) => {
    try {
      const response = await api.delete(`/admin/documents/${docId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  // Dashboard
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
};

export default adminService;
