import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Edit2, Check, LogOut } from 'lucide-react';
import authService from '../services/authService';
import userService from '../services/userService';
import proposalService from '../services/proposalService';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';

export default function ProfileForm() {
  const navigate = useNavigate();
  const { user: authUser, checkAuth, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
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
    if (!window.confirm("Are you sure you want to delete this proposal?")) return;

    const res = await proposalService.deleteProposedDocument(id);
    if (res.success) {
      setContributions(prev => ({
        ...prev,
        documents: prev.documents.filter(d => d.proposeddocid !== id)
      }));
      setNotification({ message: 'Proposal deleted successfully', type: 'success' });
    } else {
      setNotification({ message: 'Failed to delete proposal', type: 'error' });
    }
  };

  const handleDeleteFix = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fix?")) return;

    const res = await proposalService.deleteProposedFix(id);
    if (res.success) {
      setContributions(prev => ({
        ...prev,
        fixes: prev.fixes.filter(f => f.fixid !== id)
      }));
      setNotification({ message: 'Fix deleted successfully', type: 'success' });
    } else {
      setNotification({ message: 'Failed to delete fix', type: 'error' });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await userService.updateProfile({
        name: formData.name,
        email: formData.email
      });

      if (response.success) {
        setIsEditing(false);
        setShowSuccess(true);
        // Refresh auth state to update navbar etc if name changed
        await checkAuth();

        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
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

          <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {formData.name || 'User Profile'}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {formData.email}
                  </p>
                </div>
                <div className="flex items-center gap-3">
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
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-md transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
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
                      className={`w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isEditing ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                    />
                  </div>
<div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-md text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>




              </div>
            </div>

            {/* Contributions Section - Only for non-admin users */}
            {authUser && authUser.role !== 'admin' && (
              <div className="max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-sm p-8">
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
                          <div key={doc.proposeddocid} className="p-3 border rounded-lg bg-gray-50 flex justify-between items-center group hover:border-green-200 transition-colors">
                            <span className="font-medium text-gray-800">{doc.docname}</span>
                            <button
                              onClick={() => handleDeleteDoc(doc.proposeddocid)}
                              className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                              title="Delete Proposal"
                            >
                              <LogOut className="w-4 h-4 transform rotate-180" />
                            </button>
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
                          <div key={fix.fixid} className="p-3 border rounded-lg bg-gray-50 flex justify-between items-center group hover:border-blue-200 transition-colors">
                            <div>
                              <span className="font-medium text-gray-800 block text-sm">{fix.documents?.docname || 'Unknown Document'}</span>
                              <span className="text-xs text-gray-500">Fix ID: {fix.fixid}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteFix(fix.fixid)}
                              className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                              title="Delete Fix"
                            >
                              <LogOut className="w-4 h-4 transform rotate-180" />
                            </button>
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

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}