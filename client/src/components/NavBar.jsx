import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import authService from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { user, isAuthenticated, isAdmin, checkAuth } = useAuth()
  const location = useLocation()
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

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
    // ...(isAdmin ? [
    //   { title: 'Proposed Docs', path: '/admin/proposals' },
    //   { title: 'Proposed Fixes', path: '/admin/fixes' }
    // ] : []),
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



  const isHome = location.pathname === '/';
  const isTransparent = isHome && !isScrolled;

  return (
    <nav className={`border-b z-50 font-sans transition-all duration-300 ${isHome ? 'fixed top-0 w-full' : 'sticky top-0'} ${isTransparent ? 'bg-transparent border-transparent' : 'bg-white border-gray-200 shadow-sm'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline group z-50 relative">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold transform group-hover:rotate-12 transition-transform duration-300 shadow-green-200 shadow-lg">
            DZ
          </div>
          <div className="flex flex-col">
            <span className={`text-xl font-bold leading-none tracking-tight transition-colors ${isTransparent ? 'text-white' : 'text-gray-900'}`}>DZ Procedures</span>
            <span className="text-[10px] text-green-600 font-bold tracking-widest uppercase mt-0.5">Official Portal</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 h-full relative" ref={navRef}>
          {/* Sliding Indicator */}
          <div
            className="absolute bottom-0 h-1 bg-green-600 rounded-t-full transition-all duration-500 ease-out shadow-[0_-2px_6px_rgba(22,163,74,0.4)]"
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
              className={`relative h-full flex items-center px-5 no-underline font-medium transition-colors duration-300 text-[15px] ${isActive(link.path)
                ? 'text-green-600 nav-link-active font-bold'
                : (isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-green-600')
                }`}
            >
              {link.title}
            </Link>
          ))}
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {isAdmin && (
            <Link
              to="/admin"
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-200 transition-all hover:-translate-y-0.5 shadow-sm no-underline text-sm"
            >
              Dashboard
            </Link>
          )}
          {isAuthenticated ? (
            <Link
              to="/profile"
              className={`w-11 h-11 rounded-full flex items-center justify-center text-lg transition-all transform hover:scale-105 no-underline cursor-pointer border-2 ${isActive('/profile')
                ? 'border-green-600 bg-green-50 text-green-700 shadow-md ring-2 ring-green-100'
                : (isTransparent ? 'border-white/30 text-white bg-white/10 hover:bg-white/20' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-green-300')
                }`}
              title="My View"
            >
              👤
            </Link>
          ) : (
            <Link
              to="/signin"
              className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-green-200 no-underline text-sm"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`lg:hidden p-2 rounded-xl transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
          }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Links */}
          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3.5 rounded-xl font-medium transition-all duration-200 no-underline flex items-center justify-between ${active
                    ? 'bg-green-50 text-green-700 border-l-[6px] border-green-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:pl-6'
                    }`}
                >
                  {link.title}
                  {active && <span className="w-2 h-2 rounded-full bg-green-600" />}
                </Link>
              );
            })}
          </div>

          {/* Sidebar Footer (Actions) */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="block w-full text-center px-4 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-md hover:bg-purple-700 transition-colors no-underline"
              >
                Admin Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <Link
                to="/profile"
                className={`flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl font-bold border-2 transition-colors no-underline ${isActive('/profile') ? 'bg-white border-green-600 text-green-700' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
              >
                <span>My Profile</span>
                <span>👤</span>
              </Link>
            ) : (
              <Link
                to="/signin"
                className="block w-full text-center px-4 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-colors no-underline"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
