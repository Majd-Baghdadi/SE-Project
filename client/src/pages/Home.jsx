/**
 * Home Page (Tailwind CSS Version)
 * 
 * Purpose: Main landing page with hero section, search, stats, categories, and popular procedures
 * Features: Fetches documents from API with fallback to mock data on error
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Award, ChevronRight, Plus, Sparkles, Calendar } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';
import { getAllDocuments } from '../services/documentService';
import adminService from '../services/adminService';
import banner2 from '../assets/images/banner2.jpg';
import banner3 from '../assets/images/banner3.jpg';
import banner4 from '../assets/images/banner4.jpg';
import banner5 from '../assets/images/banner5.jpg';
import standard from '../assets/images/standard2.png';

export default function Home() {
  const { isAdmin } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    activeUsers: 0,
    pendingProposals: 0,
    pendingFixes: 0
  });
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [banner2, banner3, banner4, banner5];
  const getImgSrc = (src) => {
    if (!src) return standard;
    const cleanSrc = src.toString().trim();
    if (cleanSrc.startsWith('http') || cleanSrc.includes('://')) return cleanSrc;
    if (cleanSrc.startsWith('data:')) return cleanSrc;
    return `data:image/jpeg;base64,${cleanSrc}`;
  };

  // Mock data fallback (used if API fails)
  const mockDocuments = [
    {
      docid: '1',
      docname: 'Passport Application',
      doctype: 'Biometric Services',
      duration: '15-20 days',
      created_at: '2025-11-20T10:00:00Z'
    },
    {
      docid: '2',
      docname: 'National ID Renewal',
      doctype: 'Biometric Services',
      duration: '7-10 days',
      created_at: '2025-11-18T10:00:00Z'
    },
    {
      docid: '3',
      docname: 'Birth Certificate',
      doctype: 'Civil Status Services',
      duration: '3-5 days',
      created_at: '2025-11-15T10:00:00Z'
    },
    {
      docid: '4',
      docname: 'Visa Application',
      doctype: 'Administrative Services',
      duration: '10-15 days',
      created_at: '2025-11-12T10:00:00Z'
    },
    {
      docid: '5',
      docname: "Driver's License",
      doctype: 'Administrative Services',
      duration: '30-45 days',
      created_at: '2025-11-10T10:00:00Z'
    },
    {
      docid: '6',
      docname: 'Work Permit',
      doctype: 'Administrative Services',
      duration: '20-30 days',
      created_at: '2025-11-08T10:00:00Z'
    },
  ];

  // Fetch documents and stats from API on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch documents
        const docsData = await getAllDocuments();

        // If we got data, use it
        if (docsData && docsData.length > 0) {
          setDocuments(docsData);
          setUsingMockData(false);
          console.log('✅ Successfully loaded documents from API:', docsData.length);
        } else {
          // No documents returned, use mock data
          console.warn('⚠️ No documents from API, using mock data');
          setDocuments(mockDocuments);
          setUsingMockData(true);
        }
        // Fetch stats
        // 1. Public stats (User Count) - Always fetch
        try {
          const userCountRes = await adminService.getUsersCount();
          if (userCountRes && typeof userCountRes.count !== 'undefined') {
            setStats(prev => ({
              ...prev,
              totalDocuments: docsData?.length || mockDocuments.length,
              activeUsers: userCountRes.count
            }));
          }
        } catch (error) {
          console.error('❌ Error fetching public user count:', error);
        }

        // 2. Private Admin stats - Only if isAdmin
        if (isAdmin) {
          try {
            const [proposals, fixes] = await Promise.all([
              adminService.getAllProposals().catch(() => []),
              adminService.getAllFixes().catch(() => [])
            ]);

            setStats(prev => ({
              ...prev,
              pendingProposals: proposals?.length || 0,
              pendingFixes: fixes?.length || 0
            }));
          } catch (error) {
            console.error('❌ Error fetching admin dashboard numbers:', error);
          }
        }

      } catch (error) {
        // API failed, use mock data as fallback
        console.error('❌ Failed to fetch documents from API, using mock data:', error);
        setDocuments(mockDocuments);
        setUsingMockData(true);
        setStats({
          totalDocuments: mockDocuments.length,
          activeUsers: 0,
          pendingProposals: 0,
          pendingFixes: 0
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-slide banner images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Dynamic statistics
  const displayStats = [
    {
      label: 'Verified Procedures',
      value: stats.totalDocuments > 0 ? `${stats.totalDocuments}` : '150+',
      color: 'text-emerald-500'
    },
    {
      label: 'Community Members',
      value: stats.activeUsers >= 0 ? `${stats.activeUsers}` : '25K+',
      color: 'text-blue-500'
    },
    {
      label: 'Success Rate',
      value: '98%',
      color: 'text-amber-500'
    },
  ];

  // Mock data for categories
  const categories = [
    { id: 1, name: 'Biometric Services', icon: '👤', count: 25 },
    { id: 2, name: 'Civil Status Services', icon: '🆔', count: 18 },
    { id: 3, name: 'Administrative Services', icon: '🏢', count: 32 }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 relative overflow-hidden">
      
      {/* Fixed background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center text-white overflow-hidden">
        {/* Sliding Background Images */}
        {banners.map((bannerImg, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${bannerImg})`,
              opacity: currentBanner === index ? 1 : 0,
            }}
          />
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-slate-900/70 via-emerald-900/50 to-slate-900" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl px-4 md:px-8 mt-24 md:mt-32">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/80 border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium">Community-Powered Platform</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Get any government document in Algeria <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              step by step
            </span>
          </h1>
          <p className="text-base md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Community-verified guides for passports, visas, national IDs, and all governmental procedures. Get accurate, up-to-date information from real experiences.
          </p>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`h-2 rounded-full transition-all duration-300 ${currentBanner === index ? 'bg-emerald-400 w-8' : 'bg-white/30 w-2 hover:bg-white/50'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative z-20 max-w-6xl mx-auto -mt-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayStats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="w-12 h-12 mx-auto mb-4 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {index === 0 && <FileText className="w-6 h-6 text-emerald-400" />}
                {index === 1 && <Users className="w-6 h-6 text-blue-400" />}
                {index === 2 && <Award className="w-6 h-6 text-amber-400" />}
              </div>
              <div className={`text-4xl font-extrabold mb-1 ${index === 0 ? 'text-emerald-400' : index === 1 ? 'text-blue-400' : 'text-amber-400'}`}>
                {stat.value}
              </div>
              <div className="text-xs text-white/60 font-semibold uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Search Section */}
      <section className="relative z-20 max-w-4xl mx-auto mt-12 px-6">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Find a procedure
          </h3>
          <SearchBar documents={documents} />
        </div>
      </section>

      {/* Popular Procedures Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">Popular Procedures</h2>
              <p className="text-white/60">
                {usingMockData && (
                  <span className="text-amber-400 font-semibold">⚠️ Using sample data | </span>
                )}
                Most viewed and helpful document guides
              </p>
            </div>
            <Link to="/documents" className="group inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white border border-white/20 transition-all">
              View all 
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-white/60">Loading documents...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.slice(0, 6).map((procedure) => (
                <Link
                  key={procedure.docid}
                  to={`/document/${procedure.docid}`}
                  className="group block no-underline"
                >
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden transition-all duration-300 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 flex flex-col h-full">
                    {/* Image */}
                    <div className="h-56 w-full relative overflow-hidden">
                      <img
                        src={getImgSrc(procedure.docpicture)}
                        alt={procedure.docname}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/90 text-white shadow-lg">
                          {procedure.doctype || 'General'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      {/* Header */}
                      <h3 className="text-lg font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors leading-tight">
                        {procedure.docname}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-white/50 mb-4 leading-relaxed flex-grow">
                        Complete guide for obtaining {procedure.docname.toLowerCase()}.
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-white/40">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">👤</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{procedure.created_at ? new Date(procedure.created_at).toLocaleDateString() : 'Recent'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Show More Button */}
          <div className="text-center mt-12">
            <Link
              to="/documents"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-primary to-primary-dark text-white no-underline rounded-full font-bold transition-all hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105"
            >
              Show More 
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[50]">
        <Link
          to="/propose"
          className="group w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-110 transition-all duration-300 border-2 border-white/20 no-underline"
        >
          <Plus className="w-7 h-7 md:w-8 md:h-8 group-hover:rotate-90 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
}