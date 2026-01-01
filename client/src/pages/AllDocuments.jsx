import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, SortAsc, FileText, Calendar, ChevronLeft, Home, Sparkles } from 'lucide-react';
import documentService from '../services/documentService';
import standard from '../assets/images/standard2.png';

export default function AllDocuments() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const getImgSrc = (src) => {
    if (!src) return standard;
    const cleanSrc = src.toString().trim();
    if (cleanSrc.startsWith('http') || cleanSrc.includes('://')) return cleanSrc;
    if (cleanSrc.startsWith('data:')) return cleanSrc;
    return `data:image/jpeg;base64,${cleanSrc}`;
  };

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const categories = [
    'Biometric Services',
    'Civil Status Services',
    'Administrative Services'
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    filterAndSortDocuments();
  }, [documents, searchQuery, selectedCategory, sortBy]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentService.getAllDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      // Mock data fallback
      setDocuments([
        {
          docid: '1',
          docname: 'Passport Application',
          category: 'Identity',
          difficulty: 'Medium',
          duration: '15-20 days',
          steps: 8,
          submittedBy: 'Admin User',
          date: 'Nov 20, 2025',
          views: '1.2K'
        },
        {
          docid: '2',
          docname: 'National ID Renewal',
          category: 'Identity',
          difficulty: 'Easy',
          duration: '7-10 days',
          steps: 5,
          submittedBy: 'Admin User',
          date: 'Nov 18, 2025',
          views: '980'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortDocuments = () => {
    let filtered = [...documents];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(doc => {
        const docName = String(doc.docname || '').toLowerCase();
        const docType = String(doc.doctype || doc.category || '').toLowerCase();
        const searchLower = searchQuery.toLowerCase();
        return docName.includes(searchLower) || docType.includes(searchLower);
      });
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => (doc.doctype) === selectedCategory);
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'oldest':
        sorted.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateA - dateB;
        });
        break;
      case 'name':
        sorted.sort((a, b) => {
          const nameA = String(a.docname || a.docName || '').trim().toLowerCase();
          const nameB = String(b.docname || b.docName || '').trim().toLowerCase();
          return nameA.localeCompare(nameB, 'en', { sensitivity: 'base', numeric: true });
        });
        break;
      default:
        break;
    }

    setFilteredDocs(sorted);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/60">Loading procedures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 relative overflow-hidden">
      
      {/* Home button */}
      <Link 
        to="/" 
        className="fixed top-24 left-4 md:top-6 md:left-6 z-30 group flex items-center gap-2 px-3 py-2 md:px-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white/80 hover:text-white transition-all duration-300 border border-white/20"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <Home className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">Home</span>
      </Link>

      {/* Animated background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-white/10 rounded-2xl rotate-12 animate-float"></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 border border-emerald-500/20 rounded-full animate-float delay-1000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
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

      {/* Header */}
      <div className="relative z-10 pt-28 md:pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 md:mb-6 border border-white/20">
            <FileText className="w-7 h-7 md:w-8 md:h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">All Procedures</h1>
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto">Browse and search all available administrative procedures</p>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        {/* Filters Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-white/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" /> Search
              </label>
              <input
                type="text"
                placeholder="Search procedures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:bg-white/15"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:bg-white/15 cursor-pointer"
              >
                <option value="all" className="bg-slate-800">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                <SortAsc className="w-4 h-4" /> Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:bg-white/15 cursor-pointer"
              >
                <option value="newest" className="bg-slate-800">Newest First</option>
                <option value="oldest" className="bg-slate-800">Oldest First</option>
                <option value="name" className="bg-slate-800">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 pt-4 border-t border-white/10 text-sm text-white/50">
            Showing <span className="font-bold text-white">{filteredDocs.length}</span> of {documents.length} procedures
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocs.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-16 text-center border border-white/20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-white/60 text-lg font-medium">No procedures found matching your criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-4 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <Link
                key={doc.docid}
                to={`/document/${doc.docid}`}
                className="group bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-emerald-500/50 transition-all duration-300 no-underline overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="h-56 w-full relative overflow-hidden">
                  <img
                    src={getImgSrc(doc.docpicture)}
                    alt={doc.docname}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/90 text-white shadow-lg backdrop-blur-sm">
                      {doc.doctype || doc.category || 'Other'}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors uppercase tracking-tight line-clamp-2">
                    {doc.docname}
                  </h3>

                  <div className="flex-grow"></div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-medium text-white/40 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px]">👤</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Recent'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
