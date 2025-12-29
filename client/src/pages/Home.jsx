/**
 * Home Page (Tailwind CSS Version)
 * 
 * Purpose: Main landing page with hero section, search, stats, categories, and popular procedures
 * Features: Fetches documents from API with fallback to mock data on error
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';
import { getAllDocuments } from '../services/documentService';
import banner from '../assets/images/banner.jpg';
import banner3 from '../assets/images/banner3.jpg';

export default function Home() {
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [banner, banner3];

  // Mock data fallback (used if API fails)
  const mockDocuments = [
    {
      docid: '1',
      docname: 'Passport Application',
      doctype: 'Passport',
      duration: '15-20 days',
      submittedBy: 'Admin User',
      created_at: '2025-11-20T10:00:00Z'
    },
    {
      docid: '2',
      docname: 'National ID Renewal',
      doctype: 'ID Card',
      duration: '7-10 days',
      submittedBy: 'Admin User',
      created_at: '2025-11-18T10:00:00Z'
    },
    {
      docid: '3',
      docname: 'Birth Certificate',
      doctype: 'Birth Certificate',
      duration: '3-5 days',
      submittedBy: 'Admin User',
      created_at: '2025-11-15T10:00:00Z'
    },
    {
      docid: '4',
      docname: 'Visa Application',
      doctype: 'Visa',
      duration: '10-15 days',
      submittedBy: 'Community',
      created_at: '2025-11-12T10:00:00Z'
    },
    {
      docid: '5',
      docname: "Driver's License",
      doctype: 'Driving License',
      duration: '30-45 days',
      submittedBy: 'Admin User',
      created_at: '2025-11-10T10:00:00Z'
    },
    {
      docid: '6',
      docname: 'Work Permit',
      doctype: 'Work Permit',
      duration: '20-30 days',
      submittedBy: 'Community',
      created_at: '2025-11-08T10:00:00Z'
    },
  ];

  // Fetch documents from API on component mount
  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoading(true);
        const data = await getAllDocuments();

        // If we got data, use it
        if (data && data.length > 0) {
          setDocuments(data);
          setUsingMockData(false);
          console.log('✅ Successfully loaded documents from API:', data.length);
        } else {
          // No documents returned, use mock data
          console.warn('⚠️ No documents from API, using mock data');
          setDocuments(mockDocuments);
          setUsingMockData(true);
        }
      } catch (error) {
        // API failed, use mock data as fallback
        console.error('❌ Failed to fetch documents from API, using mock data:', error);
        setDocuments(mockDocuments);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-slide banner images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
  };

  // Mock data for statistics
  const stats = [
    { label: 'Available Documents', value: '150+', color: 'text-emerald-500' },
    { label: 'Active Users', value: '25K+', color: 'text-blue-500' },
    { label: 'Success Rate', value: '98%', color: 'text-amber-500' },
  ];

  // Mock data for categories
  const categories = [
    { id: 1, name: 'Civil Status Documents', icon: '👤', count: 25 },
    { id: 2, name: 'ID Services', icon: '🆔', count: 18 },
    { id: 3, name: 'Education Documents', icon: '🎓', count: 32 },
    { id: 4, name: 'Legal Documents', icon: '⚖️', count: 15 },
    { id: 5, name: 'Transport Documents', icon: '🚗', count: 20 },
    { id: 6, name: 'Healthcare Documents', icon: '🏥', count: 28 },
  ];


  return (
    <div className="w-full bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-73px)] min-h-[600px] flex items-center justify-center text-white overflow-hidden">
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

        {/* Overlay */}
        <div className="absolute inset-0 bg-blue-900/50 z-[1]" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl px-8">
          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-3 h-3 rounded-full transition-all ${currentBanner === index ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <h1 className="text-[2.75rem] font-bold mb-6 leading-tight" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}>
            Get any government document in Algeria - <span className="text-primary">step by step</span>
          </h1>
          <p className="text-base mb-10 max-w-2xl mx-auto leading-normal" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}>
            Community-verified guides for passports, visas, national IDs, and all governmental procedures. Get accurate, up-to-date information from real experiences.
          </p>

          {/* Search Bar with live suggestions */}
          <SearchBar documents={documents} />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="max-w-7xl mx-auto -mt-20 px-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 text-center shadow-md border border-gray-100">
              <div className={`text-5xl font-extrabold mb-1 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
                {stat.label === 'Available Documents' ? 'Verified Procedures' :
                  stat.label === 'Active Users' ? 'Community Members' : stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Review Pending Tasks Section (Admins Only) */}
      {isAdmin && (
        <section className="max-w-7xl mx-auto my-16 px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">Review Pending Tasks</h2>
            <p className="text-gray-600">Review and moderate community contributions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/admin/proposals" className="no-underline group">
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 transition-all hover:border-primary hover:bg-blue-50/30 flex items-center gap-6">
                <div className="text-6xl group-hover:scale-110 transition-transform">📋</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Document Proposals</h3>
                  <p className="text-gray-600">Review new procedures suggested by the community.</p>
                  <span className="inline-block mt-4 text-primary font-semibold">View Proposals →</span>
                </div>
              </div>
            </Link>
            <Link to="/admin/fixes" className="no-underline group">
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 transition-all hover:border-primary hover:bg-orange-50/30 flex items-center gap-6">
                <div className="text-6xl group-hover:scale-110 transition-transform">🔧</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Proposed Fixes</h3>
                  <p className="text-gray-600">Review edits and corrections submitted by users.</p>
                  <span className="inline-block mt-4 text-orange-600 font-semibold">View Fixes →</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}


      {/* Popular Procedures Section */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-900">Popular Procedures</h2>
              <p className="text-gray-600">
                {usingMockData && (
                  <span className="text-amber-600 font-semibold">⚠️ Using sample data (API unavailable) | </span>
                )}
                Most viewed and helpful document guides
              </p>
            </div>
            <Link to="/documents" className="text-primary no-underline font-semibold flex items-center gap-2 hover:text-primary-dark">
              View all <span>→</span>
            </Link>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading documents...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.slice(0, 6).map((procedure) => (
                <Link
                  key={procedure.docid}
                  to={`/document/${procedure.docid}`}
                  className="block no-underline"
                >
                  <div className="bg-white rounded-lg p-6 cursor-pointer transition-all border-l-4 border-l-green-600 shadow-sm hover:shadow-md">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                        📄
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold mb-2 text-gray-900 leading-tight">{procedure.docname}</h3>
                        <span className="inline-block px-2.5 py-0.5 bg-green-50 text-green-700 rounded text-xs font-bold border border-green-100 uppercase tracking-wide">
                          {procedure.doctype || 'General'}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      Complete guide for obtaining {procedure.docname.toLowerCase()}, including document requirements, processing times, and application steps.
                    </p>

                    {/* Meta Info */}
                    <div className="grid grid-cols-1 gap-4 mb-4 text-sm">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Duration</div>
                        <div className="font-semibold text-gray-900">{procedure.duration || 'Varies'}</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="w-5 h-5 bg-gray-100 rounded-full inline-flex items-center justify-center">
                          👤
                        </span>
                        <span>Submitted by {procedure.submittedBy || 'Admin'}</span>
                      </div>
                      <button
                        className="text-primary hover:text-primary-dark transition-colors text-lg"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        ⚡
                      </button>
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
              className="inline-block px-10 py-4 bg-green-600 text-white no-underline rounded-full font-bold transition-all hover:bg-green-700 hover:scale-105 shadow-lg"
            >
              Show More →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
