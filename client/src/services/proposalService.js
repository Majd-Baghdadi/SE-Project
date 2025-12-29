// Service for handling document proposal API calls
import api from './api';
import authService from './authService'; // Import authService

class ProposalService {
  // Check if user is authenticated using authService
  isAuthenticated() {
    return authService.isAuthenticated();
  }

  // Propose a new document
  async proposeDocument(documentData) {
    try {
      console.log('📤 Proposing document:', documentData);
      const response = await api.post('/propose/document', documentData);
      console.log('📥 Propose response:', response);
      return {
        success: true,
        data: response.document || response
      };
    } catch (error) {
      console.error('❌ Error proposing document:', error);
      return {
        success: false,
        error: error.message || 'Failed to propose document'
      };
    }
  }

  // Propose a fix for a document
  async proposeFix(docId, fixData) {
    try {
      console.log('📤 Proposing fix:', { docId, fixData });
      const response = await api.post(`/propose/fix/${docId}`, fixData);
      console.log('📥 Fix response:', response);
      return {
        success: true,
        data: response.fix || response
      };
    } catch (error) {
      console.error('❌ Error proposing fix:', error);
      return {
        success: false,
        error: error.message || 'Failed to propose fix'
      };
    }
  }

  // Edit a proposed document
  async editProposedDocument(id, documentData) {
    try {
      const response = await api.patch(`/propose/document/${id}`, documentData);
      return {
        success: true,
        data: response.document || response
      };
    } catch (error) {
      console.error('Error editing proposed document:', error);
      return {
        success: false,
        error: error.message || 'Failed to edit proposed document'
      };
    }
  }

  // Edit a proposed fix
  async editProposedFix(id, fixData) {
    try {
      const response = await api.patch(`/propose/fix/${id}`, fixData);
      return {
        success: true,
        data: response.fix || response
      };
    } catch (error) {
      console.error('Error editing proposed fix:', error);
      return {
        success: false,
        error: error.message || 'Failed to edit proposed fix'
      };
    }
  }

  // Get all proposed documents by current user
  async getProposedDocumentsByUser() {
    try {
      const response = await api.get('/propose/document');
      return {
        success: true,
        data: response.documents || response
      };
    } catch (error) {
      console.error('Error fetching proposed documents:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch proposed documents'
      };
    }
  }

  // Get all proposed fixes by current user
  async getProposedFixesByUser() {
    try {
      const response = await api.get('/propose/fix');
      return {
        success: true,
        data: response.fixes || response
      };
    } catch (error) {
      console.error('Error fetching proposed fixes:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch proposed fixes'
      };
    }
  }
  // Delete a proposed document
  async deleteProposedDocument(id) {
    try {
      const response = await api.delete(`/propose/document/${id}`);
      return {
        success: true,
        data: response.document || response
      };
    } catch (error) {
      console.error('Error deleting proposed document:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete proposed document'
      };
    }
  }

  // Delete a proposed fix
  async deleteProposedFix(id) {
    try {
      const response = await api.delete(`/propose/fix/${id}`);
      return {
        success: true,
        data: response.fix || response
      };
    } catch (error) {
      console.error('Error deleting proposed fix:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete proposed fix'
      };
    }
  }

  // Fetch proposed document details
  async getProposedDocumentDetails(id) {
    try {
      const response = await api.get(`/propose/proposedDocument/${id}`);
      return {
        success: true,
        data: response.document || response
      };
    } catch (error) {
      console.error('Error fetching proposed document details:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch proposed document details'
      };
    }
  }

  // Fetch proposed fix details
  async getProposedFixDetails(id) {
    try {
      const response = await api.get(`/propose/proposedFix/${id}`);
      return {
        success: true,
        data: response.fix || response
      };
    } catch (error) {
      console.error('Error fetching proposed fix details:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch proposed fix details'
      };
    }
  }
}


export default new ProposalService();