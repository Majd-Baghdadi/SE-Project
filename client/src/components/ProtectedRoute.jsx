import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

/**
 * ProtectedRoute component
 * Protects routes that require authentication or specific roles
 * 
 * @param {React.Component} children - The component to render if authorized
 * @param {string} requiredRole - Optional role required (e.g., 'admin')
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Check if specific role is required
  if (requiredRole) {
    // TODO: Get user role from backend/localStorage
    // For now, hardcode check - replace with actual role check
    const userRole = localStorage.getItem('userRole') || 'user';
    
    if (userRole !== requiredRole) {
      // Redirect to home if user doesn't have required role
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
