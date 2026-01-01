import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
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
    <nav className={`z-50 font-sans transition-all duration-300 fixed top-0 w-full ${isTransparent 
      ? 'bg-transparent border-transparent' 
      : 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/10'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline group z-50 relative">
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
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl transition-colors text-white hover:bg-white/10"
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
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col border-l border-white/10 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <span className="text-lg font-bold text-white">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-white/60 hover:bg-white/10 rounded-full transition-colors"
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
                    ? 'bg-emerald-500/20 text-emerald-400 border-l-[6px] border-emerald-500'
                    : 'text-white/70 hover:bg-white/10 hover:text-white hover:pl-6'
                    }`}
                >
                  {link.title}
                  {active && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                </Link>
              );
            })}
          </div>

          {/* Sidebar Footer (Actions) */}
          <div className="p-6 border-t border-white/10 bg-slate-800/50 space-y-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="block w-full text-center px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow-md hover:shadow-purple-500/30 transition-all no-underline"
              >
                Admin Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <Link
                to="/profile"
                className={`flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl font-bold border-2 transition-colors no-underline ${isActive('/profile') ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/20 text-white hover:border-white/30'
                  }`}
              >
                <span>My Profile</span>
                <span>👤</span>
              </Link>
            ) : (
              <Link
                to="/signin"
                className="block w-full text-center px-4 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all no-underline"
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
