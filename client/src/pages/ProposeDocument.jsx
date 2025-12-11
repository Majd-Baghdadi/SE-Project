import React, { useState, useRef, useEffect } from 'react';
import { Image, FileText, List, DollarSign, Clock, Tag, Link, Check, AlertTriangle, X, ChevronDown } from 'lucide-react';
import NavBar from '../components/NavBar';

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

      {/* Dropdown Trigger */}
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

      {/* Dropdown Options */}
      {open && (
        <div className="absolute w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-lg max-h-60 overflow-auto z-50">
          {options.map((option) => (
            <div
              key={option}
              className={`px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                value === option ? 'bg-green-50 text-green-700' : ''
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

  const toggleOption = (value) => {
    let updated = [...selected];
    if (updated.includes(value)) {
      updated = updated.filter((v) => v !== value);
    } else {
      updated.push(value);
    }
    onChange(updated);
  };

  const removeOption = (value, e) => {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
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

      {/* Selected Items Display */}
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
          {selected.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium"
            >
              {item}
              <button
                type="button"
                onClick={(e) => removeOption(item, e)}
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

      {/* Dropdown Options */}
      {open && (
        <div className="absolute w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-lg max-h-60 overflow-auto z-50">
          {options.map((option) => (
            <div
              key={option}
              className={`px-4 py-3 cursor-pointer transition-colors flex justify-between items-center ${
                selected.includes(option)
                  ? 'bg-green-50 text-green-700'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => toggleOption(option)}
              style={{ fontFamily: 'Lato', fontSize: 'clamp(14px, 1.5vw, 16px)' }}
            >
              <span>{option}</span>
              {selected.includes(option) && (
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
        <h3 className="mb-3" style={{ fontSize: 'clamp(22px, 3vw, 26px)', fontFamily: 'Source Serif Pro', fontWeight: 700, color: '#273248' }}>
          Cancel Proposal?
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

// ---------------- ProposeDocumentPage ----------------
const ProposeDocumentPage = () => {
  const [formData, setFormData] = useState({
    picture: null,
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

  const availableDocuments = [
    'National ID Card',
    'Passport Copy',
    'Birth Certificate',
    'Proof of Residence',
    'Tax Certificate',
    'Marriage Certificate',
    'Medical Certificate',
    'Police Record',
    'Bank Statement',
    'Employment Contract'
  ];

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return 'Document name is required';
    if (name.length < 3) return 'Document name must be at least 3 characters';
    if (name.length > 100) return 'Document name cannot exceed 100 characters';
    if (!/^[a-zA-Z0-9\s\-_.,()&]+$/.test(name)) return 'Only letters, numbers, spaces, and basic punctuation allowed';
    return '';
  };

  const validatePrice = (price) => {
    if (!price.trim()) return ''; // Price is optional
    if (!/^\d+(\.\d{1,2})?$/.test(price)) return 'Price must be a valid number ';
    if (parseFloat(price) <= 0) return 'Price must be greater than 0';
    if (parseFloat(price) > 1000000) return 'Price cannot exceed 1,000,000';
    return '';
  };

  const validateTime = (time) => {
    if (!time.trim()) return ''; // Time is optional
    // Accept formats like: "1 day", "2 weeks", "3 months", "4 hours"
    const timeRegex = /^\d+\s*(day|week|month|year|hour|minute)s?$/i;
    if (!timeRegex.test(time)) return 'Enter valid time (e.g., "2 days", "1 week", "3 months")';
    return '';
  };

  const validateCategory = (category) => {
    
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
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, picture: 'Please upload an image file (JPEG, PNG, etc.)' });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, picture: 'Image size must be less than 5MB' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, picture: reader.result });
        setErrors({ ...errors, picture: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, name: value });
    setErrors({ ...errors, name: validateName(value) });
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, price: value });
    setErrors({ ...errors, price: validatePrice(value) });
  };

  const handleTimeChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, expectedTime: value });
    setErrors({ ...errors, expectedTime: validateTime(value) });
  };

  const handleStepsChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, steps: value });
    setErrors({ ...errors, steps: validateSteps(value) });
  };

  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category: value });
    setErrors({ ...errors, category: validateCategory(value) });
  };

  const handleRelatedDocumentsChange = (updated) => {
    setFormData({ ...formData, relatedDocuments: updated });
    setErrors({ ...errors, relatedDocuments: validateRelatedDocuments(updated) });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateAll()) {
      console.log('Form submitted:', formData);
      setShowSuccessModal(true);
    }
  };

  const handleCancel = () => setShowCancelModal(true);

  const confirmCancel = () => {
    setFormData({
      picture: null,
      name: '',
      steps: '',
      price: '',
      expectedTime: '',
      category: '',
      relatedDocuments: []
    });
    setErrors({});
    setShowCancelModal(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setFormData({
      picture: null,
      name: '',
      steps: '',
      price: '',
      expectedTime: '',
      category: '',
      relatedDocuments: []
    });
    setErrors({});
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="mb-3" style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontFamily: 'Source Serif Pro', fontWeight: 700, lineHeight: 1.2, color: '#37a331' }}>
              Propose New Document
            </h1>
            <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', fontFamily: 'Lato', fontWeight: 400, lineHeight: 1.5, color: '#61646b' }}>
              Fill in the form below to propose a new document
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Picture */}
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
                    {formData.picture ? 'Change image' : 'Click to upload image'}
                  </span>
                </div>
              </label>
              {errors.picture && <p className="text-red-500 text-xs mt-1">{errors.picture}</p>}
              {formData.picture && <img src={formData.picture} alt="Preview" className="mt-3 max-w-xs rounded-lg border border-gray-200" />}
            </div>

            {/* Name */}
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

            {/* Steps */}
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

            {/* Price */}
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

            {/* Expected Time */}
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

            {/* Category */}
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

            {/* Related Documents */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <MultiSelectDropdown
                label="Related Documents"
                options={availableDocuments}
                selected={formData.relatedDocuments}
                onChange={handleRelatedDocumentsChange}
                error={errors.relatedDocuments}
              />
            </div>

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
                Submit Proposal
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