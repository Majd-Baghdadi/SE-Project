import React, { useState, useRef, useEffect } from 'react';
import { 
  Image, 
  FileText, 
  List, 
  DollarSign, 
  Clock, 
  Tag, 
  Link, 
  Check, 
  X, 
  ChevronDown,
  Upload,
  Plus,
  Sparkles,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SignInModal from '../components/SignInModal';
import proposalService from '../services/proposalService';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

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

  switch (unit) {
    case 'minute':
      return Math.ceil(value / (24 * 60));
    case 'hour':
      return Math.ceil(value / 24);
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
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">{label}</h3>
      </div>

      <div
        className={`w-full px-4 py-3 border ${error ? 'border-red-500/50' : 'border-white/20'} rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 hover:border-emerald-500/50 transition-all flex justify-between items-center`}
        onClick={() => setOpen(!open)}
      >
        <span className={value ? 'text-white' : 'text-white/50'}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 ${error ? 'text-red-400' : 'text-white/50'} transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </div>
      {error && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {error}</p>}

      {open && (
        <div className="absolute w-full bg-slate-800/95 backdrop-blur-xl border border-white/20 mt-2 rounded-xl shadow-2xl max-h-60 overflow-auto z-50">
          {options.map((option) => (
            <div
              key={option}
              className={`px-4 py-3 cursor-pointer transition-all ${
                value === option 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'hover:bg-white/10 text-white/80 hover:text-white'
              }`}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
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
    } else {
      updated.push(docId);
    }
    onChange(updated);
  };

  const removeOption = (docId, e) => {
    e.stopPropagation();
    onChange(selected.filter((id) => id !== docId));
  };

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
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Link className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">{label}</h3>
      </div>

      <div
        className={`w-full px-4 py-3 border ${error ? 'border-red-500/50' : 'border-white/20'} rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 hover:border-emerald-500/50 transition-all min-h-[50px] flex justify-between items-center`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-wrap gap-2 flex-1">
          {selected.length === 0 && (
            <span className="text-white/50">Select related documents...</span>
          )}
          {selected.map((docId) => (
            <span
              key={docId}
              className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-sm font-medium border border-emerald-500/30"
            >
              {getDocNameById(docId)}
              <button
                type="button"
                onClick={(e) => removeOption(docId, e)}
                className="text-emerald-400 hover:text-emerald-300 ml-1"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <ChevronDown className={`w-5 h-5 ${error ? 'text-red-400' : 'text-white/50'} ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </div>
      {error && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {error}</p>}

      {open && (
        <div className="absolute w-full bg-slate-800/95 backdrop-blur-xl border border-white/20 mt-2 rounded-xl shadow-2xl max-h-60 overflow-auto z-50">
          {options.map((doc) => (
            <div
              key={doc.id}
              className={`px-4 py-3 cursor-pointer transition-all flex justify-between items-center ${
                selected.includes(doc.id)
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'hover:bg-white/10 text-white/80 hover:text-white'
              }`}
              onClick={() => toggleOption(doc.id)}
            >
              <span>{doc.name}</span>
              {selected.includes(doc.id) && (
                <Check className="w-5 h-5 text-emerald-400" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------- ProposeDocumentPage ----------------
const ProposeDocumentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    pictureFile: null,
    name: '',
    steps: [''],
    price: '',
    expectedTime: '',
    category: '',
    relatedDocuments: []
  });

  const [errors, setErrors] = useState({});
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [availableDocuments, setAvailableDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);

  const categories = [
    'Biometric Services',
    'Civil Status Services',
    'Administrative Services',
  ];

  const checkAuthAndProceed = (callback) => {
    if (!proposalService.isAuthenticated()) {
      setShowSignInModal(true);
      return false;
    }
    callback();
    return true;
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoadingDocuments(true);
        const response = await fetch('http://localhost:8000/api/documents');
        const data = await response.json();

        if (data.documents && Array.isArray(data.documents)) {
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

  const validateSteps = (stepsArray) => {
    if (!Array.isArray(stepsArray)) return '';
    const validSteps = stepsArray.filter(s => s.trim());
    if (validSteps.length === 0) return '';
    const totalChars = validSteps.join('').length;
    if (totalChars > 5000) return 'Total steps cannot exceed 5000 characters';
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

  const handleStepChange = (index, value) => {
    if (!hasInteracted) setHasInteracted(true);

    checkAuthAndProceed(() => {
      const newSteps = [...formData.steps];
      newSteps[index] = value;
      setFormData({ ...formData, steps: newSteps });
      setErrors({ ...errors, steps: validateSteps(newSteps) });
    });
  };

  const handleAddStep = () => {
    if (!hasInteracted) setHasInteracted(true);

    checkAuthAndProceed(() => {
      setFormData({ ...formData, steps: [...formData.steps, ''] });
    });
  };

  const handleRemoveStep = (index) => {
    if (!hasInteracted) setHasInteracted(true);

    checkAuthAndProceed(() => {
      if (formData.steps.length > 1) {
        const newSteps = formData.steps.filter((_, i) => i !== index);
        setFormData({ ...formData, steps: newSteps });
        setErrors({ ...errors, steps: validateSteps(newSteps) });
      }
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
      const submitData = new FormData();

      submitData.append('docname', formData.name);
      submitData.append('doctype', formData.category);

      const stepsArray = formData.steps
        .map(s => s.trim())
        .filter(s => s);
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

      if (formData.pictureFile) {
        submitData.append('docpicture', formData.pictureFile);
        console.log('📸 File attached:', formData.pictureFile.name);
      }

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
        Swal.fire({
          title: 'Success!',
          text: 'Your document proposal has been submitted successfully. Our team will review it shortly.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          confirmButtonText: 'Done',
          background: '#1e293b',
          color: '#fff'
        }).then(() => {
          closeSuccessModal();
        });
      } else {
        setSubmitError(response.error || 'Failed to submit proposal. Please try again.');
        Swal.fire({
          title: 'Error!',
          text: response.error || 'Failed to submit proposal.',
          icon: 'error',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: 'Cancel Proposal?',
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
      pictureFile: null,
      name: '',
      steps: [''],
      price: '',
      expectedTime: '',
      category: '',
      relatedDocuments: []
    });
    setErrors({});
    setHasInteracted(false);
    navigate(-1);
  };

  const closeSuccessModal = () => {
    setFormData({
      pictureFile: null,
      name: '',
      steps: [''],
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              {user?.role === 'admin' ? 'Admin Panel' : 'Community Contribution'}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {user?.role === 'admin' ? 'Add New Document' : 'Propose New Document'}
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Fill in the form below to {user?.role === 'admin' ? 'add a new document to the system' : 'propose a new document for our community'}
            </p>
          </div>

          {/* Error Alert */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Picture Upload */}
            <div className={`bg-white/10 backdrop-blur-xl border ${errors.picture ? 'border-red-500/50' : 'border-white/20'} rounded-2xl p-6 hover:bg-white/[0.12] transition-all`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Image className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Document Image</h3>
              </div>
              <label className="cursor-pointer block">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <div className={`w-full p-8 border-2 border-dashed ${errors.picture ? 'border-red-500/50' : 'border-white/20'} rounded-xl hover:border-emerald-500/50 transition-all flex flex-col items-center justify-center bg-white/5 hover:bg-white/10`}>
                  <Upload className="w-10 h-10 text-white/40 mb-3" />
                  <span className="text-white/60">
                    {formData.pictureFile ? 'Click to change image' : 'Click to upload image'}
                  </span>
                  <span className="text-white/40 text-sm mt-1">JPEG, PNG, GIF up to 5MB</span>
                </div>
              </label>
              {errors.picture && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.picture}</p>}
              {formData.pictureFile && (
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <p className="text-emerald-400 text-sm flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Selected: {formData.pictureFile.name} ({(formData.pictureFile.size / 1024).toFixed(2)} KB)
                  </p>
                </div>
              )}
            </div>

            {/* Document Name */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/[0.12] transition-all">
              <label className="block">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Name <span className="text-red-400">*</span>
                  </h3>
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Enter document name"
                  className={`w-full px-4 py-3 bg-white/5 border ${errors.name ? 'border-red-500/50' : 'border-white/20'} rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all`}
                />
                {errors.name && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.name}</p>}
              </label>
            </div>

            {/* Steps */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/[0.12] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <List className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Steps</h3>
              </div>

              <div className="space-y-3">
                {formData.steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-emerald-400">{index + 1}</span>
                    </div>
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      placeholder={`Step ${index + 1}`}
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                    />
                    {formData.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(index)}
                        className="flex-shrink-0 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remove step"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddStep}
                className="mt-4 w-full px-4 py-3 border-2 border-dashed border-emerald-500/30 text-emerald-400 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" /> Add Step
              </button>

              {errors.steps && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.steps}</p>}
              <p className="text-white/40 text-sm mt-2">
                {formData.steps.filter(s => s.trim()).length} step(s) added
              </p>
            </div>

            {/* Price */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/[0.12] transition-all">
              <label className="block">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Price</h3>
                  <span className="text-white/40 text-sm">(Optional)</span>
                </div>
                <input
                  type="text"
                  value={formData.price}
                  onChange={handlePriceChange}
                  placeholder="Enter price"
                  className={`w-full px-4 py-3 bg-white/5 border ${errors.price ? 'border-red-500/50' : 'border-white/20'} rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all`}
                />
                {errors.price && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.price}</p>}
                <p className="text-white/40 text-sm mt-2">
                  Enter amount in local currency (DZD)
                </p>
              </label>
            </div>

            {/* Expected Time */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/[0.12] transition-all">
              <label className="block">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Expected Time</h3>
                  <span className="text-white/40 text-sm">(Optional)</span>
                </div>
                <input
                  type="text"
                  value={formData.expectedTime}
                  onChange={handleTimeChange}
                  placeholder="Enter expected time (e.g., '2 days', '1 week')"
                  className={`w-full px-4 py-3 bg-white/5 border ${errors.expectedTime ? 'border-red-500/50' : 'border-white/20'} rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all`}
                />
                {errors.expectedTime && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {errors.expectedTime}</p>}
                <p className="text-white/40 text-sm mt-2">
                  Use days, weeks, months, or years
                </p>
              </label>
            </div>

            {/* Category */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/[0.12] transition-all">
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
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/[0.12] transition-all">
              <MultiSelectDropdown
                label="Related Documents"
                options={availableDocuments}
                selected={formData.relatedDocuments}
                onChange={handleRelatedDocumentsChange}
                error={errors.relatedDocuments}
              />
              <p className="text-white/40 text-sm mt-2">
                Optional - Select documents that are related to this one
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-8 py-4 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {user?.role === 'admin' ? 'Adding...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {user?.role === 'admin' ? 'Add Document' : 'Submit Proposal'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {showSignInModal && (
          <SignInModal
            isOpen={showSignInModal}
            onClose={() => setShowSignInModal(false)}
            onSuccess={handleSignInSuccess}
          />
        )}
      </div>
    </>
  );
};

export default ProposeDocumentPage;
