import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Edit2, Check, LogOut } from 'lucide-react';
import authService from '../services/authService';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!authService.isAuthenticated()) {
          navigate('/signin');
          return;
        }

        const response = await userService.getUserProfile();
        if (response.success && response.user) {
          setFormData(prev => ({
            ...prev,
            name: response.user.name || '',
            email: response.user.email || ''
          }));
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

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
                      disabled={!isEditing}
                      className={`w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isEditing ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                    />
                  </div>
                </div>

                {/* ID Card and Gender Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Card
                    </label>
                    <input
                      type="text"
                      name="idCard"
                      value={formData.idCard}
                      onChange={handleChange}
                      disabled
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-md text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-2.5 border border-gray-200 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isEditing ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${isEditing ? 'text-gray-700' : 'text-gray-400'
                        }`} />
                    </div>
                  </div>
                </div>

                {/* Place of Birth Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Place of Birth
                    </label>
                    <div className="relative">
                      <select
                        name="placeOfBirth"
                        value={formData.placeOfBirth}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-2.5 border border-gray-200 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isEditing ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        <option value="">Your Place of Birth</option>
                        <option value="algiers">Algiers</option>
                        <option value="oran">Oran</option>
                        <option value="constantine">Constantine</option>
                        <option value="annaba">Annaba</option>
                        <option value="blida">Blida</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${isEditing ? 'text-gray-700' : 'text-gray-400'
                        }`} />
                    </div>
                  </div>
                </div>

                {/* Phone Number and Date of Birth Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      disabled
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-md text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isEditing ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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