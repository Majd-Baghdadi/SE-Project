import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDocumentById } from '../services/documentService';
import SignInModal from '../components/SignInModal';
import authService from '../services/authService';


/**
 * DocumentDetail - Dynamic page component for displaying document/procedure details
 *
 * Uses React Router useParams to get the docId from the URL
 * Route: /document/:docId
 * 
 * API Integration:
 * - Fetches from: GET /api/documents/:id
 * - Response shape: { data: {...documentFields}, relatedDocuments: [...] }
 * - Falls back to mock data if API unavailable
 */

// Mock data fallback (used when API is unavailable)
const mockDocuments = {
  '1': {
    docid: '1',
    docname: 'Passport Application',
    doctype: 'Identity',
    docprice: 6000,
    docduration: '15-20 days',
    docsteps: [
      'Gather all required documents and make copies',
      'Visit your local passport office (Daïra)',
      'Complete the application form and pay the fee',
      'Provide fingerprints and have your photo taken',
      'Track your application online and collect when ready'
    ],
    relateddocs: ['2', '3']
  },
  '2': {
    docid: '2',
    docname: 'National ID Renewal',
    doctype: 'Identity',
    docprice: 500,
    docduration: '7-10 days',
    docsteps: [
      'Collect all required documents listed above',
      'Go to your local municipality office (Mairie/APC) with all documents',
      'Fill out the application form and submit with your documents',
      'Have your fingerprints and photo taken at the office',
      'Return after the processing period to collect your new ID card'
    ],
    relateddocs: ['1', '3']
  },
  '3': {
    docid: '3',
    docname: 'Birth Certificate',
    doctype: 'Civil Status',
    docprice: 0,
    docduration: '3-5 days',
    docsteps: [
      'Go to the municipality (APC) where you were born or registered',
      'Visit the civil registry office (État Civil) and make your request',
      'Give your full name, date of birth, and registration number if known',
      'Receive your birth certificate (usually same day or next day)'
    ],
    relateddocs: ['1', '2']
  },
  '4': {
    docid: '4',
    docname: 'University Enrollment',
    doctype: 'Education',
    docprice: 0,
    docduration: '10-15 days',
    docsteps: [
      'Complete the online pre-registration on the university portal',
      'Select your desired field of study based on your Baccalaureate results',
      'Visit the university to submit all required documents',
      'Pay the registration fees at the university treasury',
      'Collect your student ID card and class schedule'
    ],
    relateddocs: ['2', '3']
  },
  '5': {
    docid: '5',
    docname: "Driver's License",
    doctype: 'Transport',
    docprice: 3000,
    docduration: '30-45 days',
    docsteps: [
      'Enroll in a certified driving school',
      'Finish the required theoretical and practical training hours',
      'Take and pass the written theory exam',
      'Successfully complete the practical driving test',
      'Collect your driver\'s license from the transport office'
    ],
    relateddocs: ['2', '3']
  },
  '6': {
    docid: '6',
    docname: 'Business Registration',
    doctype: 'Legal',
    docprice: 5000,
    docduration: '20-30 days',
    docsteps: [
      'Decide on your business structure (sole proprietor, SARL, SPA, etc.)',
      'Register your business name at the National Center of Commercial Register (CNRC)',
      'Open a bank account and deposit the required capital',
      'File your registration documents at the CNRC',
      'Collect your commercial register and register for taxes'
    ],
    relateddocs: ['2', '3']
  }
};

const mockRelatedDocs = {
  '1': { docid: '1', docname: 'Passport Application' },
  '2': { docid: '2', docname: 'National ID Renewal' },
  '3': { docid: '3', docname: 'Birth Certificate' },
  '4': { docid: '4', docname: 'University Enrollment' },
  '5': { docid: '5', docname: "Driver's License" },
  '6': { docid: '6', docname: 'Business Registration' }
};

export default function DocumentDetail() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [relatedDocuments, setRelatedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    async function fetchDocument() {
      setLoading(true);
      setError(null);

      try {
        // Try to fetch from API
        const response = await getDocumentById(docId);

        if (response && response.data) {
          setData(response.data);
          setRelatedDocuments(response.relatedDocuments || []);
          setUsingMockData(false);
          console.log('✅ Loaded document from API:', response.data.docname);
        } else {
          throw new Error('No data returned from API');
        }
      } catch (err) {
        // Fallback to mock data
        console.warn('⚠️ API unavailable, using mock data:', err.message);

        const mockDoc = mockDocuments[docId];
        if (mockDoc) {
          setData(mockDoc);
          // Get related documents from mock
          const related = (mockDoc.relateddocs || []).map(id => mockRelatedDocs[id]).filter(Boolean);
          setRelatedDocuments(related);
          setUsingMockData(true);
        } else {
          setError('Document not found');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDocument();
  }, [docId]);
  // Handle "Report Issue" button click
  const handleReportIssue = () => {
    if (authService.isAuthenticated()) {
      // Navigate to FixForm page with docid in URL
      navigate(`/fixform/${docId}`);
    } else {
      // Show sign in modal
      setShowSignInModal(true);
    }
  };

  const handleSignInSuccess = () => {
    setShowSignInModal(false);
    // After successful login, navigate to FixForm
    navigate(`/fixform/${docId}`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-6">
        <div className="flex items-center justify-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <div className="max-w-6xl mx-auto px-5 py-6 text-center py-20">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const doc = data || {};


  // Helper to format price
  const formatPrice = (price) => {
    if (price === 0 || price === '0' || !price) return 'Free';
    return `${price} DA`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <div className="max-w-6xl mx-auto px-5 py-6 flex-1 w-full">
        {/* Mock data indicator */}
        {usingMockData && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
            ⚠️ Using sample data (API unavailable). Connect the backend for real data.
          </div>
        )}

        {/* Breadcrumbs */}
        <nav className="text-sm text-slate-500 mb-4">
          <Link to="/" className="hover:underline hover:text-primary">Home</Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="hover:underline">{doc.doctype || doc.category}</span>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-primary font-medium">{doc.docname || doc.title}</span>
        </nav>

        {/* Header */}
        <header className="flex justify-between items-start mb-2">
          <h1 className="text-3xl font-semibold text-slate-900">{doc.docname || doc.title}</h1>
          <span className="text-sm text-slate-500">💬 Comments (3)</span>
        </header>

        {/* Meta info */}
        <div className="flex flex-wrap gap-6 text-sm text-slate-600 mb-6">
          <span>Processing Time: <strong className="text-slate-800">{doc.docduration || doc.processingTime}</strong></span>
          <span>Cost: <strong className="text-slate-800">{formatPrice(doc.docprice) || doc.cost}</strong></span>
          <span>Category: <strong className="text-slate-800">{doc.doctype || doc.category}</strong></span>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left column - Steps */}
          <main className="flex flex-col gap-4">
            {/* Steps Section */}
            <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <h2 className="text-base font-semibold text-primary mb-3">Steps to Complete</h2>
              <ol className="list-decimal list-inside space-y-3 text-sm text-slate-600">
                {(doc.docsteps || []).map((step, idx) => (
                  <li key={idx} className="leading-relaxed pl-2">
                    <span className="ml-2">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Required Documents Section (if available from API) */}
            {doc.docrequirements && (
              <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <h2 className="text-base font-semibold text-primary mb-3">Required Documents</h2>
                <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                  {doc.docrequirements.map((req, idx) => (
                    <li key={idx} className="leading-relaxed">{req}</li>
                  ))}
                </ul>
              </section>
            )}
          </main>

          {/* Right column - Sidebar */}
          <aside className="flex flex-col gap-4 lg:order-none order-first">
            {/* Quick Information */}
            <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl p-5">
              <h3 className="text-base font-semibold mb-4">Quick Information</h3>
              <div className="flex justify-between text-sm py-2 border-b border-white/20">
                <span className="opacity-90">Processing Time</span>
                <strong className="font-medium">{doc.docduration || doc.processingTime}</strong>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-white/20">
                <span className="opacity-90">Application Cost</span>
                <strong className="font-medium">{formatPrice(doc.docprice) || doc.cost}</strong>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="opacity-90">Category</span>
                <strong className="font-medium">{doc.doctype || doc.category}</strong>
              </div>
            </div>

            {/* Report Issue */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <h4 className="text-base font-semibold text-slate-900 mb-2">Report an Issue</h4>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Please report any errors or unclear information found in this document, and we will ensure they are handled appropriately.
              </p>
              <button
                onClick={handleReportIssue}
                className="w-full py-2.5 px-4 bg-white text-slate-800 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                ✏️ Report Issue
              </button>
            </div>

            {/* Related Documents */}
            {relatedDocuments.length > 0 && (
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <h4 className="text-base font-semibold text-slate-900 mb-3">Related Documents</h4>
                <ul className="space-y-2">
                  {relatedDocuments.map((relDoc) => (
                    <li key={relDoc.docid}>
                      <Link
                        to={`/document/${relDoc.docid}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {relDoc.docname}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Need Help */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <h4 className="text-base font-semibold text-slate-900 mb-2">Need Help?</h4>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Contact our support team for assistance with your application.
              </p>
              <button
                onClick={() => navigate('/conntact')}
                className="w-full py-3 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Contact Support
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-12 pb-6 px-5 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h5 className="text-sm font-semibold text-slate-900 mb-4">About</h5>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary">About Us</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary">Our Mission</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-slate-900 mb-4">Services</h5>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary">All Services</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary">Documents</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary">Certificates</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-slate-900 mb-4">Support</h5>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary">Help Center</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary">FAQ</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary">Guidelines</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-slate-900 mb-4">Legal</h5>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary">Accessibility</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
          © 2024 Government Services Portal. All rights reserved.
        </div>
      </footer>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSuccess={handleSignInSuccess}
      />
    </div>
  );
}