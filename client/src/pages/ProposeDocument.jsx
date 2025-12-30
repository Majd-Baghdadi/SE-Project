import React, { useState, useRef, useEffect } from 'react';
import { Image, FileText, List, DollarSign, Clock, Tag, Link, Check, AlertTriangle, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SignInModal from '../components/SignInModal';
import proposalService from '../services/proposalService';

// Utility function to resize image with more aggressive compression
const resizeImage = (base64Str, maxWidth = 200, maxHeight = 200) => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.src = base64Str;

    img.onerror = () => reject(new Error('Failed to load image'));

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Balance between quality and size
      const resized = canvas.toDataURL('image/jpeg', 0.2);
      resolve(resized);
    };
  });
};
// Helper function to convert time string to integer (days)
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

// ---------------- Custom Dropdown Component (for Category) ----------------
const CustomDropdown = ({ label, icon: Icon, options, value, onChange, placeholder = "Select...", error = false }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

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
          <Icon className="w-5 h-5 text-green-600" />
        </div>
        <h3 style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontFamily: 'Source Serif Pro', fontWeight: 600, color: '#273248' }}>
          {label}
        </h3>
      </div>

      <div
        className={`w-full px-4 py-3 border-2 ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg cursor-pointer bg-white hover:border-green-500 transition-colors flex justify-between items-center`}
        onClick={() => setOpen(!open)}
        style={{ fontFamily: 'Lato', fontSize: 'clamp(14px, 1.5vw, 16px)' }}
      >
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 ${error ? 'text-red-500' : 'text-gray-500'} transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {open && (
        <div className="absolute w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-lg max-h-60 overflow-auto z-50">
          {options.map((option) => (
            <div
              key={option}
              className={`px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${value === option ? 'bg-green-50 text-green-700' : ''
                }`}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              style={{ fontFamily: 'Lato', fontSize: 'clamp(14px, 1.5vw, 16px)' }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
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
          <Link className="w-5 h-5 text-green-600" />
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

// ---------------- Success Modal ----------------
const SuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scaleIn">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounceIn">
          <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
        </div>
        <h3 className="mb-3" style={{ fontSize: 'clamp(22px, 3vw, 26px)', fontFamily: 'Source Serif Pro', fontWeight: 700, color: '#273248' }}>
          Success!
        </h3>
        <p className="mb-8" style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', fontFamily: 'Lato', color: '#61646b', lineHeight: 1.6 }}>
          Your document proposal has been submitted successfully. Our team will review it shortly.
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
          <AlertTriangle className="w-10 h-10 text-red-600" strokeWidth={2.5} />
        </div>
        <h3 style={{ fontSize: 'clamp(22px, 3vw, 26px)', fontFamily: 'Source Serif Pro', fontWeight: 700, color: '#273248' }}>
          Cancel Proposal?
        </h3>
        <p style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', fontFamily: 'Lato', color: '#61646b', lineHeight: 1.6 }}>
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

// ---------------- ProposeDocumentPage ----------------
const ProposeDocumentPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pictureFile: null,
    name: '',
    steps: '',
    price: '',
    expectedTime: '',
    category: '',
    relatedDocuments: []
  });

  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [availableDocuments, setAvailableDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);

  const categories = [
    'Visa',
    'Passport',
    'ID Card',
    'Birth Certificate',
    'Marriage Certificate',
    'Driving License',
    'Residence Permit',
    'Work Permit'
  ];


  // Check authentication on any form interaction
  // Check authentication on any form interaction
  const checkAuthAndProceed = (callback) => {
    if (!proposalService.isAuthenticated()) {
      setShowSignInModal(true);
      return false;
    }
    callback();
    return true;
  };

  // Fetch available documents on component mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoadingDocuments(true);
        const response = await fetch('http://localhost:8000/api/documents');
        const data = await response.json();

        if (data.documents && Array.isArray(data.documents)) {
          // Transform to format needed for dropdown: {id: uuid, name: docname}
          setAvailableDocuments(data.documents.map(doc => ({
            id: doc.docid,
            name: doc.docname
          })));
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
        setAvailableDocuments([]);
      } finally {
        setLoadingDocuments(false);
      }
    };

    fetchDocuments();
  }, []);
  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return 'Document name is required';
    if (name.length < 3) return 'Document name must be at least 3 characters';
    if (name.length > 100) return 'Document name cannot exceed 100 characters';
    if (!/^[a-zA-Z0-9\s\-_.,()&]+$/.test(name)) return 'Only letters, numbers, spaces, and basic punctuation allowed';
    return '';
  };

  const validatePrice = (price) => {
    if (!price.trim()) return '';
    if (!/^\d+(\.\d{1,2})?$/.test(price)) return 'Price must be a valid number';
    if (parseFloat(price) <= 0) return 'Price must be greater than 0';
    if (parseFloat(price) > 1000000) return 'Price cannot exceed 1,000,000';
    return '';
  };

  const validateTime = (time) => {
    if (!time.trim()) return '';
    const timeRegex = /^\d+\s*(day|week|month|year|hour|minute)s?$/i;
    if (!timeRegex.test(time)) return 'Enter valid time (e.g., "2 days", "1 week", "3 months")';
    return '';
  };

  const validateCategory = (category) => {
    if (!category.trim()) return 'Category is required';
    return '';
  };

  const validateRelatedDocuments = (documents) => {
    if (documents.length > 10) return 'You can select maximum 10 related documents';
    return '';
  };

  const validateSteps = (steps) => {
    if (steps.trim() && steps.length > 2000) return 'Steps cannot exceed 2000 characters';
    return '';
  };

const handleImageUpload = (e) => {
  if (!hasInteracted) setHasInteracted(true);
  
  checkAuthAndProceed(() => {
    const file = e.target.files[0];
    if (file) {
      console.log('📸 Selected file:', file.name, 'Size:', (file.size / 1024).toFixed(2), 'KB');
      
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, picture: 'Please upload an image file (JPEG, PNG, etc.)' });
        return;
      }

      // Just store the file
      setFormData({ ...formData, pictureFile: file });
      setErrors({ ...errors, picture: '' });
      console.log('✅ File stored:', file.name);
    }
  });
};

  const handleNameChange = (e) => {
    if (!hasInteracted) setHasInteracted(true);

    checkAuthAndProceed(() => {
      const value = e.target.value;
      setFormData({ ...formData, name: value });
      setErrors({ ...errors, name: validateName(value) });
    });
  };

  const handlePriceChange = (e) => {
    if (!hasInteracted) setHasInteracted(true);

    checkAuthAndProceed(() => {
      const value = e.target.value;
      setFormData({ ...formData, price: value });
      setErrors({ ...errors, price: validatePrice(value) });
    });
  };

  const handleTimeChange = (e) => {
    if (!hasInteracted) setHasInteracted(true);

    checkAuthAndProceed(() => {
      const value = e.target.value;
      setFormData({ ...formData, expectedTime: value });
      setErrors({ ...errors, expectedTime: validateTime(value) });
    });
  };

  const handleStepsChange = (e) => {
    if (!hasInteracted) setHasInteracted(true);

    checkAuthAndProceed(() => {
      const value = e.target.value;
      setFormData({ ...formData, steps: value });
      setErrors({ ...errors, steps: validateSteps(value) });
    });
  };

  const handleCategoryChange = (value) => {
    if (!hasInteracted) setHasInteracted(true);

    checkAuthAndProceed(() => {
      setFormData({ ...formData, category: value });
      setErrors({ ...errors, category: validateCategory(value) });
    });
  };

  const handleRelatedDocumentsChange = (updated) => {
    if (!hasInteracted) setHasInteracted(true);

    checkAuthAndProceed(() => {
      // 'updated' contains document IDs (UUIDs)
      setFormData({ ...formData, relatedDocuments: updated });
      setErrors({ ...errors, relatedDocuments: validateRelatedDocuments(updated) });
    });
  };
  const validateAll = () => {
    const newErrors = {
      name: validateName(formData.name),
      price: validatePrice(formData.price),
      expectedTime: validateTime(formData.expectedTime),
      category: validateCategory(formData.category),
      relatedDocuments: validateRelatedDocuments(formData.relatedDocuments),
      steps: validateSteps(formData.steps),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitError('');

  if (!proposalService.isAuthenticated()) {
    setShowSignInModal(true);
    return;
  }
  
  if (!validateAll()) {
    return;
  }

  setIsSubmitting(true);

  try {
    // Create FormData
    const submitData = new FormData();
    
    submitData.append('docname', formData.name);
    submitData.append('doctype', formData.category);
    
    const stepsArray = formData.steps.trim() 
      ? formData.steps.split('\n').map(s => s.trim()).filter(s => s) 
      : [];
    submitData.append('steps', JSON.stringify(stepsArray));
    
    if (formData.price) {
      submitData.append('docprice', formData.price);
    }
    
    if (formData.expectedTime) {
      submitData.append('duration', convertTimeToInteger(formData.expectedTime));
    }
    
    if (formData.relatedDocuments.length > 0) {
      submitData.append('relateddocs', JSON.stringify(formData.relatedDocuments));
    }
    
    // Add file
    if (formData.pictureFile) {
      submitData.append('docpicture', formData.pictureFile);
      console.log('📸 File attached:', formData.pictureFile.name);
    }

    // Debug: Log FormData contents
    console.log('📤 FormData contents:');
    for (let [key, value] of submitData.entries()) {
      if (key === 'docpicture') {
        console.log(`  ${key}:`, value.name, value.type, value.size);
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    const response = await proposalService.proposeDocument(submitData);

    if (response.success) {
      setShowSuccessModal(true);
    } else {
      setSubmitError(response.error || 'Failed to submit proposal. Please try again.');
    }
  } catch (error) {
    console.error('Submit error:', error);
    setSubmitError(error.message || 'An unexpected error occurred. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
  const handleCancel = () => setShowCancelModal(true);

  const confirmCancel = () => {
    setFormData({
      pictureFile: null, 
      name: '',
      steps: '',
      price: '',
      expectedTime: '',
      category: '',
      relatedDocuments: []
    });
    setErrors({});
    setShowCancelModal(false);
    setHasInteracted(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setFormData({
      pictureFile: null,
      name: '',
      steps: '',
      price: '',
      expectedTime: '',
      category: '',
      relatedDocuments: []
    });
    setErrors({});
    setHasInteracted(false);
    navigate('/');
  };

  const handleSignInSuccess = () => {
    setShowSignInModal(false);
  };

  return (
    <>
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="mb-3" style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontFamily: 'Source Serif Pro', fontWeight: 700, lineHeight: 1.2, color: '#37a331' }}>
              Propose New Document
            </h1>
            <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', fontFamily: 'Lato', fontWeight: 400, lineHeight: 1.5, color: '#61646b' }}>
              Fill in the form below to propose a new document
            </p>
          </div>

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`bg-white border ${errors.picture ? 'border-red-200' : 'border-gray-200'} rounded-xl shadow-sm p-6`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Image className="w-5 h-5 text-green-600" />
                </div>
                <h3 style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontFamily: 'Source Serif Pro', fontWeight: 600, color: '#273248' }}>Picture</h3>
              </div>
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <div className={`w-full p-3 border-2 ${errors.picture ? 'border-red-500' : 'border-gray-300'} rounded-lg hover:border-green-500 transition-colors flex items-center justify-center bg-gray-50 hover:bg-gray-100`}>
                  <span style={{ fontFamily: 'Lato', fontSize: 'clamp(14px, 1.5vw, 16px)', color: '#61646b' }}>
                    {formData.pictureFile ? 'Change image' : 'Click to upload image'}
                  </span>
                </div>
              </label>
{errors.picture && <p className="text-red-500 text-xs mt-1">{errors.picture}</p>}
{formData.pictureFile && (
  <div className="mt-3">
    <p className="text-sm text-green-600">
      ✓ Selected: {formData.pictureFile.name} ({(formData.pictureFile.size / 1024).toFixed(2)} KB)
    </p>
  </div>
)}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <label className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontFamily: 'Source Serif Pro', fontWeight: 600, color: '#273248' }}>
                    Name <span className="text-red-500">*</span>
                  </h3>
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Enter document name"
                  className={`w-full px-4 py-2 border-b-2 ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:border-green-600 outline-none transition-colors`}
                  style={{ fontFamily: 'Lato', fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </label>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <label className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <List className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontFamily: 'Source Serif Pro', fontWeight: 600, color: '#273248' }}>Steps</h3>
                </div>
                <textarea
                  value={formData.steps}
                  onChange={handleStepsChange}
                  placeholder="Add step-by-step instructions"
                  rows="5"
                  className={`w-full px-4 py-3 border-2 ${errors.steps ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none`}
                  style={{ fontFamily: 'Lato', fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                />
                {errors.steps && <p className="text-red-500 text-xs mt-1">{errors.steps}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.steps.length}/2000 characters
                </p>
              </label>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <label className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontFamily: 'Source Serif Pro', fontWeight: 600, color: '#273248' }}>Price</h3>
                </div>
                <input
                  type="text"
                  value={formData.price}
                  onChange={handlePriceChange}
                  placeholder="Enter price"
                  className={`w-full px-4 py-2 border-b-2 ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:border-green-600 outline-none transition-colors`}
                  style={{ fontFamily: 'Lato', fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Optional - Enter amount in local currency
                </p>
              </label>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <label className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontFamily: 'Source Serif Pro', fontWeight: 600, color: '#273248' }}>Expected Time</h3>
                </div>
                <input
                  type="text"
                  value={formData.expectedTime}
                  onChange={handleTimeChange}
                  placeholder="Enter expected time (e.g., '2 days', '1 week')"
                  className={`w-full px-4 py-2 border-b-2 ${errors.expectedTime ? 'border-red-500' : 'border-gray-300'} focus:border-green-600 outline-none transition-colors`}
                  style={{ fontFamily: 'Lato', fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                />
                {errors.expectedTime && <p className="text-red-500 text-xs mt-1">{errors.expectedTime}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Optional - Use days, weeks, months, or years
                </p>
              </label>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <CustomDropdown
                label="Category"
                icon={Tag}
                options={categories}
                value={formData.category}
                onChange={handleCategoryChange}
                placeholder="Select category"
                error={errors.category}
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <MultiSelectDropdown
                label="Related Documents"
                options={availableDocuments}
                selected={formData.relatedDocuments}
                onChange={handleRelatedDocumentsChange}
                error={errors.relatedDocuments}
              />
            </div>

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
                {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
              </button>
            </div>
          </form>
        </div>

        {showSuccessModal && <SuccessModal onClose={closeSuccessModal} />}
        {showCancelModal && <CancelModal onClose={() => setShowCancelModal(false)} onConfirm={confirmCancel} />}
        {showSignInModal && (
          <SignInModal
            isOpen={showSignInModal}
            onClose={() => setShowSignInModal(false)}
            onSuccess={handleSignInSuccess}
          />
        )}
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
        
        select[multiple] {
          background-image: none;
        }
        
        .appearance-none {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }
      `}</style>
    </>
  );
};

export default ProposeDocumentPage;