import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import SignInModal from '../components/SignInModal';
import authService from '../services/authService';
import documentService from '../services/documentService';

// Import document images
import passportImg from '../assets/images/docs_images/Algerian-Passport.png';
import nationalIdImg from '../assets/images/docs_images/nationa ID.webp';
import driverLicenseImg from '../assets/images/docs_images/Driver licence.webp';
import visaImg from '../assets/images/docs_images/visa.png';
import defaultDocImg from '../assets/images/standard2.png';


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

// Mock data fallback - Comprehensive Algerian Government Procedures
const mockDocuments = {
  '1': {
    docid: '1',
    docname: 'Passport Application',
    doctype: 'Identity',
    docprice: 6000,
    docduration: '15-20 days',
    docimage: passportImg,
    docrequirements: [
      {
        name: 'National ID Card (Carte Nationale d\'Identité)',
        description: 'Valid biometric national ID card',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Birth Certificate (Extrait de Naissance)',
        description: 'Recent extract less than 3 months old - "Extrait de naissance spécial n°12"',
        copies: 2,
        type: 'original'
      },
      {
        name: 'Residence Certificate (Certificat de Résidence)',
        description: 'Proof of residence less than 3 months old from your APC',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Biometric Photos',
        description: 'Recent passport-size photos (4x3.5 cm) with white background',
        copies: 4,
        type: 'original'
      },
      {
        name: 'Military Service Document (for males 19-30)',
        description: 'Military service certificate or exemption document',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Previous Passport (if renewal)',
        description: 'Your old passport if this is a renewal',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Payment Receipt',
        description: 'Proof of payment of 6,000 DA passport fee (fiscal stamp)',
        copies: 1,
        type: 'original'
      }
    ],
    docsteps: [
      'Gather all required documents listed above and verify they are valid and recent',
      'Visit your local Daïra (district office) passport service',
      'Take a queue number and wait to be called',
      'Submit your documents and complete the application form',
      'Provide your fingerprints (10 fingers) at the biometric station',
      'Have your photo taken at the office (or submit your own)',
      'Pay the 6,000 DA fee and receive your receipt',
      'Track your passport status online at passeport.interieur.gov.dz',
      'Return to collect your passport when notified (bring your receipt)'
    ],
    relateddocs: ['2', '3'],
    tips: [
      'Book an appointment online at passeport.interieur.gov.dz to avoid long queues',
      'Arrive early in the morning for shorter waiting times',
      'Make sure all documents are recent (less than 3 months old)'
    ]
  },
  '2': {
    docid: '2',
    docname: 'National ID Card (Carte Nationale d\'Identité Biométrique)',
    doctype: 'Identity',
    docprice: 500,
    docduration: '7-10 days',
    docimage: nationalIdImg,
    docrequirements: [
      {
        name: 'Birth Certificate (Extrait de Naissance)',
        description: 'Special extract n°12 less than 3 months old',
        copies: 2,
        type: 'original'
      },
      {
        name: 'Residence Certificate (Certificat de Résidence)',
        description: 'Recent proof of residence from your APC',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Biometric Photos',
        description: 'Recent passport-size photos (3.5x4.5 cm) with white background',
        copies: 2,
        type: 'original'
      },
      {
        name: 'Blood Type Certificate',
        description: 'Official blood group certificate from a hospital or clinic',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Old National ID (if renewal)',
        description: 'Previous ID card for renewal applications',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Fiscal Stamp (Timbre Fiscal)',
        description: '500 DA fiscal stamp available at post offices',
        copies: 1,
        type: 'original'
      }
    ],
    docsteps: [
      'Prepare all required documents listed above',
      'Go to your local municipality (APC/Mairie) civil status office',
      'Request the national ID application form and fill it out',
      'Submit your documents at the designated counter',
      'Provide your fingerprints at the biometric station',
      'Have your photo taken or submit compliant photos',
      'Receive your receipt with pickup date',
      'Return on the specified date to collect your new ID card'
    ],
    relateddocs: ['1', '3'],
    tips: [
      'First-time applicants must apply in person at their birth municipality',
      'The ID card is valid for 10 years',
      'Keep your receipt safe - you need it to collect your ID'
    ]
  },
  '3': {
    docid: '3',
    docname: 'Birth Certificate (Acte de Naissance)',
    doctype: 'Civil Status',
    docprice: 0,
    docduration: 'Same day - 3 days',
    docimage: null,
    docrequirements: [
      {
        name: 'National ID Card',
        description: 'Valid ID of the person requesting (for adults)',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Family Book (Livret de Famille)',
        description: 'If requesting for a minor child',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Authorization Letter',
        description: 'If someone else is requesting on your behalf',
        copies: 1,
        type: 'original'
      }
    ],
    docsteps: [
      'Go to the civil registry (État Civil) at the APC where you were born',
      'Request the specific type of birth certificate you need (S12, integral, etc.)',
      'Provide your full name, date of birth, and parents\' names',
      'If available, provide your birth registration number',
      'Wait for processing (usually same day)',
      'Collect your birth certificate'
    ],
    relateddocs: ['1', '2'],
    tips: [
      'You can request online via el-baldi.dz in some municipalities',
      'Extrait S12 is required for most official procedures',
      'The integral copy contains all details including margins'
    ]
  },
  '4': {
    docid: '4',
    docname: 'University Enrollment (Inscription Universitaire)',
    doctype: 'Education',
    docprice: 200,
    docduration: '5-15 days',
    docimage: null,
    docrequirements: [
      {
        name: 'Baccalaureate Certificate (Original)',
        description: 'Original BAC certificate with transcripts',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Baccalaureate Certificate (Copies)',
        description: 'Certified copies of BAC certificate',
        copies: 4,
        type: 'certified_copy'
      },
      {
        name: 'Birth Certificate (Extrait de Naissance)',
        description: 'Recent extract less than 3 months old',
        copies: 4,
        type: 'original'
      },
      {
        name: 'National ID Card',
        description: 'Valid biometric national ID',
        copies: 1,
        type: 'original'
      },
      {
        name: 'National ID Card (Copies)',
        description: 'Photocopies of both sides of ID',
        copies: 4,
        type: 'photocopy'
      },
      {
        name: 'Biometric Photos',
        description: 'Recent passport-size photos',
        copies: 6,
        type: 'original'
      },
      {
        name: 'Medical Certificate',
        description: 'General health certificate from approved doctor',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Pre-registration Confirmation',
        description: 'Printed confirmation from orientation platform',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Residence Certificate',
        description: 'For students requesting university housing',
        copies: 1,
        type: 'original'
      }
    ],
    docsteps: [
      'Complete online pre-registration on progres.mesrs.dz after BAC results',
      'Enter your BAC scores and select your preferred programs',
      'Wait for the orientation results announcement',
      'Print your assignment letter showing your university and program',
      'Prepare all required documents listed above',
      'Visit the assigned university during registration period',
      'Submit documents at the faculty registration office (Scolarité)',
      'Pay registration fees at the university treasury',
      'Receive your student card and academic schedule'
    ],
    relateddocs: ['2', '3'],
    tips: [
      'Keep digital copies of all documents',
      'Registration periods are strict - don\'t miss deadlines',
      'Bring extra photos for student card and library card'
    ]
  },
  '5': {
    docid: '5',
    docname: "Driver's License (Permis de Conduire)",
    doctype: 'Transport',
    docprice: 4000,
    docduration: '30-60 days',
    docimage: driverLicenseImg,
    docrequirements: [
      {
        name: 'National ID Card',
        description: 'Valid biometric national ID (must be 18+ years old)',
        copies: 1,
        type: 'original'
      },
      {
        name: 'National ID Card (Copies)',
        description: 'Photocopies of both sides',
        copies: 2,
        type: 'photocopy'
      },
      {
        name: 'Birth Certificate (Extrait de Naissance)',
        description: 'Recent extract less than 3 months old',
        copies: 2,
        type: 'original'
      },
      {
        name: 'Medical Certificate',
        description: 'Medical fitness certificate from approved doctor',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Blood Type Certificate',
        description: 'Official blood group certificate',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Biometric Photos',
        description: 'Recent passport-size photos',
        copies: 4,
        type: 'original'
      },
      {
        name: 'Driving School Certificate',
        description: 'Certificate of completion from auto-école',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Theory Exam Pass Certificate',
        description: 'Proof of passing the code exam',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Fiscal Stamps',
        description: 'Required fiscal stamps for application',
        copies: 2,
        type: 'original'
      }
    ],
    docsteps: [
      'Enroll in a certified driving school (Auto-école)',
      'Complete the mandatory 20 hours of theory classes',
      'Study the highway code and traffic signs thoroughly',
      'Register for and pass the theory exam (Code)',
      'Complete the practical driving lessons (minimum 20 hours)',
      'Practice until your instructor confirms you\'re ready',
      'Register for the practical driving test',
      'Pass the practical driving exam with an examiner',
      'Submit all required documents to the driving school',
      'Wait for your license to be processed and collect it'
    ],
    relateddocs: ['2', '3'],
    tips: [
      'Choose a reputable driving school with good pass rates',
      'The theory exam has 40 questions - you need 30+ correct answers',
      'Practice driving in different conditions (traffic, parking, highway)'
    ]
  },
  '6': {
    docid: '6',
    docname: 'Commercial Register (Registre de Commerce)',
    doctype: 'Business',
    docprice: 5000,
    docduration: '7-15 days',
    docimage: null,
    docrequirements: [
      {
        name: 'National ID Card',
        description: 'Valid biometric national ID',
        copies: 1,
        type: 'original'
      },
      {
        name: 'National ID Card (Copies)',
        description: 'Certified copies of ID card',
        copies: 2,
        type: 'certified_copy'
      },
      {
        name: 'Birth Certificate (Extrait de Naissance)',
        description: 'Recent extract less than 3 months old',
        copies: 2,
        type: 'original'
      },
      {
        name: 'Residence Certificate',
        description: 'Proof of residence less than 3 months old',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Criminal Record Certificate (Casier Judiciaire)',
        description: 'Bulletin n°3 less than 3 months old',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Business Premises Lease or Title',
        description: 'Lease contract or property deed for business location',
        copies: 1,
        type: 'certified_copy'
      },
      {
        name: 'Company Statutes (for SARL/SPA)',
        description: 'Notarized company formation documents',
        copies: 2,
        type: 'original'
      },
      {
        name: 'Capital Deposit Certificate',
        description: 'Bank certificate showing deposited capital (for companies)',
        copies: 1,
        type: 'original'
      },
      {
        name: 'Biometric Photos',
        description: 'Recent passport-size photos',
        copies: 4,
        type: 'original'
      },
      {
        name: 'CNRC Application Form',
        description: 'Completed registration form from CNRC',
        copies: 1,
        type: 'original'
      }
    ],
    docsteps: [
      'Decide on your business structure (Auto-entrepreneur, EURL, SARL, SPA)',
      'Choose your business activity from the official nomenclature',
      'Verify your business name availability at CNRC',
      'Open a business bank account and deposit required capital',
      'Prepare all required documents listed above',
      'Submit your application at the CNRC office',
      'Pay the registration fees',
      'Receive your temporary commercial register',
      'Register with tax authorities (Direction des Impôts)',
      'Collect your permanent commercial register'
    ],
    relateddocs: ['2', '3'],
    tips: [
      'Use sijilcom.cnrc.dz for online registration',
      'Auto-entrepreneur status is simplest for small businesses',
      'SARL requires minimum 100,000 DA capital'
    ]
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

export default function DocumentDetails() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [relatedDocuments, setRelatedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Check if user is admin (by role, not by route)
  const isAdmin = authService.isAuthenticated() && authService.getUserRole() === 'admin';

  useEffect(() => {
    async function fetchDocument() {
      setLoading(true);
      setError(null);

      // First try to fetch from API (for real documents with UUIDs)
      try {
        const response = await documentService.getDocumentById(docId);
        console.log('🟢 API Response:', response);
        
        if (response && response.data) {
          // Normalize API data to match expected field names
          const apiData = response.data;
          const normalizedData = {
            docid: apiData.docid || apiData.id,
            docname: apiData.docname || apiData.name || apiData.title,
            doctype: apiData.doctype || apiData.type || apiData.category,
            docprice: apiData.docprice ?? apiData.price ?? 0,
            docduration: apiData.docduration || apiData.duration || apiData.processing_time || 'N/A',
            docimage: apiData.docimage || apiData.docpicture || apiData.image,
            docrequirements: apiData.docrequirements || apiData.requirements || [],
            docsteps: apiData.docsteps || apiData.steps || [],
            relateddocs: apiData.relateddocs || apiData.related_docs || [],
            tips: apiData.tips || [],
            // Keep original data as well
            ...apiData
          };
          
          // Accept API data if it has at least a name (show whatever data is available)
          if (normalizedData.docname) {
            setData(normalizedData);
            setRelatedDocuments(response.relatedDocuments || []);
            setUsingMockData(false);
            console.log('✅ Loaded document from API:', normalizedData.docname);
            setLoading(false);
            return;
          }
        }
      } catch (apiError) {
        console.log('🟡 API fetch failed, trying mock data:', apiError.message);
      }

      // Fall back to mock data for numeric IDs
      const mockDoc = mockDocuments[docId];
      if (mockDoc) {
        setData(mockDoc);
        // Get related documents from mock
        const related = (mockDoc.relateddocs || []).map(id => mockRelatedDocs[id]).filter(Boolean);
        setRelatedDocuments(related);
        setUsingMockData(true);
        console.log('✅ Loaded document from mock data:', mockDoc.docname);
      } else {
        setError('Document not found');
      }
      
      setLoading(false);
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

        {/* Breadcrumbs */}
        <nav className="text-sm text-slate-500 mb-4">
          <Link to="/" className="hover:underline hover:text-primary">Home</Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="hover:underline">{doc.doctype || doc.category}</span>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-primary font-medium">{doc.docname || doc.title}</span>
        </nav>

        {/* Hero Section with Document Image */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="flex flex-col md:flex-row">
            {/* Document Image */}
            {doc.docimage && (
              <div className="md:w-72 lg:w-80 flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-50 p-6 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/5 rounded-xl transform rotate-3"></div>
                  <img 
                    src={doc.docimage} 
                    alt={doc.docname}
                    className="relative w-48 h-auto object-contain drop-shadow-lg rounded-lg"
                  />
                </div>
              </div>
            )}
            
            {/* Document Info */}
            <div className="flex-1 p-6 md:p-8">
              {/* Document Type Badge */}
              <div className="mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  {doc.doctype || 'Document'}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                {doc.docname || doc.title}
              </h1>

              {/* Meta info cards */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Processing Time</p>
                    <p className="font-semibold text-slate-800">{doc.docduration || doc.processingTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Application Cost</p>
                    <p className="font-semibold text-slate-800">{formatPrice(doc.docprice) || doc.cost}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Documents Needed</p>
                    <p className="font-semibold text-slate-800">{doc.docrequirements?.length || 0} items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left column - Main Content */}
          <main className="flex flex-col gap-6">
            
            {/* Required Documents Section - Beautiful Card Grid */}
            {doc.docrequirements && doc.docrequirements.length > 0 && (
              <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Required Documents</h2>
                    <p className="text-sm text-slate-500">Prepare these documents before starting</p>
                  </div>
                </div>

                <div className="grid gap-3">
                  {doc.docrequirements.map((req, idx) => (
                    <div 
                      key={idx} 
                      className="group relative bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-lg p-4 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        {/* Document Number Badge */}
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-sm">
                          {idx + 1}
                        </div>
                        
                        {/* Document Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-slate-800 group-hover:text-primary transition-colors">
                              {req.name}
                            </h3>
                            {/* Copy Count Badge */}
                            {req.copies && (
                              <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                {req.copies} {req.copies === 1 ? 'copy' : 'copies'}
                              </span>
                            )}
                          </div>
                          
                          {req.description && (
                            <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                              {req.description}
                            </p>
                          )}
                          
                          {/* Document Type Tag */}
                          {req.type && (
                            <div className="mt-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                req.type === 'original' 
                                  ? 'bg-green-100 text-green-700' 
                                  : req.type === 'certified_copy'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {req.type === 'original' && '✓ Original Required'}
                                {req.type === 'certified_copy' && '📋 Certified Copy'}
                                {req.type === 'photocopy' && '📄 Photocopy OK'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Documents Summary */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">
                      <strong className="text-slate-800">{doc.docrequirements.length}</strong> documents required
                    </span>
                    <span className="text-slate-500">
                      Total copies needed: <strong className="text-slate-700">
                        {doc.docrequirements.reduce((sum, req) => sum + (req.copies || 1), 0)}
                      </strong>
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Steps Section */}
            <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Steps to Complete</h2>
                  <p className="text-sm text-slate-500">Follow these steps in order</p>
                </div>
              </div>

              <div className="space-y-4">
                {(doc.docsteps || []).map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    {/* Step Number with Line */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-sm">
                        {idx + 1}
                      </div>
                      {idx < (doc.docsteps?.length || 0) - 1 && (
                        <div className="w-0.5 h-full bg-emerald-200 mt-2 min-h-[20px]"></div>
                      )}
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1 pb-4">
                      <p className="text-slate-700 leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
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
            </div>

            {/* Report Issue (User) / Update Document (Admin) */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              {isAdmin ? (
                <>
                  <h4 className="text-base font-semibold text-slate-900 mb-2">Update Document</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    Edit and update the information for this document.
                  </p>
                  <button
                    onClick={() => navigate(`/admin/document/${docId}/update`)}
                    className="w-full py-2.5 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    ✏️ Update Document
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
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
                onClick={() => navigate('/contact')}
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