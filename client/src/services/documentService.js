/**
 * Document Service
 * 
 * Purpose: Handle all document-related API calls
 * 
 * Endpoints:
 * - getAllDocuments() -> GET /documents
 * - getDocumentById(docId) -> GET /document/:docId
 * - getRelatedDocumentNames(docIds[]) -> POST /documents/related-names
 * - searchDocuments(query) -> GET /documents/search?q=query
 * - filterDocuments(filters) -> GET /documents?type=X&minPrice=Y...
 * 
 * Response Shapes:
 * - Document: { docId, docName, picture, type, steps[], relatedDocs[], price, duration }
 * - DocumentPreview: { docId, docName, picture, type }
 * - RelatedDoc: { docId, docName }
 */

import apiClient from './apiClient';

const documentService = {
  getAllDocuments: async () => {
    // Returns array of DocumentPreview
  },

  getDocumentById: async (docId) => {
    // Returns full Document object
  },

  getRelatedDocumentNames: async (docIds) => {
    // Returns array of RelatedDoc
  },

  searchDocuments: async (query) => {
    // Returns filtered array of DocumentPreview
  },

  filterDocuments: async (filters) => {
    // Returns filtered array of DocumentPreview
  },
};

export default documentService;
