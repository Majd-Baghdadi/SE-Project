import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import documentService from '../services/documentService';

export default function AllDocuments() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['Identity', 'Civil Status', 'Education', 'Transport', 'Legal', 'Health', 'Other'];

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
      filtered = filtered.filter(doc =>
        doc.docname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'name':
        filtered.sort((a, b) => a.docname.localeCompare(b.docname));
        break;
      default:
        break;
    }

    setFilteredDocs(filtered);
  };

  if (loading) return <div className="p-8">Loading documents...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Procedures</h1>
          <p className="text-gray-600">Browse and search all available administrative procedures</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search procedures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>


            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredDocs.length} of {documents.length} procedures
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">No procedures found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <Link
                key={doc.docid}
                to={`/document/${doc.docid}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 no-underline"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {doc.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{doc.docname}</h3>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span>{doc.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📋</span>
                    <span>{doc.steps} steps</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>By {doc.submittedBy}</span>
                  <span>{doc.date}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
