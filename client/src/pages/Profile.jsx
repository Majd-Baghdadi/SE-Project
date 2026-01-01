import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ChevronDown, Edit2, Check, LogOut, Eye, X, Link as LinkIcon } from 'lucide-react';
import { useRef } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';
import proposalService from '../services/proposalService';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';
import standard from '../assets/images/standard2.png';
import api from '../services/api';
import documentService from '../services/documentService';

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
    const cleanId = String(docId).trim();
    const doc = options.find(opt => String(opt.id).trim() === cleanId);
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
      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{label}</label>

      <div
        className={`w-full px-4 py-2 border-2 ${error ? 'border-red-500' : 'border-gray-200'} rounded-lg cursor-pointer bg-white hover:border-green-500 transition-colors min-h-[45px] flex justify-between items-center`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-wrap gap-2 flex-1">
          {selected.length === 0 && (
            <span className="text-gray-400 text-sm">
              Select related documents...
            </span>
          )}
          {selected.map((docId) => (
            <span
              key={docId}
              className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-semibold border border-green-100"
            >
              {getDocNameById(docId)}
              <button
                type="button"
                onClick={(e) => removeOption(docId, e)}
                className="text-green-600 hover:text-green-800 ml-1"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <ChevronDown className={`w-4 h-4 ${error ? 'text-red-500' : 'text-gray-500'} ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {open && (
        <div className="absolute w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-xl max-h-60 overflow-auto z-[70]">
          {options.map((doc) => (
            <div
              key={doc.id}
              className={`px-4 py-2.5 cursor-pointer transition-colors flex justify-between items-center text-sm ${selected.includes(doc.id)
                ? 'bg-green-50 text-green-700'
                : 'hover:bg-gray-50 text-gray-700'
                }`}
              onClick={() => toggleOption(doc.id)}
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

export default function ProfileForm() {
  const navigate = useNavigate();
  const { user: authUser, checkAuth, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    idCard: '1234567890',
    gender: 'female',
    placeOfBirth: 'algiers',
    phoneNumber: '+213 555 123 456',
    dateOfBirth: '1995-03-15'
  });

  const [contributions, setContributions] = useState({
    documents: [],
    fixes: []
  });
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [viewModal, setViewModal] = useState({ isOpen: false, data: null, type: 'doc', loading: false, isEditing: false });
  const [editData, setEditData] = useState({});
  const [allDocuments, setAllDocuments] = useState([]);

  const getImgSrc = (src) => {
    if (!src) return standard;
    const cleanSrc = src.toString().trim();
    if (cleanSrc.startsWith('http') || cleanSrc.includes('://')) return cleanSrc;
    if (cleanSrc.startsWith('data:')) return cleanSrc;
    return `data:image/jpeg;base64,${cleanSrc}`;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!authService.isAuthenticated()) {
          navigate('/signin');
          return;
        }

        const [profileRes, docsList] = await Promise.all([
          userService.getUserProfile(),
          documentService.getAllDocuments()
        ]);

        setAllDocuments(docsList);

        if (profileRes.success && profileRes.user) {
          setFormData(prev => ({
            ...prev,
            name: profileRes.user.name || '',
            email: profileRes.user.email || ''
          }));

          // Only fetch contributions if user is NOT an admin
          if (profileRes.user.role !== 'admin') {
            const [docsRes, fixesRes] = await Promise.all([
              proposalService.getProposedDocumentsByUser(),
              proposalService.getProposedFixesByUser()
            ]);

            if (docsRes.success) {
              setContributions(prev => ({ ...prev, documents: docsRes.data || [] }));
            }
            if (fixesRes.success) {
              setContributions(prev => ({ ...prev, fixes: fixesRes.data || [] }));
            }
          }
        }

      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const getDocNameById = (id) => {
    if (!id) return '';
    // Ensure we compare strings and trim whitespace
    const cleanId = String(id).trim();
    const doc = allDocuments.find(d => String(d.docid || d.id).trim() === cleanId);
    return doc ? doc.docname : id;
  };

  const handleDeleteDoc = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const res = await proposalService.deleteProposedDocument(id);
      if (res.success) {
        setContributions(prev => ({
          ...prev,
          documents: prev.documents.filter(d => d.proposeddocid !== id)
        }));
        Swal.fire('Deleted!', 'Your proposal has been deleted.', 'success');
      } else {
        Swal.fire('Error!', 'Failed to delete proposal.', 'error');
      }
    }
  };

  const handleDeleteFix = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const res = await proposalService.deleteProposedFix(id);
      if (res.success) {
        setContributions(prev => ({
          ...prev,
          fixes: prev.fixes.filter(f => f.fixid !== id)
        }));
        Swal.fire('Deleted!', 'Your fix proposal has been deleted.', 'success');
      } else {
        Swal.fire('Error!', 'Failed to delete fix.', 'error');
      }
    }
  };

  const handleViewDoc = async (doc, isEdit = false) => {
    // Start with basic data from the list (this includes our frontend updates)
    setViewModal({ isOpen: true, type: 'doc', data: doc, loading: true, isEditing: isEdit, detailsLoaded: false });
    setEditData({ ...doc });

    try {
      const id = doc.proposeddocid || doc.id;

      // WORKAROUND: instead of calling the broken backend detail service, 
      // we perform a direct raw fetch of the document fields to avoid the faulty 'users' join.
      const res = await api.get(`/propose/proposedDocument/${id}`);

      // The backend returns { document: ... } or { data: ... }
      const rawData = res.document || res.data || res;
      const actualData = Array.isArray(rawData) ? rawData[0] : rawData;

      if (actualData && (actualData.proposeddocid || actualData.id)) {
        // Parse relateddocs if it's a string
        let parsedRelatedDocs = actualData.relateddocs;
        if (typeof parsedRelatedDocs === 'string') {
          try {
            // Try JSON parse first
            parsedRelatedDocs = JSON.parse(parsedRelatedDocs);
          } catch (e) {
            console.warn("Failed to JSON parse relateddocs, trying simple split", e);
            // Fallback: if it's a simple comma-separated string or Postgres array format {a,b}
            parsedRelatedDocs = parsedRelatedDocs.replace(/^\{|\}$/g, '').split(',').map(s => s.trim().replace(/^"|"$/g, ''));
          }
        }
        
        // Ensure it's an array
        if (!Array.isArray(parsedRelatedDocs)) {
            parsedRelatedDocs = [];
        }

        // Fetch related document names EXACTLY like DocumentDetails does
        let relatedDocuments = [];
        if (parsedRelatedDocs.length > 0) {
            try {
                // Fetch each related document's details using the same API as DocumentDetails
                const relatedDocsPromises = parsedRelatedDocs.map(async (docId) => {
                    try {
                        const cleanId = String(docId).trim();
                        const docResponse = await documentService.getDocumentById(cleanId);
                        if (docResponse && docResponse.data) {
                            return {
                                docid: docResponse.data.docid || docId,
                                docname: docResponse.data.docname || docId
                            };
                        }
                        // Fallback to local lookup
                        const foundDoc = allDocuments.find(d => String(d.docid || d.id).trim() === cleanId);
                        // Return null for deleted documents instead of showing ID
                        return foundDoc ? {
                            docid: docId,
                            docname: foundDoc.docname
                        } : null;
                    } catch (err) {
                        console.warn(`Failed to fetch doc ${docId}:`, err);
                        const cleanId = String(docId).trim();
                        const foundDoc = allDocuments.find(d => String(d.docid || d.id).trim() === cleanId);
                        // Return null for deleted documents instead of showing ID
                        return foundDoc ? {
                            docid: docId,
                            docname: foundDoc.docname
                        } : null;
                    }
                });
                
                // Filter out deleted documents (null entries)
                relatedDocuments = (await Promise.all(relatedDocsPromises)).filter(doc => doc !== null);
            } catch (error) {
                console.error('Error fetching related docs:', error);
            }
        }

        // Success! We have the steps, price, and duration now.
        // IMPORTANT: Preserve frontend-only changes (like removed images) by prioritizing local state
        const fullData = { 
          ...actualData,  // Backend data
          ...doc,         // Local state (includes image removal, etc.)
          // But prefer backend data for actual content fields
          steps: actualData.steps || doc.steps,
          docprice: actualData.docprice ?? doc.docprice,
          duration: actualData.duration || doc.duration,
          relateddocs: parsedRelatedDocs.length > 0 ? parsedRelatedDocs : (doc.relateddocs || []),
          relatedDocuments: relatedDocuments // Add fetched documents with names
        };
        
        console.log('📥 Merged data for modal:', {
          backendImage: actualData.docpicture,
          localImage: doc.docpicture,
          finalImage: fullData.docpicture
        });
        
        setViewModal(prev => ({ ...prev, data: fullData, loading: false, detailsLoaded: true }));
        if (isEdit) {
          setEditData(fullData);
        }
      } else {
        throw new Error("No data returned");
      }
    } catch (err) {
      console.warn("Detail fetch failed, but keeping basic info:", err);
      // Fallback: stay on basic data but warn the user
      setViewModal(prev => ({ ...prev, loading: false, detailsLoaded: false }));
      if (isEdit) {
        setNotification({
          message: 'Some fields (Steps/Price) could not be loaded due to a server error. You can still edit the Name/Category.',
          type: 'error'
        });
      }
    }
  };

  const handleViewFix = async (fix, isEdit = false) => {
    // Start with basic data 
    setViewModal({ isOpen: true, type: 'fix', data: fix, loading: true, isEditing: isEdit, detailsLoaded: false });
    setEditData({ ...fix });

    try {
      const id = fix.fixid || fix.id;
      const res = await proposalService.getProposedFixDetails(id);

      if (res.success && res.data) {
        const fullData = { ...fix, ...res.data };
        
        // Parse stepsDetails if it's a string
        if (typeof fullData.stepsDetails === 'string') {
            try {
                fullData.stepsDetails = JSON.parse(fullData.stepsDetails);
            } catch (e) {
                // If not JSON, treat as single string in array
                fullData.stepsDetails = [fullData.stepsDetails];
            }
        } else if (!fullData.stepsDetails) {
             fullData.stepsDetails = [''];
        }

        // Parse relatedDocsDetails if it's a string (IDs)
        if (typeof fullData.relatedDocsDetails === 'string') {
            try {
                fullData.relatedDocsDetails = JSON.parse(fullData.relatedDocsDetails);
            } catch (e) {
                 fullData.relatedDocsDetails = [];
            }
        } else if (!fullData.relatedDocsDetails) {
            fullData.relatedDocsDetails = [];
        }

        setViewModal(prev => ({ ...prev, data: fullData, loading: false, detailsLoaded: true }));
        if (isEdit) {
          setEditData(fullData);
        }
      } else {
        // Fallback to basic data 
        setViewModal(prev => ({ ...prev, loading: false, detailsLoaded: false }));
      }
    } catch (err) {
      console.error("Failed to fetch fix details", err);
      setViewModal(prev => ({ ...prev, loading: false, detailsLoaded: false }));
    }
  };

  const handleEditProposition = () => {
    setEditData({ ...viewModal.data });
    setViewModal(prev => ({ ...prev, isEditing: true }));
  };

  const handleUpdateProposition = async () => {
    try {
      const id = viewModal.type === 'doc'
        ? (viewModal.data.proposeddocid || viewModal.data.id)
        : (viewModal.data.fixid || viewModal.data.id);

      let res;
      // Sanitize editData to remove non-updatable fields or join data that causes DB errors
      const { users, created_at, id: _id, proposeddocid: _pdid, fixid: _fid, documents, removeImage, relatedDocuments, ...restPayload } = editData;

      // CRITICAL: Ensure mandatory fields are present to prevent backend crash (TypeError on steps.length)
      // We use viewModal.data as a fallback to ensure we don't send empty values to the server
      const sanitizedPayload = { ...restPayload };

      if (viewModal.type === 'doc') {
        sanitizedPayload.docname = sanitizedPayload.docname || viewModal.data.docname || "";
        sanitizedPayload.doctype = sanitizedPayload.doctype || viewModal.data.doctype || "Administrative Services";
        sanitizedPayload.steps = sanitizedPayload.steps || viewModal.data.steps || [];
        
        // Handle relateddocs: convert PostgreSQL format to array
        let relateddocs = sanitizedPayload.relateddocs || viewModal.data.relateddocs;
        if (typeof relateddocs === 'string') {
          // If it's a string like "{uuid1,uuid2}", parse it to an array
          try {
            relateddocs = relateddocs.replace(/^\{|\}$/g, '').split(',').map(s => s.trim()).filter(s => s);
          } catch (e) {
            relateddocs = [];
          }
        }
        // Keep it as an array - FormData will handle it correctly
        sanitizedPayload.relateddocs = Array.isArray(relateddocs) ? relateddocs : [];

        // Handle image removal: if removeImage flag is true, set docpicture to null
        if (removeImage) {
          console.log('🗑️ User requested image removal');
          sanitizedPayload.docpicture = null;
        }

        console.log('📤 Sending payload:', {
          ...sanitizedPayload,
          docpicture: sanitizedPayload.docpicture instanceof File ? 'File' : sanitizedPayload.docpicture
        });

        // Ensure price is a valid number, even if entered as a string
        if (sanitizedPayload.docprice !== undefined) {
          sanitizedPayload.docprice = parseInt(sanitizedPayload.docprice) || 0;
        }
      }

      if (viewModal.type === 'doc') {
        res = await proposalService.editProposedDocument(id, sanitizedPayload);
      } else {
        // For fix, stringify array fields
        if (Array.isArray(sanitizedPayload.stepsDetails)) {
             sanitizedPayload.stepsDetails = JSON.stringify(sanitizedPayload.stepsDetails);
        }
        if (Array.isArray(sanitizedPayload.relatedDocsDetails)) {
             sanitizedPayload.relatedDocsDetails = JSON.stringify(sanitizedPayload.relatedDocsDetails);
        }
        res = await proposalService.editProposedFix(id, sanitizedPayload);
      }

      if (res.success) {
        // Update local state
        // Prepare clean update data (remove frontend-only flags)
        const { removeImage, ...cleanEditData } = editData;
        const updatedData = {
          ...cleanEditData,
          // If image was removed, ensure docpicture is null in local state
          docpicture: removeImage ? null : cleanEditData.docpicture
        };

        if (viewModal.type === 'doc') {
          setContributions(prev => ({
            ...prev,
            documents: prev.documents.map(d => (d.proposeddocid === id ? { ...d, ...updatedData } : d))
          }));
        } else {
          setContributions(prev => ({
            ...prev,
            fixes: prev.fixes.map(f => (f.fixid === id ? { ...f, ...updatedData } : f))
          }));
        }

        setViewModal(prev => ({ ...prev, data: { ...prev.data, ...updatedData }, isEditing: false }));
        Swal.fire('Updated!', 'Your proposal has been updated.', 'success');
      } else {
        Swal.fire('Error!', res.error || 'Failed to update.', 'error');
      }
    } catch (err) {
      console.error("Update failed", err);
      Swal.fire('Error!', 'An unexpected error occurred.', 'error');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = () => {
    setOriginalFormData({ ...formData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (originalFormData) {
      setFormData(originalFormData);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const response = await api.patch('/user/updateProfile', {
        name: formData.name.trim()
      });

      if (response.success) {
        setIsEditing(false);
        await checkAuth();

        Swal.fire({
          title: 'Updated!',
          text: 'Your profile has been updated successfully.',
          icon: 'success',
          confirmButtonColor: '#10b981',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error || 'Failed to update profile. Please try again.',
          icon: 'error',
          confirmButtonColor: '#10b981',
        });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to update profile. Please try again.',
        icon: 'error',
        confirmButtonColor: '#10b981',
      });
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: "Are you sure you want to logout?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, logout'
    });

    if (result.isConfirmed) {
      try {
        await logout();
        navigate('/');
        Swal.fire({
          title: 'Logged Out',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Logout error:', error);
        navigate('/');
      }
    }
  };

  return (
    <>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, message: '' })}
      />

      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          {/* Success Message */}
          {showSuccess && (
            <div className="fixed top-24 right-8 z-50 animate-slide-in">
              <div className="bg-white rounded-lg shadow-2xl border-l-4 border-green-500 p-4 flex items-center gap-3 min-w-[300px]">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Success!</h3>
                  <p className="text-sm text-gray-600">Profile updated successfully</p>
                </div>
              </div>
            </div>
          )}

          <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-4 md:p-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900 truncate">
                    {formData.name || 'User Profile'}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1 truncate">
                    {formData.email}
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-md transition-colors flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-md transition-colors flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                  )}
                  {!isEditing ? (
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-md transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  ) : (
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2.5 rounded-md transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Full Name and ID Card Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled={true}
                      className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>



              </div>
            </div>

            {/* Contributions Section - Only for non-admin users */}
            {authUser && authUser.role !== 'admin' && (
              <div className="max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-sm p-4 md:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">My Contributions</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Proposed Documents */}
                  <div>
                    <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                      📄 Proposed Documents
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{contributions.documents.length}</span>
                    </h3>
                    <div className="space-y-3">
                      {contributions.documents.length > 0 ? (
                        contributions.documents.map(doc => (
                          <div key={doc.proposeddocid} className="p-3 border rounded-lg bg-gray-50 flex justify-between items-center group hover:border-green-200 transition-colors gap-3">
                            <div className="min-w-0 flex-1">
                              <span className="font-medium text-gray-800 truncate block text-sm">{doc.docname}</span>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                onClick={() => handleViewDoc(doc)}
                                className="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleViewDoc(doc, true)}
                                className="text-gray-400 hover:text-green-500 p-1 rounded-full hover:bg-green-50 transition-all opacity-0 group-hover:opacity-100"
                                title="Edit Proposal"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteDoc(doc.proposeddocid)}
                                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                title="Delete Proposal"
                              >
                                <LogOut className="w-4 h-4 transform rotate-180" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 italic">No documents proposed yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Proposed Fixes */}
                  <div>
                    <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                      🔧 Proposed Fixes
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{contributions.fixes.length}</span>
                    </h3>
                    <div className="space-y-3">
                      {contributions.fixes.length > 0 ? (
                        contributions.fixes.map(fix => (
                          <div key={fix.fixid} className="p-3 border rounded-lg bg-gray-50 flex justify-between items-center group hover:border-blue-200 transition-colors gap-3">
                            <div className="min-w-0 flex-1">
                              <span className="font-medium text-gray-800 block text-sm truncate">{fix.documents?.docname || 'Unknown Document'}</span>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                onClick={() => handleViewFix(fix)}
                                className="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleViewFix(fix, true)}
                                className="text-gray-400 hover:text-green-500 p-1 rounded-full hover:bg-green-50 transition-all opacity-0 group-hover:opacity-100"
                                title="Edit Fix"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteFix(fix.fixid)}
                                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                title="Delete Fix"
                              >
                                <LogOut className="w-4 h-4 transform rotate-180" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 italic">No fixes proposed yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* View Modal */}
      {viewModal.isOpen && viewModal.data && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[60] backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-slide-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                {viewModal.type === 'doc' ? 'Proposed Document' : 'Proposed Fix'}
              </h2>
              <button
                onClick={() => setViewModal({ ...viewModal, isOpen: false })}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {viewModal.loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : viewModal.type === 'doc' ? (
                <div className="space-y-6">
                  {!viewModal.isEditing ? (
                    <>
                      <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
                        <img
                          src={getImgSrc(viewModal.data.docpicture)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">Name</span>
                          <span className="font-semibold text-gray-900">{viewModal.data.docname}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">Type</span>
                          <span className="font-semibold text-gray-900">{viewModal.data.doctype}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">Price</span>
                          <span className="font-semibold text-green-700">{viewModal.data.docprice} DA</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">Duration</span>
                          <span className="font-semibold text-blue-700">{viewModal.data.duration}</span>
                        </div>
                      </div>
                      {viewModal.data.steps && (
                        <div className="mt-4">
                          <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider mb-2">Steps</span>
                          <div className="space-y-2">
                            {Array.isArray(viewModal.data.steps) ? viewModal.data.steps.map((step, i) => (
                              <div key={i} className="text-sm p-2 bg-gray-50 rounded border flex gap-2">
                                <span className="font-bold text-green-600">{i + 1}.</span>
                                {step}
                              </div>
                            )) : <p className="text-sm text-gray-600">{viewModal.data.steps}</p>}
                          </div>
                        </div>
                      )}
                      {viewModal.data.relateddocs && (
                        <div className="mt-4">
                          <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider mb-2">Related Documents</span>
                          <div className="flex flex-wrap gap-2">
                            {viewModal.data.relatedDocuments && Array.isArray(viewModal.data.relatedDocuments) && viewModal.data.relatedDocuments.length > 0 ? (
                              viewModal.data.relatedDocuments.map((doc) => (
                                <span key={doc.docid} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                                  {doc.docname}
                                </span>
                              ))
                            ) : Array.isArray(viewModal.data.relateddocs) ? (
                              viewModal.data.relateddocs.map((rd) => (
                                <span key={rd} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                                  {getDocNameById(rd)}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-gray-600">{getDocNameById(viewModal.data.relateddocs)}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-4">
                      {viewModal.type === 'doc' && !viewModal.detailsLoaded && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium">
                          ⚠️ The server could not load procedure details (Steps, Price, Duration).
                          You can still update the Name/Category/Image, but other fields will be preserved as they are in the database.
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Document Name</label>
                        <input
                          type="text"
                          value={editData.docname || ''}
                          onChange={(e) => setEditData({ ...editData, docname: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Document Type</label>
                        <select
                          value={editData.doctype || ''}
                          onChange={(e) => setEditData({ ...editData, doctype: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        >
                          <option value="Biometric Services">Biometric Services</option>
                          <option value="Civil Status Services">Civil Status Services</option>
                          <option value="Administrative Services">Administrative Services</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Document Image</label>

                        {/* Current Image Preview */}
                        {(editData.docpicture || viewModal.data.docpicture) && !editData.removeImage && (
                          <div className="mb-3 relative">
                            <img
                              src={editData.docpicture instanceof File
                                ? URL.createObjectURL(editData.docpicture)
                                : getImgSrc(viewModal.data.docpicture)
                              }
                              alt="Current"
                              className="w-full h-40 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => setEditData({ ...editData, docpicture: null, removeImage: true })}
                              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                              title="Remove Image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {/* Upload New Image or Restore */}
                        {editData.removeImage ? (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setEditData({ ...editData, removeImage: false })}
                              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                              Restore Image
                            </button>
                          </div>
                        ) : (
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                setEditData({ ...editData, docpicture: e.target.files[0], removeImage: false });
                              }
                            }}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (DA)</label>
                          <input
                            type="number"
                            value={editData.docprice || ''}
                            onChange={(e) => setEditData({ ...editData, docprice: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duration</label>
                          <input
                            type="text"
                            value={editData.duration || ''}
                            onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="e.g. 5-10 days"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Steps</label>
                        <div className="space-y-2">
                          {(Array.isArray(editData.steps) ? editData.steps : []).map((step, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="flex-shrink-0 w-6 h-10 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-500">{index + 1}.</span>
                              </div>
                              <input
                                type="text"
                                value={step}
                                onChange={(e) => {
                                  const newSteps = [...(Array.isArray(editData.steps) ? editData.steps : [])];
                                  newSteps[index] = e.target.value;
                                  setEditData({ ...editData, steps: newSteps });
                                }}
                                placeholder={`Step ${index + 1}`}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                              />
                              {(Array.isArray(editData.steps) ? editData.steps : []).length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newSteps = (Array.isArray(editData.steps) ? editData.steps : []).filter((_, i) => i !== index);
                                    setEditData({ ...editData, steps: newSteps });
                                  }}
                                  className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Remove step"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const currentSteps = Array.isArray(editData.steps) ? editData.steps : [];
                            setEditData({ ...editData, steps: [...currentSteps, ''] });
                          }}
                          className="mt-2 w-full px-3 py-2 border-2 border-dashed border-green-300 text-green-600 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <span className="text-lg">+</span> Add Step
                        </button>
                      </div>
                      <div>
                        <MultiSelectDropdown
                          label="Related Documents"
                          options={allDocuments.map(d => ({ id: d.docid || d.id, name: d.docname }))}
                          selected={Array.isArray(editData.relateddocs) ? editData.relateddocs : []}
                          onChange={(updated) => setEditData({ ...editData, relateddocs: updated })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {!viewModal.isEditing ? (
                    <>
                      {viewModal.data.documents && (
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                          <span className="text-xs text-blue-600 block uppercase font-bold tracking-wider mb-1">Target Document</span>
                          <span className="font-semibold text-gray-900">{viewModal.data.documents.docname}</span>
                        </div>
                      )}
                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 border-b pb-2">Proposed Fixes:</h4>
                        <div className="space-y-3">
                          {viewModal.data.stepsProblem && (
                            <div className="p-3 bg-gray-50 border rounded-lg">
                              <span className="text-xs font-bold text-red-600 block uppercase mb-1">Corrected Steps:</span>
                              {Array.isArray(viewModal.data.stepsDetails) ? (
                                <div className="space-y-1">
                                  {viewModal.data.stepsDetails.map((step, i) => (
                                    <div key={i} className="text-sm text-gray-700 flex gap-2">
                                      <span className="font-bold">{i + 1}.</span>
                                      <span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{viewModal.data.stepsDetails}</p>
                              )}
                            </div>
                          )}
                          {viewModal.data.priceProblem && (
                            <div className="p-3 bg-gray-50 border rounded-lg">
                              <span className="text-xs font-bold text-red-600 block uppercase mb-1">Corrected Price:</span>
                              <p className="text-sm text-gray-700">{viewModal.data.priceDetails} DA</p>
                            </div>
                          )}
                          {viewModal.data.timeProblem && (
                            <div className="p-3 bg-gray-50 border rounded-lg">
                              <span className="text-xs font-bold text-red-600 block uppercase mb-1">Corrected Duration:</span>
                              <p className="text-sm text-gray-700">{viewModal.data.timeDetails} Days</p>
                            </div>
                          )}
                          {viewModal.data.relatedDocsProblem && (
                            <div className="p-3 bg-gray-50 border rounded-lg">
                              <span className="text-xs font-bold text-red-600 block uppercase mb-1">Required Documents Fix:</span>
                              {Array.isArray(viewModal.data.relatedDocsDetails) ? (
                                <div className="flex flex-wrap gap-2">
                                  {viewModal.data.relatedDocsDetails.map((docId, i) => (
                                    <span key={i} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-full border border-red-100">
                                      {getDocNameById(docId)}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{viewModal.data.relatedDocsDetails}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Corrected Steps (Optional)</label>
                            <div className="space-y-2">
                              {(Array.isArray(editData.stepsDetails) ? editData.stepsDetails : []).map((step, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <div className="flex-shrink-0 w-6 h-10 flex items-center justify-center">
                                    <span className="text-xs font-bold text-gray-500">{index + 1}.</span>
                                  </div>
                                  <input
                                    type="text"
                                    value={step}
                                    onChange={(e) => {
                                      const newSteps = [...(Array.isArray(editData.stepsDetails) ? editData.stepsDetails : [])];
                                      newSteps[index] = e.target.value;
                                      setEditData({ ...editData, stepsDetails: newSteps, stepsProblem: true });
                                    }}
                                    placeholder={`Step ${index + 1}`}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                  />
                                  {(Array.isArray(editData.stepsDetails) ? editData.stepsDetails : []).length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newSteps = (Array.isArray(editData.stepsDetails) ? editData.stepsDetails : []).filter((_, i) => i !== index);
                                        setEditData({ ...editData, stepsDetails: newSteps });
                                      }}
                                      className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Remove step"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const currentSteps = Array.isArray(editData.stepsDetails) ? editData.stepsDetails : [];
                                setEditData({ ...editData, stepsDetails: [...currentSteps, ''], stepsProblem: true });
                              }}
                              className="mt-2 w-full px-3 py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                            >
                              <span className="text-lg">+</span> Add Step
                            </button>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Corrected Price (Optional)</label>
                            <input
                              type="text"
                              value={editData.priceDetails || ''}
                              onChange={(e) => setEditData({ ...editData, priceDetails: e.target.value, priceProblem: !!e.target.value })}
                              placeholder="e.g., 500"
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duration Fix (Optional)</label>
                            <input
                              type="text"
                              value={editData.timeDetails || ''}
                              onChange={(e) => setEditData({ ...editData, timeDetails: e.target.value, timeProblem: !!e.target.value })}
                              placeholder="e.g., 5 days"
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Required Docs Fix (Optional)</label>
                            <MultiSelectDropdown
                              label=""
                              options={allDocuments.map(d => ({ id: d.docid || d.id, name: d.docname }))}
                              selected={Array.isArray(editData.relatedDocsDetails) ? editData.relatedDocsDetails : []}
                              onChange={(updated) => setEditData({ ...editData, relatedDocsDetails: updated, relatedDocsProblem: updated.length > 0 })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              {!viewModal.isEditing ? (
                <>
                  <button
                    onClick={handleEditProposition}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setViewModal({ ...viewModal, isOpen: false })}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition-colors"
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleUpdateProposition}
                    disabled={viewModal.type === 'doc' && !viewModal.detailsLoaded}
                    className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${(viewModal.type === 'doc' && !viewModal.detailsLoaded)
                      ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                      : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                  >
                    <Check className="w-4 h-4" />
                    {viewModal.type === 'doc' && !viewModal.detailsLoaded ? 'Incomplete Data' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setViewModal(prev => ({ ...prev, isEditing: false }))}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}