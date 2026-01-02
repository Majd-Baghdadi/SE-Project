/**
 * Update Document Page (Admin)
 * 
 * Purpose: Allow admins to edit and update document information
 * 
 * Route: /admin/document/:docId/update
 * Protected: Requires admin role
 */

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Save, FileText, Upload, Plus, X, AlertCircle, CheckCircle, Link as LinkIcon, ChevronDown, Check } from 'lucide-react';
import documentService from '../../services/documentService';
import adminService from '../../services/adminService';
import Swal from 'sweetalert2';

// Multi-Select Dropdown Component
const MultiSelectDropdown = ({ label, options, selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const searchInputRef = useRef();
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredOptions = options.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <LinkIcon className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">{label}</h2>
      </div>

      <div
        className="w-full px-4 py-4 border border-white/20 rounded-xl cursor-pointer bg-white/10 hover:bg-white/15 transition-all duration-300 min-h-[50px] flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-wrap gap-2 flex-1">
          {selected.length === 0 && (
            <span className="text-white/40">
              Select required documents...
            </span>
          )}
          {selected.map((docId) => (
            <span
              key={docId}
              className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full text-sm font-medium border border-emerald-500/30"
            >
              {getDocNameById(docId)}
              <button
                type="button"
                onClick={(e) => removeOption(docId, e)}
                className="text-emerald-300 hover:text-red-400 ml-1 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <ChevronDown className={`w-4 h-4 text-white/40 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>

      {open && (
        <div className="absolute w-full bg-slate-800/95 backdrop-blur-xl border border-white/20 mt-2 rounded-xl shadow-2xl max-h-80 overflow-hidden z-50">
          <div className="p-3 border-b border-white/10 sticky top-0 bg-slate-800/95 backdrop-blur-xl">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Search documents..."
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>
          
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((doc) => (
                <div
                  key={doc.id}
                  className={`px-4 py-3 cursor-pointer transition-all duration-200 flex justify-between items-center border-b border-white/10 last:border-b-0 ${
                    selected.includes(doc.id)
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                  onClick={() => toggleOption(doc.id)}
                >
                  <span>{doc.name}</span>
                  {selected.includes(doc.id) && (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-white/40">
                No documents found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function UpdateDocument() {
  const { docId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    docname: '',
    doctype: '',
    docprice: 0,
    duration: '',
    relateddocs: [],
    steps: [],
  });
  
  const [availableDocuments, setAvailableDocuments] = useState([]);
  
  // Image handling
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  // Fetch document data on mount
  useEffect(() => {
    async function fetchDocument() {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all documents for dropdown
        const docsResponse = await fetch('http://localhost:8000/api/documents');
        const docsData = await docsResponse.json();
        if (docsData.documents && Array.isArray(docsData.documents)) {
          setAvailableDocuments(docsData.documents.map(doc => ({
            id: doc.docid,
            name: doc.docname
          })));
        }
        
        // Fetch current document
        const response = await documentService.getDocumentById(docId);
        console.log('🟢 Fetched document for editing:', response);
        
        if (response && response.data) {
          const doc = response.data;
          const relatedDocs = response.relatedDocuments || [];
          
          setFormData({
            docname: doc.docname || '',
            doctype: doc.doctype || '',
            docprice: doc.docprice || doc.price || 0,
            duration: doc.duration || doc.docduration || '',
            relateddocs: relatedDocs.map(d => d.docid) || [],
            steps: doc.steps || doc.docsteps || []
          });
          
          if (doc.docpicture || doc.docimage) {
            setImagePreview(doc.docpicture || doc.docimage);
          }
        } else {
          setError('Document not found');
        }
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Failed to load document');
      }
      
      setLoading(false);
    }
    
    fetchDocument();
  }, [docId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'docprice' ? Number(value) : value
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  // Handle array field changes (requirements, steps)
  const handleArrayFieldChange = (field, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      if (typeof newArray[index] === 'object') {
        newArray[index] = { ...newArray[index], ...value };
      } else {
        newArray[index] = value;
      }
      return { ...prev, [field]: newArray };
    });
  };

  // Add item to array field
  const addArrayItem = (field, defaultValue) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  };

  // Remove item from array field
  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    // Validate required fields
    if (!formData.docname || !formData.doctype) {
      setError('Document name and type are required.');
      setSaving(false);
      return;
    }
    
    if (!formData.steps || formData.steps.length === 0) {
      setError('At least one step is required.');
      setSaving(false);
      return;
    }
    
    try {
      const submitData = new FormData();
      submitData.append('docname', formData.docname);
      submitData.append('doctype', formData.doctype);
      submitData.append('steps', JSON.stringify(formData.steps));
      
      if (formData.duration) {
        submitData.append('duration', formData.duration);
      }
      if (formData.docprice !== undefined && formData.docprice !== null) {
        submitData.append('docprice', formData.docprice);
      }
      
      if (formData.relateddocs && formData.relateddocs.length > 0) {
        submitData.append('relateddocs', JSON.stringify(formData.relateddocs));
      }
      
      if (imageFile) {
        submitData.append('docpicture', imageFile);
      } else if (removeImage) {
        submitData.append('removeImage', 'true');
      }
      
      await adminService.editDocument(docId, submitData);
      
      Swal.fire({
        title: 'Updated!',
        text: 'Document has been updated successfully.',
        icon: 'success',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#10b981'
      }).then(() => {
        navigate(`/admin/document/${docId}`);
      });
      
    } catch (err) {
      console.error('Error updating document:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update document. Please try again.',
        icon: 'error',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#10b981'
      });
    }
    
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.docname) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <Link to="/admin" className="text-emerald-400 hover:text-emerald-300 transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={`/document/${docId}`}
            className="inline-flex items-center gap-2 text-white/60 hover:text-emerald-400 mb-4 transition-colors no-underline"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Document
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Update Document</h1>
              <p className="text-white/60">Edit the information for this document</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            notification.type === 'success' 
              ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' 
              : 'bg-red-500/20 border border-red-500/30 text-red-400'
          }`}>
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {notification.message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Document Name *
                </label>
                <input
                  type="text"
                  name="docname"
                  value={formData.docname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Document Type *
                </label>
                <input
                  type="text"
                  name="doctype"
                  value={formData.doctype}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Price (DA)
                </label>
                <input
                  type="number"
                  name="docprice"
                  value={formData.docprice}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Processing Time
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 7-10 days"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Document Image
              </label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-24 h-24 object-cover rounded-xl border border-white/20"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        setRemoveImage(true);
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white transition-all"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 border-dashed rounded-xl text-white/60 hover:bg-white/15 hover:border-emerald-500/50 transition-all">
                    <Upload className="w-5 h-5" />
                    <span>Choose Image</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 relative z-10 overflow-visible">
            <MultiSelectDropdown
              label="Required Documents"
              options={availableDocuments}
              selected={formData.relateddocs}
              onChange={(selected) => setFormData(prev => ({ ...prev, relateddocs: selected }))}
            />
          </div>

          {/* Steps */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-xs font-bold">1</span>
                Steps to Complete
              </h2>
              <button
                type="button"
                onClick={() => addArrayItem('steps', '')}
                className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Step
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.steps.map((step, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <span className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 shadow-lg shadow-emerald-500/30">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleArrayFieldChange('steps', index, e.target.value)}
                    placeholder="Enter step description"
                    className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('steps', index)}
                    className="text-red-400 hover:text-red-300 p-2 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {formData.steps.length === 0 && (
                <p className="text-white/40 text-sm text-center py-4">No steps added yet</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 justify-end">
            <Link
              to={`/document/${docId}`}
              className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/20 no-underline"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
