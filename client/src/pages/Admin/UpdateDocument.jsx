/**
 * Update Document Page (Admin)
 * 
 * Purpose: Allow admins to edit and update document information
 * 
 * Route: /admin/document/:docId/update
 * Protected: Requires admin role
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Save, FileText, Upload, Plus, X, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import documentService from '../../services/documentService';
import adminService from '../../services/adminService';

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
    requirements: [],
    steps: [],
    tips: []
  });
  
  // Image handling
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch document data on mount
  useEffect(() => {
    async function fetchDocument() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await documentService.getDocumentById(docId);
        console.log('🟢 Fetched document for editing:', response);
        
        if (response && response.data) {
          const doc = response.data;
          setFormData({
            docname: doc.docname || '',
            doctype: doc.doctype || '',
            docprice: doc.docprice || doc.price || 0,
            duration: doc.duration || doc.docduration || '',
            requirements: doc.requirements || doc.docrequirements || [],
            steps: doc.steps || doc.docsteps || [],
            tips: doc.tips || []
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
    }
  };

  // Handle array field changes (requirements, steps, tips)
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
      if (formData.requirements && formData.requirements.length > 0) {
        submitData.append('requirements', JSON.stringify(formData.requirements));
      }
      if (formData.tips && formData.tips.length > 0) {
        submitData.append('tips', JSON.stringify(formData.tips));
      }
      if (formData.relateddocs && formData.relateddocs.length > 0) {
        submitData.append('relateddocs', JSON.stringify(formData.relateddocs));
      }
      
      if (imageFile) {
        submitData.append('docpicture', imageFile);
      }
      
      await adminService.editDocument(docId, submitData);
      
      setNotification({ type: 'success', message: 'Document updated successfully!' });
      
      setTimeout(() => {
        navigate(`/admin/document/${docId}`);
      }, 1500);
      
    } catch (err) {
      console.error('Error updating document:', err);
      setError('Failed to update document. Please try again.');
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
                  Processing Duration
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
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-xl border border-white/20"
                  />
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

          {/* Requirements */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Required Documents
              </h2>
              <button
                type="button"
                onClick={() => addArrayItem('requirements', { name: '', description: '', copies: 1, type: 'original' })}
                className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Requirement
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.requirements.map((req, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-white/60">Requirement {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('requirements', index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Document name"
                      value={req.name || ''}
                      onChange={(e) => handleArrayFieldChange('requirements', index, { name: e.target.value })}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={req.description || ''}
                      onChange={(e) => handleArrayFieldChange('requirements', index, { description: e.target.value })}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="number"
                      placeholder="Copies"
                      value={req.copies || 1}
                      onChange={(e) => handleArrayFieldChange('requirements', index, { copies: Number(e.target.value) })}
                      min="1"
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <select
                      value={req.type || 'original'}
                      onChange={(e) => handleArrayFieldChange('requirements', index, { type: e.target.value })}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="original" className="bg-slate-800">Original</option>
                      <option value="certified_copy" className="bg-slate-800">Certified Copy</option>
                      <option value="photocopy" className="bg-slate-800">Photocopy</option>
                    </select>
                  </div>
                </div>
              ))}
              
              {formData.requirements.length === 0 && (
                <p className="text-white/40 text-sm text-center py-4">No requirements added yet</p>
              )}
            </div>
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

          {/* Tips */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                Tips
              </h2>
              <button
                type="button"
                onClick={() => addArrayItem('tips', '')}
                className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Tip
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.tips.map((tip, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                  </div>
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => handleArrayFieldChange('tips', index, e.target.value)}
                    placeholder="Enter a helpful tip"
                    className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('tips', index)}
                    className="text-red-400 hover:text-red-300 p-2 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {formData.tips.length === 0 && (
                <p className="text-white/40 text-sm text-center py-4">No tips added yet</p>
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
