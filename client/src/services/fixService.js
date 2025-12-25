/**
 * Fix Service
 * Handle fix/issue reporting
 */

import api from './api';

class FixService {
  async submitFix(docId, formData) {
    try {
      // Map frontend form data to backend database structure
      const payload = {
        docid: parseInt(docId), 
        stepsProblem: !!formData.steps, // Convert to boolean
        stepsDetails: formData.steps || null,
        relatedDocsProblem: !!formData.documents, // Convert to boolean
        relatedDocsDetails: formData.documents || null,
        priceProblem: !!formData.price, // Convert to boolean
        priceDetails: formData.price || null,
        timeProblem: !!formData.processingTime, // Convert to boolean
        timeDetails: formData.processingTime || null
      };
      
      console.log('📤 Submitting fix to:', `/propose/fix/${docId}`);
      console.log('📤 Payload:', JSON.stringify(payload, null, 2));
      
      // POST to /api/propose/fix/:docId
      const response = await api.post(`/propose/fix/${docId}`, payload);
      
      console.log('📥 Success response:', JSON.stringify(response, null, 2));
      
      return {
        success: true,
        data: response.data || response,
        message: 'Fix submitted successfully'
      };
    } catch (error) {
      console.error('❌ Fix submission error:', error);
      
      // Handle different error types
      let errorMessage = 'Failed to submit fix';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response && error.response.data) {
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Get all fixes submitted by the current user
   */
  async getUserFixes() {
    try {
      const response = await api.get('/propose/user/fixes');
      return {
        success: true,
        data: response.data || response
      };
    } catch (error) {
      console.error('❌ Error fetching user fixes:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch fixes'
      };
    }
  }

  /**
   * Get details of a specific fix
   */
  async getFixDetails(fixId) {
    try {
      const response = await api.get(`/propose/fix/${fixId}`);
      return {
        success: true,
        data: response.data || response
      };
    } catch (error) {
      console.error('❌ Error fetching fix details:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch fix details'
      };
    }
  }

  /**
   * Update a fix (only if user owns it or is admin)
   */
  async updateFix(fixId, formData) {
    try {
      const payload = {
        stepsProblem: !!formData.steps,
        stepsDetails: formData.steps || null,
        relatedDocsProblem: !!formData.documents,
        relatedDocsDetails: formData.documents || null,
        priceProblem: !!formData.price,
        priceDetails: formData.price || null,
        timeProblem: !!formData.processingTime,
        timeDetails: formData.processingTime || null
      };
      
      const response = await api.put(`/propose/fix/${fixId}`, payload);
      
      return {
        success: true,
        data: response.data || response,
        message: 'Fix updated successfully'
      };
    } catch (error) {
      console.error('❌ Error updating fix:', error);
      return {
        success: false,
        message: error.message || 'Failed to update fix'
      };
    }
  }

  /**
   * Delete a fix (only if user owns it or is admin)
   */
  async deleteFix(fixId) {
    try {
      const response = await api.delete(`/propose/fix/${fixId}`);
      
      return {
        success: true,
        data: response.data || response,
        message: 'Fix deleted successfully'
      };
    } catch (error) {
      console.error('❌ Error deleting fix:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete fix'
      };
    }
  }
}

export default new FixService();