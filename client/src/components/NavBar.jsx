import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import authService from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { user, isAuthenticated, isAdmin, checkAuth } = useAuth()
  const location = useLocation()
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const navRef = useRef(null)

  useEffect(() => {
    const handleAuthChange = () => {
      checkAuth();
    };
    window.addEventListener('authStateChanged', handleAuthChange);
    return () => window.removeEventListener('authStateChanged', handleAuthChange);
  }, [checkAuth]);

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Procedures', path: '/documents' },
    ...(isAdmin ? [
      { title: 'Proposed Docs', path: '/admin/proposals' },
      { title: 'Proposed Fixes', path: '/admin/fixes' }
    ] : []),
    ...(isAuthenticated ? [{ title: isAdmin ? 'Add Document' : 'Propose Document', path: '/propose' }] : []),
    { title: 'About Us', path: '/about' },
    { title: 'Contact Us', path: '/conntact' },
  ];

  // Update sliding indicator position
  useEffect(() => {
    const activeLink = navRef.current?.querySelector('.nav-link-active');
    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink;
      setIndicatorStyle({
        left: offsetLeft,
        width: offsetWidth,
        opacity: 1
      });
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [location.pathname, isAdmin, isAuthenticated]);

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-0 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline group">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold transform group-hover:rotate-12 transition-transform duration-300 shadow-md">
            DZ
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900 leading-none">DZ Procedures</span>
            <span className="text-[10px] text-green-600 font-semibold tracking-widest uppercase mt-0.5">Official Portal</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-2 h-full relative" ref={navRef}>
          {/* Sliding Indicator Bar */}
          <div
            className="absolute bottom-0 h-1 bg-green-600 rounded-t-full transition-all duration-500 ease-in-out"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity
            }}
          />

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative h-full flex items-center px-4 no-underline font-medium transition-all duration-300 group ${isActive(link.path) ? 'text-green-600 nav-link-active' : 'text-gray-600 hover:text-green-600'
                }`}
            >
              <span>{link.title}</span>
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all hover:scale-105 shadow-sm no-underline"
            >
              Admin Dashboard
            </Link>
          )}
          {isAuthenticated ? (
            <Link
              to="/profile"
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all transform hover:scale-110 no-underline cursor-pointer border-2 ${isActive('/profile') ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}
            >
              👤
            </Link>
          ) : (
            <Link
              to="/signin"
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-md hover:shadow-lg no-underline"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
