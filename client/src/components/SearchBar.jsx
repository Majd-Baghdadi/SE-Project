import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar({ documents = [] }) {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search through documents as user types
  useEffect(() => {
    if (query.trim().length === 0) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    // Filter documents based on query
    const filtered = documents.filter(doc => {
      const searchTerm = query.toLowerCase()
      return (
        doc.docname?.toLowerCase().includes(searchTerm) ||
        doc.category?.toLowerCase().includes(searchTerm) ||
        doc.difficulty?.toLowerCase().includes(searchTerm) ||
        doc.duration?.toLowerCase().includes(searchTerm)
      )
    }).slice(0, 5) // Show max 5 results

    setSearchResults(filtered)
    setShowResults(filtered.length > 0)
    setSelectedIndex(-1)
  }, [query, documents])

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showResults || searchResults.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0) {
        navigateToDocument(searchResults[selectedIndex].docid)
      } else if (searchResults.length > 0) {
        navigateToDocument(searchResults[0].docid)
      }
    } else if (e.key === 'Escape') {
      setShowResults(false)
    }
  }

  const navigateToDocument = (docId) => {
    navigate(`/document/${docId}`)
    setQuery('')
    setShowResults(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchResults.length > 0) {
      navigateToDocument(searchResults[0].docid)
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="flex bg-white rounded-lg overflow-hidden shadow-xl">
        <div className="flex items-center pl-5 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          aria-label="Search procedures"
          placeholder="Search procedures, documents, or keywords..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 py-4 px-4 border-0 outline-none text-base text-gray-800 placeholder-gray-400"
        />
        <button 
          type="submit" 
          className="py-4 px-8 bg-primary text-white border-0 cursor-pointer text-base font-semibold transition-colors hover:bg-primary-dark"
        >
          Search
        </button>
      </form>

      {/* Search Results Dropdown - Green Theme with Images */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
          {searchResults.map((doc, index) => (
            <div
              key={doc.docid}
              onClick={() => navigateToDocument(doc.docid)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
                index === selectedIndex ? 'bg-gradient-to-r from-emerald-500 to-green-600' : 'hover:bg-gradient-to-r hover:from-emerald-500 hover:to-green-600 hover:scale-[1.01]'
              } ${index === selectedIndex || 'group'}`}
            >
              <div className="flex items-center gap-4">
                {/* Document Image/Icon */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${
                  index === selectedIndex ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-white/20'
                }`}>
                  {doc.image ? (
                    <img 
                      src={doc.image} 
                      alt={doc.docname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-2xl ${
                      index === selectedIndex ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`}>
                      📄
                    </div>
                  )}
                </div>

                {/* Document Info */}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold text-lg mb-1 truncate ${
                    index === selectedIndex ? 'text-white' : 'text-gray-900 group-hover:text-white'
                  }`}>
                    {doc.docname}
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      index === selectedIndex ? 'bg-white/30 text-white' : 'bg-emerald-100 text-emerald-800 group-hover:bg-white/30 group-hover:text-white'
                    }`}>
                      {doc.category}
                    </span>
                    <span className={`flex items-center gap-1 text-sm font-medium ${
                      index === selectedIndex ? 'text-white' : 'text-gray-600 group-hover:text-white'
                    }`}>
                      ⏱️ {doc.duration}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      index === selectedIndex ? 'bg-white/30 text-white' : 
                      doc.difficulty === 'Easy' ? 'bg-green-100 text-green-800 group-hover:bg-white/30 group-hover:text-white' :
                      doc.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 group-hover:bg-white/30 group-hover:text-white' :
                      'bg-red-100 text-red-800 group-hover:bg-white/30 group-hover:text-white'
                    }`}>
                      {doc.difficulty}
                    </span>
                  </div>
                </div>

                {/* Arrow Icon */}
                <svg className={`w-6 h-6 flex-shrink-0 transition-transform ${
                  index === selectedIndex ? 'text-white translate-x-1' : 'text-gray-400 group-hover:text-white group-hover:translate-x-1'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
          
          {searchResults.length === 5 && (
            <div className="p-4 text-center text-sm bg-gradient-to-r from-emerald-50 to-green-50">
              <span className="text-gray-600">Showing top 5 results.</span>{' '}
              <button 
                onClick={() => navigate('/documents')} 
                className="text-emerald-700 hover:text-emerald-900 font-semibold hover:underline"
              >
                View all procedures →
              </button>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {showResults && searchResults.length === 0 && query.trim().length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 p-6 text-center z-50">
          <p className="text-gray-500">No procedures found for "{query}"</p>
          <button
            onClick={() => navigate('/documents')}
            className="mt-3 text-blue-600 hover:underline text-sm"
          >
            Browse all procedures
          </button>
        </div>
      )}
    </div>
  )
}
