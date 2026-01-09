import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Home, Clock, DollarSign, FileText, CheckCircle, AlertCircle, HelpCircle, ChevronRight, Sparkles } from 'lucide-react';
import SignInModal from '../components/SignInModal';
import { useAuth } from '../context/AuthContext';
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
        type: 'original'
      },
      {
        name: 'Birth Certificate (Extrait de Naissance)',
        description: 'Recent extract less than 3 months old - "Extrait de naissance spécial n°12"',
        type: 'original'
      },
      {
        name: 'Residence Certificate (Certificat de Résidence)',
        description: 'Proof of residence less than 3 months old from your APC',
        type: 'original'
      },
      {
        name: 'Biometric Photos',
        description: 'Recent passport-size photos (4x3.5 cm) with white background',
        type: 'original'
      },
      {
        name: 'Military Service Document (for males 19-30)',
        description: 'Military service certificate or exemption document',
        type: 'original'
      },
      {
        name: 'Previous Passport (if renewal)',
        description: 'Your old passport if this is a renewal',
        type: 'original'
      },
      {
        name: 'Payment Receipt',
        description: 'Proof of payment of 6,000 DA passport fee (fiscal stamp)',
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
        type: 'original'
      },
      {
        name: 'Residence Certificate (Certificat de Résidence)',
        description: 'Recent proof of residence from your APC',
        type: 'original'
      },
      {
        name: 'Biometric Photos',
        description: 'Recent passport-size photos (3.5x4.5 cm) with white background',
        type: 'original'
      },
      {
        name: 'Blood Type Certificate',
        description: 'Official blood group certificate from a hospital or clinic',
        type: 'original'
      },
      {
        name: 'Old National ID (if renewal)',
        description: 'Previous ID card for renewal applications',
        type: 'original'
      },
      {
        name: 'Fiscal Stamp (Timbre Fiscal)',
        description: '500 DA fiscal stamp available at post offices',
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
        type: 'original'
      },
      {
        name: 'Family Book (Livret de Famille)',
        description: 'If requesting for a minor child',
        type: 'original'
      },
      {
        name: 'Authorization Letter',
        description: 'If someone else is requesting on your behalf',
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
        type: 'original'
      },
      {
        name: 'Baccalaureate Certificate (Copies)',
        description: 'Certified copies of BAC certificate',
        type: 'certified_copy'
      },
      {
        name: 'Birth Certificate (Extrait de Naissance)',
        description: 'Recent extract less than 3 months old',
        type: 'original'
      },
      {
        name: 'National ID Card',
        description: 'Valid biometric national ID',
        type: 'original'
      },
      {
        name: 'National ID Card (Copies)',
        description: 'Photocopies of both sides of ID',
        type: 'photocopy'
      },
      {
        name: 'Biometric Photos',
        description: 'Recent passport-size photos',
        type: 'original'
      },
      {
        name: 'Medical Certificate',
        description: 'General health certificate from approved doctor',
        type: 'original'
      },
      {
        name: 'Pre-registration Confirmation',
        description: 'Printed confirmation from orientation platform',
        type: 'original'
      },
      {
        name: 'Residence Certificate',
        description: 'For students requesting university housing',
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
        type: 'original'
      },
      {
        name: 'National ID Card (Copies)',
        description: 'Photocopies of both sides',
        type: 'photocopy'
      },
      {
        name: 'Birth Certificate (Extrait de Naissance)',
        description: 'Recent extract less than 3 months old',
        type: 'original'
      },
      {
        name: 'Medical Certificate',
        description: 'Medical fitness certificate from approved doctor',
        type: 'original'
      },
      {
        name: 'Blood Type Certificate',
        description: 'Official blood group certificate',
        type: 'original'
      },
      {
        name: 'Biometric Photos',
        description: 'Recent passport-size photos',
        type: 'original'
      },
      {
        name: 'Driving School Certificate',
        description: 'Certificate of completion from auto-école',
        type: 'original'
      },
      {
        name: 'Theory Exam Pass Certificate',
        description: 'Proof of passing the code exam',
        type: 'original'
      },
      {
        name: 'Fiscal Stamps',
        description: 'Required fiscal stamps for application',
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
        type: 'original'
      },
      {
        name: 'National ID Card (Copies)',
        description: 'Certified copies of ID card',
        type: 'certified_copy'
      },
      {
        name: 'Birth Certificate (Extrait de Naissance)',
        description: 'Recent extract less than 3 months old',
        type: 'original'
      },
      {
        name: 'Residence Certificate',
        description: 'Proof of residence less than 3 months old',
        type: 'original'
      },
      {
        name: 'Criminal Record Certificate (Casier Judiciaire)',
        description: 'Bulletin n°3 less than 3 months old',
        type: 'original'
      },
      {
        name: 'Business Premises Lease or Title',
        description: 'Lease contract or property deed for business location',
        type: 'certified_copy'
      },
      {
        name: 'Company Statutes (for SARL/SPA)',
        description: 'Notarized company formation documents',
        type: 'original'
      },
      {
        name: 'Capital Deposit Certificate',
        description: 'Bank certificate showing deposited capital (for companies)',
        type: 'original'
      },
      {
        name: 'Biometric Photos',
        description: 'Recent passport-size photos',
        type: 'original'
      },
      {
        name: 'CNRC Application Form',
        description: 'Completed registration form from CNRC',
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
  const { isAuthenticated, user } = useAuth();
  const [data, setData] = useState(null);
  const [relatedDocuments, setRelatedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Check if user is admin (by role, not by route)
  const isAdmin = isAuthenticated && user?.role === 'admin';

  useEffect(() => {
    async function fetchDocument() {
      setLoading(true);
      setError(null);

      // First try to fetch from API (for real documents with UUIDs)
      try {
        const response = await documentService.getDocumentById(docId);
        console.log('🟢 API Response:', response);
        console.log('🔵 Related Documents from API:', response?.relatedDocuments);
        
        if (response && response.data) {
          // Normalize API data to match expected field names
          const apiData = response.data;
          console.log('📋 API Data docrequirements:', apiData.docrequirements);
          console.log('📋 API Data requirements:', apiData.requirements);
          console.log('📋 API Data full:', apiData);
          
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
          
          console.log('📋 Normalized docrequirements:', normalizedData.docrequirements, 'Length:', normalizedData.docrequirements?.length);
          
          // Accept API data if it has at least a name (show whatever data is available)
          if (normalizedData.docname) {
            setData(normalizedData);
            const relatedDocsFromAPI = response.relatedDocuments || [];
            console.log('🟡 Setting related documents:', relatedDocsFromAPI, 'Length:', relatedDocsFromAPI.length);
            setRelatedDocuments(relatedDocsFromAPI);
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
    if (isAuthenticated) {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/60">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </Link>
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

  // Helper to format duration - shows weeks/months if applicable, otherwise days
  const formatDuration = (duration) => {
    console.log('🕒 formatDuration called with:', duration, 'Type:', typeof duration);
    
    if (!duration || duration === 'N/A') return duration;
    
    // Convert to string if it's not already
    const durationStr = String(duration);
    console.log('🕒 Duration as string:', durationStr);
    
    // Check if it's just a plain number (e.g., "30", "7", "14")
    if (/^\d+$/.test(durationStr)) {
      const days = parseInt(durationStr);
      console.log('🕒 Plain number detected:', days);
      
      // Check for months first (30 days = 1 month)
      if (days % 30 === 0) {
        const months = days / 30;
        const result = `${months} ${months === 1 ? 'month' : 'months'}`;
        console.log('🕒 Returning months:', result);
        return result;
      }
      
      // Check for weeks (7 days = 1 week)
      if (days % 7 === 0) {
        const weeks = days / 7;
        const result = `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
        console.log('🕒 Returning weeks:', result);
        return result;
      }
      
      // Return with "days" label
      const result = `${days} ${days === 1 ? 'day' : 'days'}`;
      console.log('🕒 Returning days:', result);
      return result;
    }
    
    // Check if duration is in format like "7 days", "14 days", "30 days", etc.
    const match = durationStr.match(/^(\d+)\s*days?$/i);
    console.log('🕒 Single day match:', match);
    
    if (match) {
      const days = parseInt(match[1]);
      console.log('🕒 Parsed days:', days);
      
      // Check for months first (30 days = 1 month)
      if (days % 30 === 0) {
        const months = days / 30;
        const result = `${months} ${months === 1 ? 'month' : 'months'}`;
        console.log('🕒 Returning months:', result);
        return result;
      }
      
      // Check for weeks (7 days = 1 week)
      if (days % 7 === 0) {
        const weeks = days / 7;
        const result = `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
        console.log('🕒 Returning weeks:', result);
        return result;
      }
      
      // Return with "days" label
      const result = `${days} ${days === 1 ? 'day' : 'days'}`;
      console.log('🕒 Returning days:', result);
      return result;
    }
    
    // Check for range format like "7-10 days", "14-21 days", "30-60 days"
    const rangeMatch = durationStr.match(/^(\d+)\s*-\s*(\d+)\s*days?$/i);
    console.log('🕒 Range match:', rangeMatch);
    
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1]);
      const end = parseInt(rangeMatch[2]);
      
      // Check for months first
      if (start % 30 === 0 && end % 30 === 0) {
        const startMonths = start / 30;
        const endMonths = end / 30;
        return `${startMonths}-${endMonths} ${endMonths === 1 ? 'month' : 'months'}`;
      }
      
      // Check for weeks
      if (start % 7 === 0 && end % 7 === 0) {
        const startWeeks = start / 7;
        const endWeeks = end / 7;
        return `${startWeeks}-${endWeeks} ${endWeeks === 1 ? 'week' : 'weeks'}`;
      }
      
      // Return with "days" label
      return `${start}-${end} days`;
    }
    
    console.log('🕒 No match, returning original:', durationStr);
    return durationStr;
  };

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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-5 py-6 pt-28 md:pt-24">

        {/* Breadcrumbs */}
        <nav className="text-sm text-white/50 mb-6 flex items-center gap-2 flex-wrap overflow-hidden">
          <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-emerald-400 transition-colors">{doc.doctype || doc.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-emerald-400 font-medium">{doc.docname || doc.title}</span>
        </nav>

        {/* Hero Section with Document Image */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden mb-6">
          <div className="flex flex-col md:flex-row gap-0">
            {/* Document Image */}
            {doc.docimage && (
              <div className="w-full md:w-72 lg:w-80 flex-shrink-0 bg-gradient-to-br from-emerald-900/50 to-slate-900/50 p-4 md:p-6 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-xl transform rotate-3"></div>
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
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {doc.doctype || 'Document'}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
                {doc.docname || doc.title}
              </h1>

              {/* Meta info cards */}
              <div className="flex flex-wrap gap-3 md:gap-4">
                <div className="flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-3 md:px-4 py-2 md:py-3 border border-white/10 flex-1 min-w-[140px] sm:flex-none">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-white/50">Processing Time</p>
                    <p className="font-semibold text-white text-sm md:text-base truncate">{formatDuration(doc.docduration || doc.processingTime)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-3 md:px-4 py-2 md:py-3 border border-white/10 flex-1 min-w-[140px] sm:flex-none">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-white/50">Application Cost</p>
                    <p className="font-semibold text-white text-sm md:text-base truncate">{formatPrice(doc.docprice) || doc.cost}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-3 md:px-4 py-2 md:py-3 border border-white/10 flex-1 min-w-[140px] sm:flex-none">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-white/50">Documents Needed</p>
                    <p className="font-semibold text-white text-sm md:text-base">{(doc.relateddocs?.length || relatedDocuments?.length || 0)} items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-4 md:gap-6">
          {/* Left column - Main Content */}
          <main className="flex flex-col gap-6">
            
            {/* Required Documents Section */}
            {doc.docrequirements && doc.docrequirements.length > 0 && (
              <section className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Required Documents</h2>
                    <p className="text-sm text-white/50">Prepare these documents before starting</p>
                  </div>
                </div>

                <div className="grid gap-3">
                  {doc.docrequirements.map((req, idx) => (
                    <div 
                      key={idx} 
                      className="group relative bg-white/5 border border-white/10 rounded-xl p-4 hover:border-emerald-500/30 hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        {/* Document Number Badge */}
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-lg">
                          {idx + 1}
                        </div>
                        
                        {/* Document Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                              {req.name}
                            </h3>
                          </div>
                          
                          {req.description && (
                            <p className="mt-1 text-sm text-white/50 leading-relaxed">
                              {req.description}
                            </p>
                          )}
                          
                          {/* Document Type Tag */}
                          {req.type && (
                            <div className="mt-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                req.type === 'original' 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                  : req.type === 'certified_copy'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-white/10 text-white/60 border border-white/20'
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
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center text-sm">
                    <span className="text-white/60">
                      <strong className="text-white">{doc.docrequirements.length}</strong> documents required
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Steps Section */}
            <section className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Steps to Complete</h2>
                  <p className="text-sm text-white/50">Follow these steps in order</p>
                </div>
              </div>

              <div className="space-y-4">
                {(doc.docsteps || []).map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    {/* Step Number with Line */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-lg">
                        {idx + 1}
                      </div>
                      {idx < (doc.docsteps?.length || 0) - 1 && (
                        <div className="w-0.5 h-full bg-emerald-500/30 mt-2 min-h-[20px]"></div>
                      )}
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1 pb-4">
                      <p className="text-white/80 leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* Right column - Sidebar */}
          <aside className="flex flex-col gap-4 lg:order-none order-first">
            {/* Quick Information */}
            <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-5 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base font-semibold">Quick Information</h3>
              </div>
              <div className="flex justify-between text-sm py-3 border-b border-white/20">
                <span className="opacity-80">Processing Time</span>
                <strong className="font-medium">{formatDuration(doc.docduration || doc.processingTime)}</strong>
              </div>
              <div className="flex justify-between text-sm py-3">
                <span className="opacity-80">Application Cost</span>
                <strong className="font-medium">{formatPrice(doc.docprice) || doc.cost}</strong>
              </div>
            </div>

            {/* Report Issue (User) / Update Document (Admin) */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
              {isAdmin ? (
                <>
                  <h4 className="text-base font-semibold text-white mb-2">Update Document</h4>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">
                    Edit and update the information for this document.
                  </p>
                  <button
                    onClick={() => navigate(`/admin/document/${docId}/update`)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                  >
                    ✏️ Update Document
                  </button>
                </>
              ) : (
                <>
                  <h4 className="text-base font-semibold text-white mb-2">Report an Issue</h4>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">
                    Please report any errors or unclear information found in this document, and we will ensure they are handled appropriately.
                  </p>
                  <button
                    onClick={handleReportIssue}
                    className="w-full py-3 px-4 bg-white/10 text-white border border-white/20 rounded-xl text-sm font-medium hover:bg-white/20 transition-all"
                  >
                    ✏️ Report Issue
                  </button>
                </>
              )}
            </div>

            {/* Required Documents */}
            {relatedDocuments.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
                <h4 className="text-base font-semibold text-white mb-3">Required Documents</h4>
                <ul className="space-y-2">
                  {relatedDocuments.map((relDoc) => (
                    <li key={relDoc.docid}>
                      <Link
                        to={`/document/${relDoc.docid}`}
                        className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2"
                      >
                        <ChevronRight className="w-4 h-4" />
                        {relDoc.docname}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Need Help */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <h4 className="text-base font-semibold text-white">Need Help?</h4>
              </div>
              <p className="text-sm text-white/50 leading-relaxed mb-4">
                Contact our support team for assistance with your application.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
              >
                Contact Support
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSuccess={handleSignInSuccess}
      />
    </div>
  );
}
