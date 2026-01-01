import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, List, DollarSign, Clock, Check, X, Link as LinkIcon, ChevronDown } from 'lucide-react';
import fixService from '../services/fixService';
import Swal from 'sweetalert2';

// Utility function to convert time strings to integer days
const convertTimeToInteger = (timeString) => {
  if (!timeString) return undefined;

  const match = timeString.match(/^(\d+)\s*(day|week|month|year|hour|minute)s?$/i);
  if (!match) return undefined;

  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();

  // Convert everything to days
  switch (unit) {
    case 'minute':
      return Math.ceil(value / (24 * 60)); // minutes to days
    case 'hour':
      return Math.ceil(value / 24); // hours to days
    case 'day':
      return value;
    case 'week':
      return value * 7;
    case 'month':
      return value * 30;
    case 'year':
      return value * 365;
    default:
      return value;
  }
};

// ---------------- MultiSelectDropdown Component ----------------
const MultiSelectDropdown = ({ label, options, selected, onChange, error = false }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleOption = (docId) => {
    let updated = [...selected];
    if (updated.includes(docId)) {
      updated = updated.filter((id) => id !== docId);
    }
    else {
      updated.push(docId);
    }
    onChange(updated);
  };

  const removeOption = (docId, e) => {
    e.stopPropagation();
    onChange(selected.filter((id) => id !== docId));
  };

  // Helper to get document name by ID
  const getDocNameById = (docId) => {
    const doc = options.find(opt => opt.id === docId);
    return doc ? doc.name : docId;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <LinkIcon className="w-5 h-5 text-green-600" />
        </div>
        <h3 style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontFamily: 'Source Serif Pro', fontWeight: 600, color: '#273248' }}>
          {label}
        </h3>
      </div>

      <div
        className={`w-full px-4 py-3 border-2 ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg cursor-pointer bg-white hover:border-green-500 transition-colors min-h-[50px] flex justify-between items-center`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-wrap gap-2 flex-1">
          {selected.length === 0 && (
            <span className="text-gray-400" style={{ fontFamily: 'Lato', fontSize: 'clamp(14px, 1.5vw, 16px)' }}>
              Select related documents...
            </span>
          )}
          {selected.map((docId) => (
            <span
              key={docId}
              className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium"
            >
              {getDocNameById(docId)}
              <button
                type="button"
                onClick={(e) => removeOption(docId, e)}
                className="text-green-700 hover:text-green-900 ml-1"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <ChevronDown className={`w-4 h-4 ${error ? 'text-red-500' : 'text-gray-500'} ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {open && (
        <div className="absolute w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-lg max-h-60 overflow-auto z-50">
          {options.map((doc) => (
            <div
              key={doc.id}
              className={`px-4 py-3 cursor-pointer transition-colors flex justify-between items-center ${selected.includes(doc.id)
                ? 'bg-green-50 text-green-700'
                : 'hover:bg-gray-50'
                }`}
              onClick={() => toggleOption(doc.id)}
              style={{ fontFamily: 'Lato', fontSize: 'clamp(14px, 1.5vw, 16px)' }}
            >
              <span>{doc.name}</span>
              {selected.includes(doc.id) && (
                <Check className="w-4 h-4 text-green-600" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------- ReportIssuePage ----------------
const ReportIssuePage = () => {
  const navigate = useNavigate();
  const { docid } = useParams(); // Get docid from URL parameter

  console.log('📋 Document ID from URL:', docid);

  const [formData, setFormData] = useState({
    steps: [''], // Changed to array
    documents: [],
    price: '',
    processingTime: ''
  });

  const [availableDocuments, setAvailableDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);

  const [errors, setErrors] = useState({});
  const [showEmptyFieldError, setShowEmptyFieldError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available documents AND current document details on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingDocuments(true);

        // 1. Fetch list of all documents for the dropdown
        const docsResponse = await fetch('http://localhost:8000/api/documents');
        const docsData = await docsResponse.json();

        if (docsData.documents && Array.isArray(docsData.documents)) {
          setAvailableDocuments(docsData.documents.map(doc => ({
            id: doc.docid,
            name: doc.docname
          })));
        }

        // 2. Fetch the SPECIFIC document we are fixing to pre-fill the form
        if (docid) {
          const docResponse = await fetch(`http://localhost:8000/api/documents/${docid}`);
          const docData = await docResponse.json();

          if (docData.document) { // Assuming structure is { document: { ... } }
            const doc = docData.document;
            // Only pre-fill if the user hasn't typed anything yet (though on mount they haven't)
            // We use functional updates or just set it directly since it's mount.

            // Parse steps if they are a string, or use as is if array
            let parsedSteps = [''];
            if (Array.isArray(doc.steps)) {
              parsedSteps = doc.steps;
            } else if (typeof doc.steps === 'string') {
              try {
                parsedSteps = JSON.parse(doc.steps);
              } catch (e) {
                // If not JSON, maybe just a single string step? split by newline?
                // For now, treat as single step or try splitting if it looks like a list
                parsedSteps = [doc.steps];
              }
            }

            setFormData(prev => ({
              ...prev,
              steps: parsedSteps.length > 0 ? parsedSteps : [''],
              price: doc.docprice ? doc.docprice.toString() : '',
              processingTime: doc.duration ? doc.duration.toString() : '',
              // We probably don't pre-fill "documents" (related docs) unless we want to, 
              // but typically 'documents' in fix form means "documents required that are WRONG".
              // If the user wants to say "You missed the Birth Certificate", they add it.
              // Pre-filling related docs might be confusing if the field is for "What is wrong".
              // However, if the field is "Related Documents List", then pre-filling is good.
              // Let's assume for now we leave Documents empty so they can add the MISSING ones,
              // OR we pre-fill it so they can remove WRONG ones. 
              // Given the prompt "correct step 2", pre-filling seems to be the mental model of "Editing".
              // Let's pre-fill related docs too if available.
              documents: Array.isArray(doc.relateddocs) ? doc.relateddocs : []
            }));
          }
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingDocuments(false);
      }
    };

    fetchData();
  }, [docid]);

  // Validation functions
  const validatePrice = (price) => {
    if (!price.trim()) return '';
    if (!/^\d+(\.\d{1,2})?$/.test(price)) return 'Price must be a valid number (e.g., 100 or 99.99)';
    return '';
  };

  const validateProcessingTime = (time) => {
    if (!time.trim()) return '';
    const timeRegex = /^\d+\s*(day|week|month|year|hour|minute)s?$/i;
    if (!timeRegex.test(time)) return 'Enter valid time (e.g., "2 days", "1 week", "3 months")';
    return '';
  };

  const handleDocumentsChange = (updated) => {
    setFormData({ ...formData, documents: updated });
    setShowEmptyFieldError(false);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, price: value });
    setErrors({ ...errors, price: validatePrice(value) });
    setShowEmptyFieldError(false);
  };

  const handleProcessingTimeChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, processingTime: value });
    setErrors({ ...errors, processingTime: validateProcessingTime(value) });
    setShowEmptyFieldError(false);
  };

  const hasAtLeastOneFieldFilled = () => {
    // Check if any string field is non-empty OR if arrays have valid items
    return Object.entries(formData).some(([key, value]) => {
      if (key === 'steps') {
        // Check if there is at least one non-empty step
        return Array.isArray(value) && value.some(step => step.trim() !== '');
      }
      if (Array.isArray(value)) return value.length > 0;
      return value.trim() !== '';
    });
  };

  const validateAll = () => {
    const newErrors = {
      price: validatePrice(formData.price),
      processingTime: validateProcessingTime(formData.processingTime)
    };

    setErrors(newErrors);

    if (!hasAtLeastOneFieldFilled()) {
      setShowEmptyFieldError(true);
      return false;
    }

    return Object.values(newErrors).every(error => error === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);
    console.log('📤 Submitting fix for document:', docid);
    console.log('📤 Form data:', formData);

    // Convert processing time to integer (days) before sending
    // Filter out empty steps and stringify
    const validSteps = formData.steps.filter(s => s.trim() !== '');

    const processedFormData = {
      ...formData,
      processingTime: formData.processingTime
        ? convertTimeToInteger(formData.processingTime)
        : formData.processingTime,
      documents: JSON.stringify(formData.documents), // Convert array to string
      steps: validSteps.length > 0 ? JSON.stringify(validSteps) : '' // Only send if valid steps exist
    };

    // If no valid steps but steps was intended (touched), maybe send empty string or null? 
    // The previous logic for hasAtLeastOneFieldFilled ensures we have *something* to send.

    console.log('📤 Processed form data (time converted to days):', processedFormData);

    try {
      const response = await fixService.submitFix(docid, processedFormData);

      if (response.success) {
        console.log('✅ Fix submitted successfully');
        Swal.fire({
          title: 'Report Submitted!',
          text: 'Your issue has been reported successfully. Our team will review it shortly.',
          icon: 'success',
          confirmButtonColor: '#37a331',
          confirmButtonText: 'Done'
        }).then(() => {
          closeSuccessModal();
        });
      } else {
        console.error('❌ Fix submission failed:', response.message);
        Swal.fire('Error!', response.message || 'Failed to submit fix. Please try again.', 'error');
      }
    } catch (error) {
      console.error('❌ Error submitting fix:', error);
      Swal.fire('Error!', 'An unexpected error occurred. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: 'Cancel Report?',
      text: "Are you sure you want to cancel? All your entered data will be lost.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'No, Keep It'
    }).then((result) => {
      if (result.isConfirmed) {
        confirmCancel();
      }
    });
  };

  const confirmCancel = () => {
    setFormData({
      steps: [''],
      documents: [],
      price: '',
      processingTime: ''
    });
    setErrors({});
    setShowEmptyFieldError(false);
    navigate(-1);
  };

  const closeSuccessModal = () => {
    setFormData({
      steps: [''],
      documents: [],
      price: '',
      processingTime: ''
    });
    setErrors({});
    setShowEmptyFieldError(false);
    navigate(-1);
  };

  return (
    <>
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="mb-3" style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontFamily: 'Source Serif Pro', fontWeight: 700, lineHeight: 1.2, color: '#37a331' }}>
              Report an Issue
            </h1>
            <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', fontFamily: 'Lato', fontWeight: 400, lineHeight: 1.5, color: '#61646b' }}>
              Help us improve! Report any problems with the document information.
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Steps Issue */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <label className="block mb-3">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <List className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontFamily: 'Source Serif Pro', fontWeight: 600, color: '#273248' }}>
                    Steps
                  </h3>
                </div>
                <div className="space-y-3">
                  {Array.isArray(formData.steps) && formData.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-8 h-10 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-500">{index + 1}.</span>
                      </div>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => {
                          const newSteps = [...formData.steps];
                          newSteps[index] = e.target.value;
                          setFormData({ ...formData, steps: newSteps });
                          setShowEmptyFieldError(false);
                        }}
                        placeholder={`Corrected Step ${index + 1}`}
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                        style={{ fontFamily: 'Lato', fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                      />
                      {formData.steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newSteps = formData.steps.filter((_, i) => i !== index);
                            setFormData({ ...formData, steps: newSteps });
                          }}
                          className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove step"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {!Array.isArray(formData.steps) && (
                    // Fallback if state somehow isn't an array yet (though we fix init state below)
                    <div className="text-red-500">Error: Steps should be a list.</div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, steps: [...(Array.isArray(formData.steps) ? formData.steps : []), ''] });
                    setShowEmptyFieldError(false);
                  }}
                  className="mt-4 w-full px-4 py-3 border-2 border-dashed border-green-300 text-green-600 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2 font-medium"
                  style={{ fontFamily: 'Lato', fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                >
                  <span className="text-xl">+</span> Add Step
                </button>
              </label>
            </div>

            {/* Documents Issue */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <MultiSelectDropdown
                label="Documents"
                options={availableDocuments}
                selected={formData.documents}
                onChange={handleDocumentsChange}
                error={false}
              />
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
                  maxLength="1000"
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
                  maxLength="1000"
                  className={`w-full px-4 py-3 border-2 ${errors.processingTime ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none`}
                  style={{ fontFamily: 'Lato', fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                />
                {errors.processingTime && <p className="text-red-500 text-xs mt-1">{errors.processingTime}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.processingTime.length}/1000 characters
                </p>
              </label>
            </div>

            {showEmptyFieldError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-medium">
                  Please fill at least one field to submit your report.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-full border-2 border-green-600 text-green-600 font-semibold hover:bg-green-50 transition-all hover:border-green-700 hover:text-green-700 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Lato', fontSize: 'clamp(15px, 2vw, 17px)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{ fontFamily: 'Lato', fontSize: 'clamp(15px, 2vw, 17px)' }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
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