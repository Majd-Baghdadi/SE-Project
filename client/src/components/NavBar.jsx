import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import authService from '../services/authService'

export default function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated())
    }
    
    checkAuth()
    
    // Listen for custom auth state change event
    window.addEventListener('authStateChanged', checkAuth)
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth)
    
    return () => {
      window.removeEventListener('authStateChanged', checkAuth)
      window.removeEventListener('storage', checkAuth)
    }
  }, [])

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
          <Link to="/categories" className="text-gray-700 hover:text-primary no-underline font-medium transition-colors">
            Categories
          </Link>
          <Link to="/community" className="text-gray-700 hover:text-primary no-underline font-medium transition-colors">
            Community
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-primary no-underline font-medium transition-colors">
            About Us
          </Link>
          <Link to="/conntact" className="text-gray-700 hover:text-primary no-underline font-medium transition-colors">
            Contact Us
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {localStorage.getItem('userRole') === 'admin' && (
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
              Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
