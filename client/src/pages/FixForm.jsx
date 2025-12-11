import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, List, DollarSign, Clock, Check, X } from 'lucide-react';
import NavBar from '../components/NavBar';

// ---------------- Success Modal ----------------
const SuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scaleIn">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounceIn">
          <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
        </div>
        <h3 className="mb-3" style={{ fontSize: 'clamp(22px, 3vw, 26px)', fontFamily: 'Source Serif Pro', fontWeight: 700, color: '#273248' }}>
          Report Submitted!
        </h3>
        <p className="mb-8" style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', fontFamily: 'Lato', color: '#61646b', lineHeight: 1.6 }}>
          Your issue has been reported successfully. Our team will review it shortly.
        </p>
        <button
          onClick={onClose}
          className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
          style={{ fontFamily: 'Lato', fontSize: 'clamp(16px, 1.8vw, 18px)' }}
        >
          Done
        </button>
      </div>
    </div>
  </div>
);

// ---------------- Cancel Modal ----------------
const CancelModal = ({ onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scaleIn">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounceIn">
          <X className="w-10 h-10 text-red-600" strokeWidth={3} />
        </div>
        <h3 className="mb-3" style={{ fontSize: 'clamp(22px, 3vw, 26px)', fontFamily: 'Source Serif Pro', fontWeight: 700, color: '#273248' }}>
          Cancel Report?
        </h3>
        <p className="mb-8" style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', fontFamily: 'Lato', color: '#61646b', lineHeight: 1.6 }}>
          Are you sure you want to cancel? All your entered data will be lost.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all hover:border-gray-400"
            style={{ fontFamily: 'Lato', fontSize: 'clamp(15px, 1.6vw, 17px)' }}
          >
            No, Keep It
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg"
            style={{ fontFamily: 'Lato', fontSize: 'clamp(15px, 1.6vw, 17px)' }}
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ---------------- ReportIssuePage ----------------
const ReportIssuePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const documentInfo = location.state?.documentInfo || {};

  const [formData, setFormData] = useState({
    steps: '',
    documents: '',
    price: '',
    processingTime: ''
  });

  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEmptyFieldError, setShowEmptyFieldError] = useState(false);

  // Validation functions
  const validatePrice = (price) => {
    if (!price.trim()) return ''; // Optional field
    if (!/^\d+(\.\d{1,2})?$/.test(price)) return 'Price must be a valid number (e.g., 100 or 99.99)';
    return '';
  };

  const validateProcessingTime = (time) => {
    if (!time.trim()) return ''; // Optional field
    // Accept formats like: "1 day", "2 weeks", "3 months", "4 hours"
    const timeRegex = /^\d+\s*(day|week|month|year|hour|minute)s?$/i;
    if (!timeRegex.test(time)) return 'Enter valid time (e.g., "2 days", "1 week", "3 months")';
    return '';
  };

  const handleStepsChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, steps: value });
    setShowEmptyFieldError(false); // Hide error when user starts typing
  };

  const handleDocumentsChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, documents: value });
    setShowEmptyFieldError(false); // Hide error when user starts typing
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, price: value });
    setErrors({ ...errors, price: validatePrice(value) });
    setShowEmptyFieldError(false); // Hide error when user starts typing
  };

  const handleProcessingTimeChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, processingTime: value });
    setErrors({ ...errors, processingTime: validateProcessingTime(value) });
    setShowEmptyFieldError(false); // Hide error when user starts typing
  };

  // Check if at least one field has content
  const hasAtLeastOneFieldFilled = () => {
    return Object.values(formData).some(value => value.trim() !== '');
  };

  const validateAll = () => {
    const newErrors = {
      price: validatePrice(formData.price),
      processingTime: validateProcessingTime(formData.processingTime)
    };
    
    setErrors(newErrors);
    
    // Check if at least one field is filled
    if (!hasAtLeastOneFieldFilled()) {
      setShowEmptyFieldError(true);
      return false;
    }
    
    // Check if validation errors exist
    return Object.values(newErrors).every(error => error === '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateAll()) {
      console.log('Issue report submitted:', formData);
      setShowSuccessModal(true);
    }
  };

  const handleCancel = () => setShowCancelModal(true);

  const confirmCancel = () => {
    setFormData({
      steps: '',
      documents: '',
      price: '',
      processingTime: ''
    });
    setErrors({});
    setShowEmptyFieldError(false);
    setShowCancelModal(false);
    navigate(-1);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setFormData({
      steps: '',
      documents: '',
      price: '',
      processingTime: ''
    });
    setErrors({});
    setShowEmptyFieldError(false);
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="mb-3" style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontFamily: 'Source Serif Pro', fontWeight: 700, lineHeight: 1.2, color: '#37a331' }}>
              Report an Issue
            </h1>
            <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', fontFamily: 'Lato', fontWeight: 400, lineHeight: 1.5, color: '#61646b' }}>
              Help us improve! Report any problems with the document information.
            </p>
          
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Steps Issue */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <label className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <List className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontFamily: 'Source Serif Pro', fontWeight: 600, color: '#273248' }}>
                    Steps
                  </h3>
                </div>
                <textarea
                  value={formData.steps}
                  onChange={handleStepsChange}
                  placeholder="Report issues with procedure steps (optional)"
                  rows="3"
                  className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none`}
                  style={{ fontFamily: 'Lato', fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.steps.length}/1000 characters
                </p>
              </label>
            </div>

            {/* Documents Issue */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <label className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontFamily: 'Source Serif Pro', fontWeight: 600, color: '#273248' }}>
                    Documents
                  </h3>
                </div>
                <textarea
                  value={formData.documents}
                  onChange={handleDocumentsChange}
                  placeholder="Report missing or incorrect documents (optional)"
                  rows="3"
                  className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none`}
                  style={{ fontFamily: 'Lato', fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.documents.length}/1000 characters
                </p>
              </label>
            </div>

            {/* Price Issue */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <label className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontFamily: 'Source Serif Pro', fontWeight: 600, color: '#273248' }}>
                    Price
                  </h3>
                </div>
                <textarea
                  value={formData.price}
                  onChange={handlePriceChange}
                  placeholder="Report incorrect fees or costs (optional)"
                  rows="3"
                  className={`w-full px-4 py-3 border-2 ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none`}
                  style={{ fontFamily: 'Lato', fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.price.length}/1000 characters
                </p>
              </label>
            </div>

            {/* Processing Time Issue */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <label className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontFamily: 'Source Serif Pro', fontWeight: 600, color: '#273248' }}>
                    Processing Time
                  </h3>
                </div>
                <textarea
                  value={formData.processingTime}
                  onChange={handleProcessingTimeChange}
                  placeholder="Report incorrect duration estimates (optional)"
                  rows="3"
                  className={`w-full px-4 py-3 border-2 ${errors.processingTime ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none`}
                  style={{ fontFamily: 'Lato', fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                />
                {errors.processingTime && <p className="text-red-500 text-xs mt-1">{errors.processingTime}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.processingTime.length}/1000 characters
                </p>
              </label>
            </div>

            {/* Error message if no fields are filled (ONLY shows on submit attempt) */}
            {showEmptyFieldError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-medium">
                  Please fill at least one field to submit your report.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3.5 rounded-full border-2 border-green-600 text-green-600 font-semibold hover:bg-green-50 transition-all hover:border-green-700 hover:text-green-700 active:scale-95 shadow-sm"
                style={{ fontFamily: 'Lato', fontSize: 'clamp(15px, 2vw, 17px)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3.5 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                style={{ fontFamily: 'Lato', fontSize: 'clamp(15px, 2vw, 17px)' }}
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>

        {/* Modals */}
        {showSuccessModal && <SuccessModal onClose={closeSuccessModal} />}
        {showCancelModal && <CancelModal onClose={() => setShowCancelModal(false)} onConfirm={confirmCancel} />}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            transform: scale(0.9);
            opacity: 0;
          }
          to { 
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes bounceIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.5s ease-out;
        }
      `}</style>
    </>
  );
};

export default ReportIssuePage;