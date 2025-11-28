/**
 * Document Details Page
 * 
 * Purpose: Display full details of a selected document
 * 
 * Features:
 * - Document name, picture, type
 * - Step-by-step guide
 * - Price and duration information
 * - Related documents section
 * - Report issue button (opens Fix modal)
 * - Breadcrumb navigation
 * 
 * Components Used:
 * - DocumentHeader
 * - StepsList
 * - RelatedDocuments
 * - ReportIssueButton
 * - FixModal (when reporting issues)
 * 
 * API Calls:
 * - documentService.getDocumentById(docId)
 * - documentService.getRelatedDocumentNames(docIds)
 * 
 * Route: /document/:docId
 */

import { useParams, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function DocumentDetails() {
  const { docId } = useParams();

  // Mock data for Sprint 1 demonstration
  const mockDocuments = {
    '1': {
      docName: 'Birth Certificate',
      type: 'Civil Status',
      price: 500,
      duration: 7,
      steps: [
        'Go to the local municipality office',
        'Bring your national ID card',
        'Fill out the birth certificate request form',
        'Pay the required fee',
        'Collect your certificate after 7 days'
      ],
      relatedDocs: ['Family Book', 'National ID']
    },
    '2': {
      docName: 'Passport',
      type: 'Legal',
      price: 6000,
      duration: 30,
      steps: [
        'Visit the passport office',
        'Bring birth certificate and national ID',
        'Take biometric photo',
        'Fill application form',
        'Pay processing fee',
        'Wait for notification (usually 30 days)'
      ],
      relatedDocs: ['Birth Certificate', 'National ID']
    },
    '3': {
      docName: 'Driver License',
      type: 'Transport',
      price: 3000,
      duration: 60,
      steps: [
        'Register at driving school',
        'Complete theoretical training',
        'Pass theory exam',
        'Complete practical training',
        'Pass driving test',
        'Collect license'
      ],
      relatedDocs: ['Medical Certificate', 'National ID']
    }
  };

  const document = mockDocuments[docId] || mockDocuments['1'];

  return (
    <>
      <NavBar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#666' }}>
        <Link to="/" style={{ color: 'inherit' }}>Home</Link> / {document.docName}
      </div>

      {/* Document Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>{document.docName}</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ 
            padding: '0.25rem 0.75rem',
            background: '#e3f2fd',
            color: '#1976d2',
            borderRadius: '4px',
            fontSize: '0.875rem'
          }}>
            {document.type}
          </span>
          <span style={{ color: '#666' }}>
            <strong>Price:</strong> {document.price} DA
          </span>
          <span style={{ color: '#666' }}>
            <strong>Duration:</strong> {document.duration} days
          </span>
        </div>
      </div>

      {/* Steps Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Steps to Obtain</h2>
        <ol style={{ 
          padding: '1.5rem',
          background: '#f9f9f9',
          borderRadius: '8px',
          lineHeight: '1.8'
        }}>
          {document.steps.map((step, index) => (
            <li key={index} style={{ marginBottom: '0.75rem' }}>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Related Documents */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Related Documents</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {document.relatedDocs.map((relDoc, index) => (
            <span 
              key={index}
              style={{
                padding: '0.5rem 1rem',
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}
            >
              {relDoc}
            </span>
          ))}
        </div>
      </div>

      {/* Report Issue Button */}
      <button style={{
        padding: '0.75rem 1.5rem',
        background: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem'
      }}>
        Report Issue
      </button>
    </div>
    </>
  );
}
