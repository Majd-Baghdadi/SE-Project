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
    
    // Validate required fields (backend requires: docname, doctype, steps)
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
      // Create FormData for file upload - match backend expected fields
      const submitData = new FormData();
      submitData.append('docname', formData.docname);
      submitData.append('doctype', formData.doctype);
      submitData.append('steps', JSON.stringify(formData.steps));
      
      // Optional fields that exist in the database
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
      
      // Navigate back to document details after short delay
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
      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error && !formData.docname) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="text-center py-20">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <Link to="/admin" className="text-primary hover:underline">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link 
            to={`/admin/document/${docId}`}
            className="text-sm text-slate-500 hover:text-primary mb-2 inline-flex items-center gap-1"
          >
            ← Back to Document
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Update Document</h1>
          <p className="text-slate-500 mt-1">Edit the information for this document</p>
        </div>

        {/* Notifications */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {notification.message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Document Name *
                </label>
                <input
                  type="text"
                  name="docname"
                  value={formData.docname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Document Type *
                </label>
                <input
                  type="text"
                  name="doctype"
                  value={formData.doctype}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Price (DA)
                </label>
                <input
                  type="number"
                  name="docprice"
                  value={formData.docprice}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Processing Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 7-10 days"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Document Image
              </label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-lg border border-slate-200"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Required Documents</h2>
              <button
                type="button"
                onClick={() => addArrayItem('requirements', { name: '', description: '', copies: 1, type: 'original' })}
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                + Add Requirement
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.requirements.map((req, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-slate-600">Requirement {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('requirements', index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Document name"
                      value={req.name || ''}
                      onChange={(e) => handleArrayFieldChange('requirements', index, { name: e.target.value })}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={req.description || ''}
                      onChange={(e) => handleArrayFieldChange('requirements', index, { description: e.target.value })}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Copies"
                      value={req.copies || 1}
                      onChange={(e) => handleArrayFieldChange('requirements', index, { copies: Number(e.target.value) })}
                      min="1"
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                    <select
                      value={req.type || 'original'}
                      onChange={(e) => handleArrayFieldChange('requirements', index, { type: e.target.value })}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="original">Original</option>
                      <option value="certified_copy">Certified Copy</option>
                      <option value="photocopy">Photocopy</option>
                    </select>
                  </div>
                </div>
              ))}
              
              {formData.requirements.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-4">No requirements added yet</p>
              )}
            </div>
          </div>

          {/* Steps */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Steps to Complete</h2>
              <button
                type="button"
                onClick={() => addArrayItem('steps', '')}
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                + Add Step
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.steps.map((step, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleArrayFieldChange('steps', index, e.target.value)}
                    placeholder="Enter step description"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('steps', index)}
                    className="text-red-500 hover:text-red-700 text-sm px-2 py-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              {formData.steps.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-4">No steps added yet</p>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Tips</h2>
              <button
                type="button"
                onClick={() => addArrayItem('tips', '')}
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                + Add Tip
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.tips.map((tip, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <span className="text-amber-500">💡</span>
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => handleArrayFieldChange('tips', index, e.target.value)}
                    placeholder="Enter a helpful tip"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('tips', index)}
                    className="text-red-500 hover:text-red-700 text-sm px-2 py-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              {formData.tips.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-4">No tips added yet</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 justify-end">
            <Link
              to={`/admin/document/${docId}`}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
