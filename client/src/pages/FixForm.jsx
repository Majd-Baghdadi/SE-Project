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
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <LinkIcon className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-white">
          {label}
        </h3>
      </div>

      <div
        className={`w-full px-4 py-4 border ${error ? 'border-red-500/50' : 'border-white/20'} rounded-xl cursor-pointer bg-white/10 hover:bg-white/15 transition-all duration-300 min-h-[50px] flex justify-between items-center`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-wrap gap-2 flex-1">
          {selected.length === 0 && (
            <span className="text-white/40">
              Select related documents...
            </span>
          )}
          {selected.map((docId) => (
            <span
              key={docId}
              className="inline-flex items-center gap-1 bg-primary/20 text-emerald-300 px-3 py-1.5 rounded-full text-sm font-medium border border-primary/30"
            >
              {getDocNameById(docId)}
              <button
                type="button"
                onClick={(e) => removeOption(docId, e)}
                className="text-emerald-300 hover:text-red-400 ml-1 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <ChevronDown className={`w-4 h-4 ${error ? 'text-red-500' : 'text-white/40'} ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      {error && <p className="text-red-400 text-xs mt-2 ml-1">{error}</p>}

      {open && (
        <div className="absolute w-full bg-slate-800/95 backdrop-blur-xl border border-white/20 mt-2 rounded-xl shadow-2xl max-h-60 overflow-auto z-50">
          {options.map((doc) => (
            <div
              key={doc.id}
              className={`px-4 py-3 cursor-pointer transition-all duration-200 flex justify-between items-center border-b border-white/10 last:border-b-0 ${selected.includes(doc.id)
                ? 'bg-primary/20 text-emerald-300'
                : 'text-white/80 hover:bg-white/10'
                }`}
              onClick={() => toggleOption(doc.id)}
            >
              <span>{doc.name}</span>
              {selected.includes(doc.id) && (
                <Check className="w-4 h-4 text-emerald-400" />
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
  
  // Store original data to detect changes
  const [originalData, setOriginalData] = useState({
    steps: [''],
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

          if (docData.data) { 
            const doc = docData.data;
            const relatedDocs = docData.relatedDocuments || [];

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
            
            const initialData = {
              steps: parsedSteps.length > 0 ? parsedSteps : [''],
              price: doc.docprice ? doc.docprice.toString() : '',
              // Append 'days' if it's just a number to satisfy validation
              processingTime: doc.duration ? `${doc.duration} days` : '',
              documents: relatedDocs.map(d => d.docid)
            };

            setFormData(initialData);
            setOriginalData(initialData);
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

    // Calculate changes
    const changes = {};

    // Check Price
    if (formData.price !== originalData.price) {
      changes.price = formData.price;
    }

    // Check Processing Time
    if (formData.processingTime !== originalData.processingTime) {
      changes.processingTime = convertTimeToInteger(formData.processingTime);
    }

    // Check Steps
    const validSteps = formData.steps.filter(s => s.trim() !== '');
    const originalValidSteps = originalData.steps.filter(s => s.trim() !== '');
    
    if (JSON.stringify(validSteps) !== JSON.stringify(originalValidSteps)) {
      changes.steps = validSteps.length > 0 ? JSON.stringify(validSteps) : '';
    }

    // Check Documents
    const sortedCurrentDocs = [...formData.documents].sort();
    const sortedOriginalDocs = [...originalData.documents].sort();
    
    if (JSON.stringify(sortedCurrentDocs) !== JSON.stringify(sortedOriginalDocs)) {
      changes.documents = JSON.stringify(formData.documents);
    }

    // If no changes, alert user
    if (Object.keys(changes).length === 0) {
Swal.fire({
          title: 'No Changes',
          text: "You haven't made any changes to the document.",
          icon: 'info',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
      setIsSubmitting(false);
      return;
    }

    console.log('📤 Processed form data (changes only):', changes);

    try {
      const response = await fixService.submitFix(docid, changes);

      if (response.success) {
        console.log('✅ Fix submitted successfully');
        Swal.fire({
          title: 'Report Submitted!',
          text: 'Your issue has been reported successfully. Our team will review it shortly.',
          icon: 'success',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#10b981',
          confirmButtonText: 'Done'
        }).then(() => {
          closeSuccessModal();
        });
      } else {
        console.error('❌ Fix submission failed:', response.message);
        Swal.fire({
          title: 'Error!',
          text: response.message || 'Failed to submit fix. Please try again.',
          icon: 'error',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
      }
    } catch (error) {
      console.error('❌ Error submitting fix:', error);
      Swal.fire({
        title: 'Error!',
        text: 'An unexpected error occurred. Please try again.',
        icon: 'error',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#10b981'
      });
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
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'No, Keep It',
      background: '#1e293b',
      color: '#fff'
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background shapes like ContactUs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl"></div>
          
          {/* Geometric shapes */}
          <div className="absolute top-20 right-20 w-32 h-32 border border-white/10 rounded-2xl rotate-12 animate-float"></div>
          <div className="absolute bottom-32 left-20 w-24 h-24 border border-emerald-500/20 rounded-full animate-float delay-1000"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-lg rotate-45 animate-float delay-500"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
              <FileText className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Report an Issue
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Help us improve! Report any problems with the document information.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6">
            {/* Steps Issue */}
            <div>
              <label className="block mb-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <List className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Steps
                  </h3>
                </div>
                <div className="space-y-3">
                  {Array.isArray(formData.steps) && formData.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg text-white text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => {
                          const newSteps = [...formData.steps];
                          newSteps[index] = e.target.value;
                          setFormData({ ...formData, steps: newSteps });
                          setShowEmptyFieldError(false);
                        }}
                        placeholder={`Step ${index + 1}`}
                        className="flex-1 px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:bg-white/15"
                      />
                      {formData.steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newSteps = formData.steps.filter((_, i) => i !== index);
                            setFormData({ ...formData, steps: newSteps });
                          }}
                          className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-white/10 rounded-xl transition-all"
                          title="Remove step"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {!Array.isArray(formData.steps) && (
                    <div className="text-red-400">Error: Steps should be a list.</div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, steps: [...(Array.isArray(formData.steps) ? formData.steps : []), ''] });
                    setShowEmptyFieldError(false);
                  }}
                  className="mt-4 w-full px-4 py-3 border-2 border-dashed border-white/30 text-white/70 rounded-xl hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-white/5 transition-all flex items-center justify-center gap-2 font-medium"
                >
                  <span className="text-xl">+</span> Add Step
                </button>
              </label>
            </div>

            {/* Documents Issue */}
            <div className="border-t border-white/10 pt-6">
              <MultiSelectDropdown
                label="Documents"
                options={availableDocuments}
                selected={formData.documents}
                onChange={handleDocumentsChange}
                error={false}
              />
            </div>

            {/* Price Issue */}
            <div className="border-t border-white/10 pt-6">
              <label className="block">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Price
                  </h3>
                </div>
                <textarea
                  value={formData.price}
                  onChange={handlePriceChange}
                  placeholder="Report incorrect fees or costs (optional)"
                  rows="3"
                  maxLength="1000"
                  className={`w-full px-4 py-4 bg-white/10 border ${errors.price ? 'border-red-500/50' : 'border-white/20'} rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:bg-white/15 resize-none`}
                />
                {errors.price && <p className="text-red-400 text-xs mt-2 ml-1">{errors.price}</p>}
                <p className="text-white/40 text-sm mt-2">
                  {formData.price.length}/1000 characters
                </p>
              </label>
            </div>

            {/* Processing Time Issue */}
            <div className="border-t border-white/10 pt-6">
              <label className="block">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Processing Time
                  </h3>
                </div>
                <textarea
                  value={formData.processingTime}
                  onChange={handleProcessingTimeChange}
                  placeholder="Report incorrect duration estimates (optional)"
                  rows="3"
                  maxLength="1000"
                  className={`w-full px-4 py-4 bg-white/10 border ${errors.processingTime ? 'border-red-500/50' : 'border-white/20'} rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:bg-white/15 resize-none`}
                />
                {errors.processingTime && <p className="text-red-400 text-xs mt-2 ml-1">{errors.processingTime}</p>}
                <p className="text-white/40 text-sm mt-2">
                  {formData.processingTime.length}/1000 characters
                </p>
              </label>
            </div>

            {showEmptyFieldError && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                <p className="text-red-400 text-sm font-medium">
                  Please fill at least one field to submit your report.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-end border-t border-white/10">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-8 py-4 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Report
                    <FileText className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
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