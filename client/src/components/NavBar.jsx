import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import authService from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { user, isAuthenticated, isAdmin, checkAuth } = useAuth()

  useEffect(() => {
    const handleAuthChange = () => {
      checkAuth();
    };
    window.addEventListener('authStateChanged', handleAuthChange);
    return () => window.removeEventListener('authStateChanged', handleAuthChange);
  }, [checkAuth]);

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
            DZ
          </div>
          <span className="text-xl font-bold text-gray-900">DZ Procedures</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-gray-700 hover:text-primary no-underline font-medium transition-colors">
            Home
          </Link>
          <Link to="/documents" className="text-gray-700 hover:text-primary no-underline font-medium transition-colors">
            Procedures
          </Link>
          {isAdmin && (<>
            <Link to="/admin/proposals" className="text-gray-700 hover:text-primary no-underline font-medium transition-colors">
              Proposed Docs
            </Link>
            <Link to="/admin/fixes" className="text-gray-700 hover:text-primary no-underline font-medium transition-colors">
              Proposed Fixes
            </Link>
          </>)}
          {isAuthenticated && (
            <Link to="/propose" className="text-gray-700 hover:text-primary no-underline font-medium transition-colors">
              Propose Document
            </Link>
          )}
          <Link to="/about" className="text-gray-700 hover:text-primary no-underline font-medium transition-colors">
            About Us
          </Link>
          <Link to="/conntact" className="text-gray-700 hover:text-primary no-underline font-medium transition-colors">
            Contact Us
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors no-underline"
            >
              Admin
            </Link>
          )}
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-lg hover:bg-gray-300 transition-colors no-underline cursor-pointer"
            >
              👤
            </Link>
          ) : (
            <Link
              to="/signin"
              className="px-5 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors no-underline"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
