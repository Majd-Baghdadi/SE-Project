import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  ChevronDown, 
  Edit2, 
  Check, 
  LogOut, 
  Eye, 
  X, 
  Link as LinkIcon,
  User,
  Mail,
  FileText,
  Wrench,
  Sparkles,
  Trash2,
  Save,
  ArrowLeft,
  Plus
} from 'lucide-react';
import authService from '../services/authService';
import userService from '../services/userService';
import proposalService from '../services/proposalService';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';
import standard from '../assets/images/standard2.png';
import api from '../services/api';
import documentService from '../services/documentService';

// ---------------- MultiSelectDropdown Component (Dark Theme) ----------------
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
      {label && <label className="block text-xs font-bold text-white/50 uppercase mb-2">{label}</label>}

      <div
        className={`w-full px-4 py-3 border ${error ? 'border-red-500/50' : 'border-white/20'} rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 hover:border-emerald-500/50 transition-all min-h-[50px] flex justify-between items-center`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-wrap gap-2 flex-1">
          {selected.length === 0 && (
            <span className="text-white/40 text-sm">Select required documents...</span>
          )}
          {selected.map((docId) => (
            <span
              key={docId}
              className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/30"
            >
              {getDocNameById(docId)}
              <button
                type="button"
                onClick={(e) => removeOption(docId, e)}
                className="text-emerald-400 hover:text-emerald-300 ml-1"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <ChevronDown className={`w-5 h-5 ${error ? 'text-red-400' : 'text-white/50'} ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}

      {open && (
        <div className="absolute w-full bg-slate-800/95 backdrop-blur-xl border border-white/20 mt-2 rounded-xl shadow-2xl max-h-60 overflow-auto z-[70]">
          {options.map((doc) => (
            <div
              key={doc.id}
              className={`px-4 py-3 cursor-pointer transition-all flex justify-between items-center text-sm ${
                selected.includes(doc.id)
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'hover:bg-white/10 text-white/80 hover:text-white'
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
    const doc = allDocuments.find(d => (d.docid || d.id) === id);
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
      confirmButtonText: 'Yes, delete it!',
      background: '#1e293b',
      color: '#fff'
    });

    if (result.isConfirmed) {
      const res = await proposalService.deleteProposedDocument(id);
      if (res.success) {
        setContributions(prev => ({
          ...prev,
          documents: prev.documents.filter(d => d.proposeddocid !== id)
        }));
        Swal.fire({
          title: 'Deleted!',
          text: 'Your proposal has been deleted.',
          icon: 'success',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete proposal.',
          icon: 'error',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
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
      confirmButtonText: 'Yes, delete it!',
      background: '#1e293b',
      color: '#fff'
    });

    if (result.isConfirmed) {
      const res = await proposalService.deleteProposedFix(id);
      if (res.success) {
        setContributions(prev => ({
          ...prev,
          fixes: prev.fixes.filter(f => f.fixid !== id)
        }));
        Swal.fire({
          title: 'Deleted!',
          text: 'Your fix proposal has been deleted.',
          icon: 'success',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete fix.',
          icon: 'error',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
      }
    }
  };

  const handleViewDoc = async (doc, isEdit = false) => {
    setViewModal({ isOpen: true, type: 'doc', data: doc, loading: true, isEditing: isEdit, detailsLoaded: false });
    setEditData({ ...doc });

    try {
      const id = doc.proposeddocid || doc.id;
      const res = await api.get(`/propose/proposedDocument/${id}`);
      const rawData = res.document || res.data || res;
      const actualData = Array.isArray(rawData) ? rawData[0] : rawData;

      if (actualData && (actualData.proposeddocid || actualData.id)) {
        const fullData = { 
          ...actualData,
          ...doc,
          steps: actualData.steps || doc.steps,
          docprice: actualData.docprice ?? doc.docprice,
          duration: actualData.duration || doc.duration,
        };
        
        setViewModal(prev => ({ ...prev, data: fullData, loading: false, detailsLoaded: true }));
        if (isEdit) {
          setEditData(fullData);
        }
      } else {
        throw new Error("No data returned");
      }
    } catch (err) {
      console.warn("Detail fetch failed, but keeping basic info:", err);
      setViewModal(prev => ({ ...prev, loading: false, detailsLoaded: false }));
      if (isEdit) {
        setNotification({
          message: 'Some fields could not be loaded due to a server error.',
          type: 'error'
        });
      }
    }
  };

  const handleViewFix = async (fix, isEdit = false) => {
    setViewModal({ isOpen: true, type: 'fix', data: fix, loading: true, isEditing: isEdit, detailsLoaded: false });
    setEditData({ ...fix });

    try {
      const id = fix.fixid || fix.id;
      const res = await proposalService.getProposedFixDetails(id);

      if (res.success && res.data) {
        const fullData = { ...fix, ...res.data };
        
        if (typeof fullData.stepsDetails === 'string') {
          try {
            fullData.stepsDetails = JSON.parse(fullData.stepsDetails);
          } catch (e) {
            fullData.stepsDetails = [fullData.stepsDetails];
          }
        } else if (!fullData.stepsDetails) {
          fullData.stepsDetails = [''];
        }

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
      const { users, created_at, id: _id, proposeddocid: _pdid, fixid: _fid, documents, removeImage, ...restPayload } = editData;
      const sanitizedPayload = { ...restPayload };

      if (viewModal.type === 'doc') {
        sanitizedPayload.docname = sanitizedPayload.docname || viewModal.data.docname || "";
        sanitizedPayload.doctype = sanitizedPayload.doctype || viewModal.data.doctype || "Administrative Services";
        sanitizedPayload.steps = sanitizedPayload.steps || viewModal.data.steps || [];
        sanitizedPayload.relateddocs = sanitizedPayload.relateddocs || viewModal.data.relateddocs || [];

        if (removeImage) {
          sanitizedPayload.docpicture = null;
        }

        if (sanitizedPayload.docprice !== undefined) {
          sanitizedPayload.docprice = parseInt(sanitizedPayload.docprice) || 0;
        }
      }

      if (viewModal.type === 'doc') {
        res = await proposalService.editProposedDocument(id, sanitizedPayload);
      } else {
        if (Array.isArray(sanitizedPayload.stepsDetails)) {
          sanitizedPayload.stepsDetails = JSON.stringify(sanitizedPayload.stepsDetails);
        }
        if (Array.isArray(sanitizedPayload.relatedDocsDetails)) {
          sanitizedPayload.relatedDocsDetails = JSON.stringify(sanitizedPayload.relatedDocsDetails);
        }
        res = await proposalService.editProposedFix(id, sanitizedPayload);
      }

      if (res.success) {
        const { removeImage, ...cleanEditData } = editData;
        const updatedData = {
          ...cleanEditData,
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
        Swal.fire({
          title: 'Updated!',
          text: 'Your proposal has been updated.',
          icon: 'success',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: res.error || 'Failed to update.',
          icon: 'error',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
      }
    } catch (err) {
      console.error("Update failed", err);
      Swal.fire({
        title: 'Error!',
        text: 'An unexpected error occurred.',
        icon: 'error',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#10b981'
      });
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
          background: '#1e293b',
          color: '#fff'
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: response.error || 'Failed to update profile. Please try again.',
          icon: 'error',
          confirmButtonColor: '#10b981',
          background: '#1e293b',
          color: '#fff'
        });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to update profile. Please try again.',
        icon: 'error',
        confirmButtonColor: '#10b981',
        background: '#1e293b',
        color: '#fff'
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
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, logout',
      background: '#1e293b',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        await logout();
        navigate('/');
        Swal.fire({
          title: 'Logged Out',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: '#1e293b',
          color: '#fff'
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
        <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${authUser?.role === 'admin' ? 'from-slate-900 via-slate-800 to-slate-900' : 'from-slate-900 via-emerald-900 to-slate-900'}`}>
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-white/60">Loading profile...</p>
          </div>
        </div>
      ) : (
        <div className={`min-h-screen bg-gradient-to-br ${authUser?.role === 'admin' ? 'from-slate-900 via-slate-800 to-slate-900' : 'from-slate-900 via-emerald-900 to-slate-900'} pt-24 pb-8 px-4 md:px-8 relative overflow-hidden`}>
          {/* Animated background shapes */}
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
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>

            {/* Profile Header Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 md:p-8 mb-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      {formData.name || 'User Profile'}
                    </h1>
                    <p className="text-white/60 flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4" />
                      {formData.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={handleEdit}
                        className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex-1 md:flex-none px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-semibold hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 md:flex-none px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled={true}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white/60 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Contributions Section - Only for non-admin users */}
            {authUser && authUser.role !== 'admin' && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">My Contributions</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Proposed Documents */}
                  <div className="bg-white/5 rounded-xl border border-white/10 p-5">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-400" />
                      Proposed Documents
                      <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full ml-auto">
                        {contributions.documents.length}
                      </span>
                    </h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {contributions.documents.length > 0 ? (
                        contributions.documents.map(doc => (
                          <div 
                            key={doc.proposeddocid} 
                            className="p-3 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center group hover:border-amber-500/30 transition-all"
                          >
                            <span className="font-medium text-white/80 truncate text-sm flex-1">
                              {doc.docname}
                            </span>
                            <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleViewDoc(doc)}
                                className="p-2 text-white/40 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleViewDoc(doc, true)}
                                className="p-2 text-white/40 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                                title="Edit Proposal"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteDoc(doc.proposeddocid)}
                                className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                title="Delete Proposal"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-white/40 italic text-center py-4">No documents proposed yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Proposed Fixes */}
                  <div className="bg-white/5 rounded-xl border border-white/10 p-5">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-blue-400" />
                      Proposed Fixes
                      <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full ml-auto">
                        {contributions.fixes.length}
                      </span>
                    </h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {contributions.fixes.length > 0 ? (
                        contributions.fixes.map(fix => (
                          <div 
                            key={fix.fixid} 
                            className="p-3 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center group hover:border-blue-500/30 transition-all"
                          >
                            <span className="font-medium text-white/80 truncate text-sm flex-1">
                              {fix.documents?.docname || 'Unknown Document'}
                            </span>
                            <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleViewFix(fix)}
                                className="p-2 text-white/40 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleViewFix(fix, true)}
                                className="p-2 text-white/40 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                                title="Edit Fix"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteFix(fix.fixid)}
                                className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                title="Delete Fix"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-white/40 italic text-center py-4">No fixes proposed yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View/Edit Modal */}
      {viewModal.isOpen && viewModal.data && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {viewModal.type === 'doc' ? (
                  <><FileText className="w-5 h-5 text-amber-400" /> Proposed Document</>
                ) : (
                  <><Wrench className="w-5 h-5 text-blue-400" /> Proposed Fix</>
                )}
              </h2>
              <button
                onClick={() => setViewModal({ ...viewModal, isOpen: false })}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {viewModal.loading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                </div>
              ) : viewModal.type === 'doc' ? (
                <div className="space-y-6">
                  {!viewModal.isEditing ? (
                    <>
                      <div className="aspect-video w-full bg-white/5 rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={getImgSrc(viewModal.data.docpicture)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <span className="text-xs text-white/50 block uppercase font-bold tracking-wider mb-1">Name</span>
                          <span className="font-semibold text-white">{viewModal.data.docname}</span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <span className="text-xs text-white/50 block uppercase font-bold tracking-wider mb-1">Type</span>
                          <span className="font-semibold text-white">{viewModal.data.doctype}</span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <span className="text-xs text-white/50 block uppercase font-bold tracking-wider mb-1">Price</span>
                          <span className="font-semibold text-emerald-400">{viewModal.data.docprice} DA</span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <span className="text-xs text-white/50 block uppercase font-bold tracking-wider mb-1">Duration</span>
                          <span className="font-semibold text-blue-400">{viewModal.data.duration}</span>
                        </div>
                      </div>
                      {viewModal.data.steps && (
                        <div>
                          <span className="text-xs text-white/50 block uppercase font-bold tracking-wider mb-3">Steps</span>
                          <div className="space-y-2">
                            {Array.isArray(viewModal.data.steps) ? viewModal.data.steps.map((step, i) => (
                              <div key={i} className="text-sm p-3 bg-white/5 rounded-xl border border-white/10 flex gap-3 text-white/80">
                                <span className="font-bold text-emerald-400">{i + 1}.</span>
                                {step}
                              </div>
                            )) : <p className="text-sm text-white/70">{viewModal.data.steps}</p>}
                          </div>
                        </div>
                      )}
                      {viewModal.data.relateddocs && (
                        <div>
                          <span className="text-xs text-white/50 block uppercase font-bold tracking-wider mb-3">Required Documents</span>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(viewModal.data.relateddocs) ? viewModal.data.relateddocs.map((rd, i) => (
                              <span key={i} className="text-xs px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                                {getDocNameById(rd)}
                              </span>
                            )) : <span className="text-sm text-white/70">{getDocNameById(viewModal.data.relateddocs)}</span>}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-5">
                      {viewModal.type === 'doc' && !viewModal.detailsLoaded && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                          ⚠️ The server could not load some details. You can still update available fields.
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase mb-2">Document Name</label>
                        <input
                          type="text"
                          value={editData.docname || ''}
                          onChange={(e) => setEditData({ ...editData, docname: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase mb-2">Document Type</label>
                        <select
                          value={editData.doctype || ''}
                          onChange={(e) => setEditData({ ...editData, doctype: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                        >
                          <option value="Biometric Services" className="bg-slate-800">Biometric Services</option>
                          <option value="Civil Status Services" className="bg-slate-800">Civil Status Services</option>
                          <option value="Administrative Services" className="bg-slate-800">Administrative Services</option>
                          <option value="Other" className="bg-slate-800">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase mb-2">Document Image</label>
                        {(editData.docpicture || viewModal.data.docpicture) && !editData.removeImage && (
                          <div className="mb-3 relative">
                            <img
                              src={editData.docpicture instanceof File
                                ? URL.createObjectURL(editData.docpicture)
                                : getImgSrc(viewModal.data.docpicture)
                              }
                              alt="Current"
                              className="w-full h-40 object-cover rounded-xl border border-white/10"
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
                        {editData.removeImage ? (
                          <button
                            type="button"
                            onClick={() => setEditData({ ...editData, removeImage: false })}
                            className="w-full px-4 py-3 bg-white/5 text-white/70 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium border border-white/10"
                          >
                            Restore Image
                          </button>
                        ) : (
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                setEditData({ ...editData, docpicture: e.target.files[0], removeImage: false });
                              }
                            }}
                            className="w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/20 file:text-emerald-400 hover:file:bg-emerald-500/30 file:cursor-pointer"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-white/50 uppercase mb-2">Price (DA)</label>
                          <input
                            type="number"
                            value={editData.docprice || ''}
                            onChange={(e) => setEditData({ ...editData, docprice: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-white/50 uppercase mb-2">Duration</label>
                          <input
                            type="text"
                            value={editData.duration || ''}
                            onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                            placeholder="e.g. 5-10 days"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase mb-3">Steps</label>
                        <div className="space-y-2">
                          {(Array.isArray(editData.steps) ? editData.steps : []).map((step, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <span className="text-xs font-bold text-emerald-400">{index + 1}</span>
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
                                className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all text-sm"
                              />
                              {(Array.isArray(editData.steps) ? editData.steps : []).length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newSteps = (Array.isArray(editData.steps) ? editData.steps : []).filter((_, i) => i !== index);
                                    setEditData({ ...editData, steps: newSteps });
                                  }}
                                  className="flex-shrink-0 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
                          className="mt-3 w-full px-4 py-2 border-2 border-dashed border-emerald-500/30 text-emerald-400 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <Plus className="w-4 h-4" /> Add Step
                        </button>
                      </div>
                      <MultiSelectDropdown
                        label="Required Documents"
                        options={allDocuments.map(d => ({ id: d.docid || d.id, name: d.docname }))}
                        selected={Array.isArray(editData.relateddocs) ? editData.relateddocs : []}
                        onChange={(updated) => setEditData({ ...editData, relateddocs: updated })}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {!viewModal.isEditing ? (
                    <>
                      {viewModal.data.documents && (
                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                          <span className="text-xs text-blue-400 block uppercase font-bold tracking-wider mb-1">Target Document</span>
                          <span className="font-semibold text-white">{viewModal.data.documents.docname}</span>
                        </div>
                      )}
                      <div className="space-y-4">
                        <h4 className="font-bold text-white border-b border-white/10 pb-2">Proposed Fixes:</h4>
                        <div className="space-y-3">
                          {viewModal.data.stepsProblem && (
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                              <span className="text-xs font-bold text-red-400 block uppercase mb-2">Corrected Steps:</span>
                              {Array.isArray(viewModal.data.stepsDetails) ? (
                                <div className="space-y-1">
                                  {viewModal.data.stepsDetails.map((step, i) => (
                                    <div key={i} className="text-sm text-white/80 flex gap-2">
                                      <span className="font-bold text-emerald-400">{i + 1}.</span>
                                      <span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-white/80">{viewModal.data.stepsDetails}</p>
                              )}
                            </div>
                          )}
                          {viewModal.data.priceProblem && (
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                              <span className="text-xs font-bold text-red-400 block uppercase mb-2">Corrected Price:</span>
                              <p className="text-sm text-emerald-400 font-semibold">{viewModal.data.priceDetails} DA</p>
                            </div>
                          )}
                          {viewModal.data.timeProblem && (
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                              <span className="text-xs font-bold text-red-400 block uppercase mb-2">Corrected Duration:</span>
                              <p className="text-sm text-blue-400 font-semibold">{viewModal.data.timeDetails} Days</p>
                            </div>
                          )}
                          {viewModal.data.relatedDocsProblem && (
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                              <span className="text-xs font-bold text-red-400 block uppercase mb-2">Required Documents Fix:</span>
                              {Array.isArray(viewModal.data.relatedDocsDetails) ? (
                                <div className="flex flex-wrap gap-2">
                                  {viewModal.data.relatedDocsDetails.map((docId, i) => (
                                    <span key={i} className="text-xs px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30">
                                      {getDocNameById(docId)}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-white/80">{viewModal.data.relatedDocsDetails}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-5">
                          <div>
                            <label className="block text-xs font-bold text-white/50 uppercase mb-3">Corrected Steps</label>
                            <div className="space-y-2">
                              {(Array.isArray(editData.stepsDetails) ? editData.stepsDetails : []).map((step, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <span className="text-xs font-bold text-blue-400">{index + 1}</span>
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
                                    className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 text-sm"
                                  />
                                  {(Array.isArray(editData.stepsDetails) ? editData.stepsDetails : []).length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newSteps = (Array.isArray(editData.stepsDetails) ? editData.stepsDetails : []).filter((_, i) => i !== index);
                                        setEditData({ ...editData, stepsDetails: newSteps });
                                      }}
                                      className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"
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
                              className="mt-2 w-full px-3 py-2 border-2 border-dashed border-blue-500/30 text-blue-400 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/10 transition-all flex items-center justify-center gap-2 text-sm"
                            >
                              <Plus className="w-4 h-4" /> Add Step
                            </button>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/50 uppercase mb-2">Corrected Price</label>
                            <input
                              type="text"
                              value={editData.priceDetails || ''}
                              onChange={(e) => setEditData({ ...editData, priceDetails: e.target.value, priceProblem: !!e.target.value })}
                              placeholder="e.g., 500"
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-5">
                          <div>
                            <label className="block text-xs font-bold text-white/50 uppercase mb-2">Duration Fix</label>
                            <input
                              type="text"
                              value={editData.timeDetails || ''}
                              onChange={(e) => setEditData({ ...editData, timeDetails: e.target.value, timeProblem: !!e.target.value })}
                              placeholder="e.g., 5 days"
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 text-sm"
                            />
                          </div>
                          <MultiSelectDropdown
                            label="Required Docs Fix"
                            options={allDocuments.map(d => ({ id: d.docid || d.id, name: d.docname }))}
                            selected={Array.isArray(editData.relatedDocsDetails) ? editData.relatedDocsDetails : []}
                            onChange={(updated) => setEditData({ ...editData, relatedDocsDetails: updated, relatedDocsProblem: updated.length > 0 })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
              {!viewModal.isEditing ? (
                <>
                  <button
                    onClick={handleEditProposition}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setViewModal({ ...viewModal, isOpen: false })}
                    className="px-6 py-2.5 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleUpdateProposition}
                    disabled={viewModal.type === 'doc' && !viewModal.detailsLoaded}
                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                      (viewModal.type === 'doc' && !viewModal.detailsLoaded)
                        ? 'bg-white/10 text-white/40 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    {viewModal.type === 'doc' && !viewModal.detailsLoaded ? 'Incomplete Data' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setViewModal(prev => ({ ...prev, isEditing: false }))}
                    className="px-6 py-2.5 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
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
