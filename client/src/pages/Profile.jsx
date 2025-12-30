import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ChevronDown, Edit2, Check, LogOut, Eye, X } from 'lucide-react';
import authService from '../services/authService';
import userService from '../services/userService';
import proposalService from '../services/proposalService';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';
import standard from '../assets/images/standard2.png';
import api from '../services/api';

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

        const profileRes = await userService.getUserProfile();

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

  const handleViewDoc = async (doc) => {
    setViewModal({ isOpen: true, type: 'doc', data: doc, loading: true });
    try {
      const id = doc.proposeddocid || doc.id;
      const res = await proposalService.getProposedDocumentDetails(id);
      if (res.success) {
        setViewModal(prev => ({ ...prev, data: res.data, loading: false }));
      } else {
        setViewModal(prev => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.error("Failed to fetch doc details", err);
      setViewModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleViewFix = (fix) => {
    setViewModal({ isOpen: true, type: 'fix', data: fix, loading: false, isEditing: false });
    setEditData({ ...fix });
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
      if (viewModal.type === 'doc') {
        res = await proposalService.editProposedDocument(id, editData);
      } else {
        res = await proposalService.editProposedFix(id, editData);
      }

      if (res.success) {
        // Update local state
        if (viewModal.type === 'doc') {
          setContributions(prev => ({
            ...prev,
            documents: prev.documents.map(d => (d.proposeddocid === id ? { ...d, ...editData } : d))
          }));
        } else {
          setContributions(prev => ({
            ...prev,
            fixes: prev.fixes.map(f => (f.fixid === id ? { ...f, ...editData } : f))
          }));
        }

        setViewModal(prev => ({ ...prev, data: { ...prev.data, ...editData }, isEditing: false }));
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
                                onClick={() => {
                                  handleViewDoc(doc);
                                  setTimeout(() => setViewModal(prev => ({ ...prev, isEditing: true })), 100);
                                }}
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
                                onClick={() => {
                                  handleViewFix(fix);
                                  setViewModal(prev => ({ ...prev, isEditing: true }));
                                }}
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
                            {Array.isArray(viewModal.data.relateddocs) ? viewModal.data.relateddocs.map((rd, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                                {rd}
                              </span>
                            )) : <span className="text-sm text-gray-600">{viewModal.data.relateddocs}</span>}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-4">
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
                          <option value="Visa">Visa</option>
                          <option value="Passport">Passport</option>
                          <option value="ID Card">ID Card</option>
                          <option value="Birth Certificate">Birth Certificate</option>
                          <option value="Driving License">Driving License</option>
                          <option value="Marriage Certificate">Marriage Certificate</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Document Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setEditData({ ...editData, docpicture: e.target.files[0] });
                            }
                          }}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
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
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Steps (one per line)</label>
                        <textarea
                          rows="4"
                          value={Array.isArray(editData.steps) ? editData.steps.join('\n') : editData.steps || ''}
                          onChange={(e) => setEditData({ ...editData, steps: e.target.value.split('\n') })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Related Documents (comma separated)</label>
                        <input
                          type="text"
                          value={Array.isArray(editData.relateddocs) ? editData.relateddocs.join(', ') : editData.relateddocs || ''}
                          onChange={(e) => setEditData({ ...editData, relateddocs: e.target.value.split(',').map(s => s.trim()) })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                          placeholder="Doc A, Doc B, Doc C"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {!viewModal.isEditing ? (
                    <>
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <h4 className="font-bold text-amber-800 mb-2">Description of the issue:</h4>
                        <p className="text-amber-900 text-sm leading-relaxed">{viewModal.data.description}</p>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 border-b pb-2">Identified Problems:</h4>
                        <div className="flex flex-wrap gap-2">
                          {viewModal.data.stepsProblem && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Steps</span>}
                          {viewModal.data.priceProblem && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Price</span>}
                          {viewModal.data.timeProblem && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Duration</span>}
                          {viewModal.data.relatedDocsProblem && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Files</span>}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Issue Description</label>
                        <textarea
                          rows="4"
                          value={editData.description || ''}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mark problems with:</label>
                        <div className="grid grid-cols-2 gap-3">
                          <label className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editData.stepsProblem || false}
                              onChange={(e) => setEditData({ ...editData, stepsProblem: e.target.checked })}
                            />
                            <span className="text-sm">Steps</span>
                          </label>
                          <label className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editData.priceProblem || false}
                              onChange={(e) => setEditData({ ...editData, priceProblem: e.target.checked })}
                            />
                            <span className="text-sm">Price</span>
                          </label>
                          <label className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editData.timeProblem || false}
                              onChange={(e) => setEditData({ ...editData, timeProblem: e.target.checked })}
                            />
                            <span className="text-sm">Duration</span>
                          </label>
                          <label className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editData.relatedDocsProblem || false}
                              onChange={(e) => setEditData({ ...editData, relatedDocsProblem: e.target.checked })}
                            />
                            <span className="text-sm">Documents</span>
                          </label>
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
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Save Changes
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