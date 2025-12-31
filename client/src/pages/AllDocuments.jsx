import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
          difficulty: 'Medium', // Keep in mock data for consistency, but not displayed
          duration: '15-20 days',
          steps: 8,
          submittedBy: 'Admin User',
          date: 'Nov 20, 2025',
          views: '1.2K' // Keep in mock data for consistency, but not displayed
        },
        {
          docid: '2',
          docname: 'National ID Renewal',
          category: 'Identity',
          difficulty: 'Easy', // Keep in mock data for consistency, but not displayed
          duration: '7-10 days',
          steps: 5,
          submittedBy: 'Admin User',
          date: 'Nov 18, 2025',
          views: '980' // Keep in mock data for consistency, but not displayed
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
        const docName = (doc.docname || '').toLowerCase();
        const docType = (doc.doctype || doc.category || '').toLowerCase();
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

          // Move items starting with punctuation/quotes to the end if desired, 
          // or just use localeCompare which is standard.
          return nameA.localeCompare(nameB, 'en', { sensitivity: 'base', numeric: true });
        });
        break;
      default:
        break;
    }

    setFilteredDocs(sorted);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading documents...</div>;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-serif">All Procedures</h1>
          <p className="text-gray-600 font-sans">Browse and search all available administrative procedures</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search procedures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 pt-4 border-t border-gray-50 text-sm text-gray-500">
            Showing <span className="font-bold text-gray-900">{filteredDocs.length}</span> of {documents.length} procedures
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-100">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg font-medium">No procedures found matching your criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-4 text-green-600 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDocs.map((doc) => (
              <Link
                key={doc.docid}
                to={`/document/${doc.docid}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 no-underline border border-gray-100 hover:-translate-y-1 overflow-hidden flex flex-col h-full"
              >
                {/* Image */}
                <div className="h-48 w-full relative">
                  <img
                    src={getImgSrc(doc.docpicture)}
                    alt={doc.docname}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-white/90 text-green-700 shadow-sm backdrop-blur-sm border border-green-100">
                      {doc.doctype || doc.category || 'Other'}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors uppercase tracking-tight line-clamp-2">
                    {doc.docname}
                  </h3>

                  <div className="space-y-3 text-sm text-gray-600 mb-6 font-sans flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⏱️</span>
                      <span className="font-medium text-gray-700">{doc.duration || 'Varies'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-[11px] font-semibold uppercase tracking-widest text-gray-400 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">👤</div>
                      <span>By {doc.submittedBy || 'Official'}</span>
                    </div>
                    <span>{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Recent'}</span>
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
