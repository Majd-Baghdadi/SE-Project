/**
 * Constants
 * 
 * Purpose: Application-wide constants
 */

// Document types/categories
export const DOCUMENT_TYPES = [
  'Civil Status',
  'Legal',
  'Transport',
  'Education',
  'Health',
  'Housing',
  'Employment',
  'Business',
  'Other',
];

// Problem types for fix reporting
export const PROBLEM_TYPES = [
  { value: 'steps', label: 'Incorrect Steps' },
  { value: 'document', label: 'Document Information' },
  { value: 'other', label: 'Other Issue' },
];

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// API routes (for reference)
export const API_ROUTES = {
  DOCUMENTS: '/documents',
  DOCUMENT_BY_ID: '/document/:id',
  RELATED_DOCS: '/documents/related-names',
  SEARCH: '/documents/search',
  PROPOSE: '/propose',
  FIX: '/fix',
  PROFILE: '/profile',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ADMIN_PROPOSALS: '/admin/proposals',
  ADMIN_FIXES: '/admin/fixes',
  ADMIN_DOCUMENTS: '/admin/documents',
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
};
