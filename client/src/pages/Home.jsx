/**
 * Home Page (Tailwind CSS Version)
 * 
 * Purpose: Main landing page with hero section, search, stats, categories, and popular procedures
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import SearchBar from '../components/SearchBar';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

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

  // Mock data for popular procedures
  const popularProcedures = [
    {
      docId: '1',
      docName: 'Passport Application',
      category: 'Identity',
      difficulty: 'Medium',
      duration: '15-20 days',
      steps: 8,
      submittedBy: 'Admin User',
      date: 'Nov 20, 2025',
      views: '1.2K'
    },
    {
      docId: '2',
      docName: 'National ID Renewal',
      category: 'Identity',
      difficulty: 'Easy',
      duration: '7-10 days',
      steps: 5,
      submittedBy: 'Admin User',
      date: 'Nov 18, 2025',
      views: '980'
    },
    {
      docId: '3',
      docName: 'Birth Certificate',
      category: 'Civil Status',
      difficulty: 'Easy',
      duration: '3-5 days',
      steps: 4,
      submittedBy: 'Admin User',
      date: 'Nov 15, 2025',
      views: '850'
    },
    {
      docId: '4',
      docName: 'University Enrollment',
      category: 'Education',
      difficulty: 'Medium',
      duration: '10-15 days',
      steps: 6,
      submittedBy: 'Community',
      date: 'Nov 12, 2025',
      views: '720'
    },
    {
      docId: '5',
      docName: "Driver's License",
      category: 'Transport',
      difficulty: 'Hard',
      duration: '30-45 days',
      steps: 10,
      submittedBy: 'Admin User',
      date: 'Nov 10, 2025',
      views: '1.5K'
    },
    {
      docId: '6',
      docName: 'Business Registration',
      category: 'Legal',
      difficulty: 'Hard',
      duration: '20-30 days',
      steps: 12,
      submittedBy: 'Community',
      date: 'Nov 8, 2025',
      views: '640'
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-500';
      case 'Medium': return 'text-amber-500';
      case 'Hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Navigation Bar */}
      <NavBar />

      {/* Hero Section */}
      <section className="relative h-[calc(100vh-73px)] min-h-[600px] bg-cover bg-center flex items-center justify-center text-white" 
               style={{backgroundImage: 'url(https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070)'}}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-blue-900/50" />
        
        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl px-8">
          <h1 className="text-[2.75rem] font-bold mb-6 leading-tight" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.6)'}}>
            Get any government document in Algeria - <span className="text-primary">step by step</span>
          </h1>
          <p className="text-base mb-10 max-w-2xl mx-auto leading-normal" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.6)'}}>
            Community-verified guides for passports, visas, national IDs, and all governmental procedures. Get accurate, up-to-date information from real experiences.
          </p>
          
          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />
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

      {/* Browse by Category Section */}
      <section className="max-w-7xl mx-auto my-16 px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">Browse by Category</h2>
          <p className="text-gray-600">Find documents organized by category</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/search?category=${encodeURIComponent(category.name)}`}
              className="block no-underline"
            >
              <div className="bg-white border border-gray-200 rounded-lg p-5 text-center cursor-pointer transition-all hover:border-primary hover:shadow-lg hover:scale-105">
                <div className="text-4xl mb-2">{category.icon}</div>
                <h3 className="text-xs font-bold mb-1 text-gray-900 leading-tight">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.count} procedures</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Procedures Section */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-900">Popular Procedures</h2>
              <p className="text-gray-600">Most viewed and helpful document guides</p>
            </div>
            <Link to="/documents" className="text-primary no-underline font-semibold flex items-center gap-2 hover:text-primary-dark">
              View all <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularProcedures.map((procedure) => (
              <Link
                key={procedure.docId}
                to={`/document/${procedure.docId}`}
                className="block no-underline"
              >
                <div className="bg-white rounded-lg p-6 cursor-pointer transition-all border-l-4 border-l-primary shadow-sm hover:shadow-md">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                      📄
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold mb-2 text-gray-900 leading-tight">{procedure.docName}</h3>
                      <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-primary rounded text-xs font-semibold border border-primary/20">
                        {procedure.category}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Complete guide for obtaining {procedure.docName.toLowerCase()}, including document requirements, processing times, and application steps.
                  </p>

                  {/* Meta Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Difficulty</div>
                      <div className={`font-semibold ${getDifficultyColor(procedure.difficulty)}`}>
                        {procedure.difficulty}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Duration</div>
                      <div className="font-semibold text-gray-900">{procedure.duration}</div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-5 h-5 bg-gray-100 rounded-full inline-flex items-center justify-center">
                        👤
                      </span>
                      <span>Submitted by {procedure.submittedBy}</span>
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

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              to="/documents"
              className="inline-block px-10 py-4 bg-primary text-white no-underline rounded-lg font-semibold transition-colors hover:bg-primary-dark"
            >
              View All Procedures
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
