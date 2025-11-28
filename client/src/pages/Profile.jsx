import { useState } from 'react';
import { ChevronDown, Edit2, Check } from 'lucide-react';
import NavBar from '../components/NavBar';

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: 'Alexa Rawles',
    idCard: '1234567890',
    gender: 'female',
    placeOfBirth: 'algiers',
    phoneNumber: '+213 555 123 456',
    dateOfBirth: '1995-03-15'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <>
      <NavBar />
      
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
              <h1 className="text-2xl font-semibold text-gray-900">Alexa Rawles</h1>
              <p className="text-gray-500 text-sm mt-1">alexarawles@gmail.com</p>
            </div>
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
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled
                  className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-md text-gray-500 cursor-not-allowed"
                />
              </div>
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
            </div>

            {/* Gender and Place of Birth Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className={`w-full px-4 py-2.5 border border-gray-200 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      isEditing ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${
                    isEditing ? 'text-gray-700' : 'text-gray-400'
                  }`} />
                </div>
              </div>
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
                    className={`w-full px-4 py-2.5 border border-gray-200 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      isEditing ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
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
                  <ChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${
                    isEditing ? 'text-gray-700' : 'text-gray-400'
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
                    className={`w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      isEditing ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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