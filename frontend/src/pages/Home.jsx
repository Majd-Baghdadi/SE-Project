/**
 * Home Page
 * 
 * Purpose: Main landing page displaying searchable and filterable list of documents
 * 
 * Features:
 * - Search bar for document search
 * - Filter panel (by type, etc.)
 * - Grid/list of document cards
 * - Click on card navigates to DocumentDetails page
 * 
 * Components Used:
 * - SearchBar
 * - FilterPanel
 * - DocumentCard
 * - Pagination (future sprint)
 * 
 * API Calls:
 * - documentService.getAllDocuments()
 * - documentService.searchDocuments(query)
 * - documentService.filterDocuments(filters)
 */

import { Link } from 'react-router-dom';

export default function Home() {
  // Mock data for Sprint 1 demonstration
  const mockDocuments = [
    { docId: '1', docName: 'Birth Certificate', picture: '', type: 'Civil Status' },
    { docId: '2', docName: 'Passport', picture: '', type: 'Legal' },
    { docId: '3', docName: 'Driver License', picture: '', type: 'Transport' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Government Procedures</h1>
      
      {/* Search Bar Placeholder */}
      <div style={{ marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Search for documents..." 
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      {/* Document Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {mockDocuments.map(doc => (
          <Link 
            key={doc.docId}
            to={`/document/${doc.docId}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              background: '#fff'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <h3 style={{ marginBottom: '0.5rem' }}>{doc.docName}</h3>
              <span style={{ 
                fontSize: '0.875rem', 
                color: '#666',
                padding: '0.25rem 0.5rem',
                background: '#f0f0f0',
                borderRadius: '4px'
              }}>
                {doc.type}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
