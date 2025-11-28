/**
 * Document Service (Axios Version)
 * 
 * Purpose: Handle all document-related API calls using Axios
 * Maps to backend endpoints: /api/documents/
 * 
 * Backend Endpoints:
 * - GET /api/documents/ -> getAllDocuments()
 * - GET /api/documents/:id -> getDocumentById(docId)
 * 
 * Response Shapes (from backend):
 * - GET /api/documents/: { documents: [{ docid, docname, docpicture }] }
 * - GET /api/documents/:id: { data: {...}, relatedDocuments: [...] }
 */

import api from './api';

/**
 * Fetch all documents from backend
 * Backend: GET /api/documents/
 * @returns {Promise<Array>} Array of documents
 */
async function getAllDocuments() {
  try {
    const response = await api.get('/documents/');
    return response.documents || []; // Backend returns { documents: [...] }
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
}

/**
 * Fetch detailed information for a specific document
 * Backend: GET /api/documents/:id
 * @param {string} docId - The document ID (UUID)
 * @returns {Promise<object>} Object with { data, relatedDocuments }
 */
async function getDocumentById(docId) {
  try {
    const response = await api.get(`/documents/${docId}`);
    return response; // Returns: { data: {...}, relatedDocuments: [...] }
  } catch (error) {
    console.error(`Error fetching document ${docId}:`, error);
    throw error;
  }
}

/**
 * Search documents by query (placeholder - implement when backend ready)
 * @param {string} query - Search query string
 * @returns {Promise<Array>} Array of matching documents
 */
async function searchDocuments(query) {
  // TODO: Implement when backend search endpoint is ready
  console.warn('Search not yet implemented on backend');
  
  // Temporary: fetch all and filter client-side
  const documents = await getAllDocuments();
  return documents.filter(doc => 
    doc.docname.toLowerCase().includes(query.toLowerCase())
  );
}

/**
 * Filter documents by criteria (placeholder)
 * @param {object} filters - Filter criteria { type, minPrice, maxPrice, etc }
 * @returns {Promise<Array>} Filtered documents
 */
async function filterDocuments(filters) {
  // TODO: Implement when backend filter endpoint is ready
  console.warn('Filter not yet implemented on backend', filters);
  return await getAllDocuments();
}

// Export as object (your existing pattern)
const documentService = {
  getAllDocuments,
  getDocumentById,
  searchDocuments,
  filterDocuments,
};

export default documentService;

// Also export individual functions (for flexibility)
export { getAllDocuments, getDocumentById, searchDocuments, filterDocuments };
