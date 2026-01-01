import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Menu, X, Sparkles } from 'lucide-react'
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

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

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
    { title: 'Contact Us', path: '/contact' },
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
    <nav className={`z-[100] font-sans transition-all duration-300 fixed top-0 w-full ${isTransparent 
      ? 'bg-transparent border-transparent' 
      : 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/10'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline group z-[100] relative">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white font-bold transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-emerald-500/30">
            DZ
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold leading-none tracking-tight text-white">DZ Procedures</span>
            <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase mt-0.5">Official Portal</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 h-full relative" ref={navRef}>
          {/* Sliding Indicator */}
          <div
            className="absolute bottom-0 h-1 bg-gradient-to-r from-primary to-primary-dark rounded-t-full transition-all duration-500 ease-out shadow-[0_-2px_10px_rgba(16,185,129,0.5)]"
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
                ? 'text-emerald-400 nav-link-active font-bold'
                : 'text-white/70 hover:text-white'
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
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:-translate-y-0.5 no-underline text-sm border border-white/10"
            >
              Dashboard
            </Link>
          )}
          {isAuthenticated ? (
            <Link
              to="/profile"
              className={`w-11 h-11 rounded-full flex items-center justify-center text-lg transition-all transform hover:scale-105 no-underline cursor-pointer border-2 ${isActive('/profile')
                ? 'border-emerald-500 bg-emerald-500/20 text-white shadow-md ring-2 ring-emerald-500/30'
                : 'border-white/20 text-white bg-white/10 hover:bg-white/20 hover:border-white/30'
                }`}
              title="My View"
            >
              👤
            </Link>
          ) : (
            <Link
              to="/signin"
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 no-underline text-sm border border-white/10"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMobileMenuOpen(prev => !prev);
          }}
          className="lg:hidden p-2 rounded-xl transition-colors text-white hover:bg-white/10"
          aria-label="Toggle menu"
        >
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {/* Mobile Menu Overlay - Rendered via Portal to document.body */}
      {isMobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[99999] lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/90"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-dvh w-[75%] max-w-[320px] bg-slate-900 shadow-2xl flex flex-col border-l border-white/10 animate-slide-in-right overflow-hidden">
            {/* Sidebar Header */}
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-slate-900 shrink-0">
              <span className="text-lg font-bold text-white">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-white/60 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Sidebar Links */}
            <div className="flex-1 p-4 space-y-1 bg-slate-900 overflow-y-auto">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl font-medium transition-all duration-200 no-underline ${active
                      ? 'bg-emerald-500/20 text-emerald-400 border-l-4 border-emerald-500 flex items-center justify-between'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    {link.title}
                    {active && <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block ml-auto" />}
                  </Link>
                );
              })}
            </div>

            {/* Sidebar Footer (Actions) */}
            <div className="p-4 border-t border-white/10 bg-slate-800/50 space-y-3 shrink-0">
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow-md hover:shadow-purple-500/30 transition-all no-underline"
                >
                  Admin Dashboard
                </Link>
              )}
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl font-bold border-2 transition-colors no-underline ${isActive('/profile') ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/20 text-white hover:border-white/30'
                    }`}
                >
                  <span>My Profile</span>
                  <span>👤</span>
                </Link>
              ) : (
                <Link
                  to="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all no-underline"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </nav>
  )
}
