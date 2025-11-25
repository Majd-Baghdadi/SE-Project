/**
 * Proposal Service
 * 
 * Purpose: Handle user proposal submissions
 * 
 * Endpoints:
 * - submitProposal(proposalData) -> POST /propose
 * 
 * Request Shape:
 * {
 *   docName: string,
 *   picture: URL,
 *   type: string,
 *   steps: string[],
 *   relatedDocs: docId[],
 *   price: number,
 *   duration: number
 * }
 * 
 * Response Shape:
 * { proposedDocId, success: boolean }
 * 
 * Note: userId is extracted from auth token automatically
 */

import apiClient from './apiClient';

const proposalService = {
  submitProposal: async (proposalData) => {
    // Returns { proposedDocId, success }
  },
};

export default proposalService;
