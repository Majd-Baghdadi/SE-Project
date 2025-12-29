import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Form submitted:', formData);
    setSubmitStatus('success');

    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      message: ''
    });

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSubmitStatus(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
              Contact Us
            </h1>
            <p className="text-gray-600">
              Any question or remarks? Just write us a message!
            </p>
          </div>

          {/* Main Contact Container */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">

              {/* Contact Information Section - Stacked Vertically */}
              <div className="lg:col-span-1 bg-green-600 p-8 text-white space-y-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-2">
                    Contact Information
                  </h2>
                  <p className="text-green-100 text-sm">
                    Say something to start a live chat!
                  </p>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4 p-4 bg-green-500 bg-opacity-30 rounded-lg">
                  <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <div>
                    <div className="text-xs text-green-100 mb-1">Phone</div>
                    <div className="font-medium">0558273849</div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4 p-4 bg-green-500 bg-opacity-30 rounded-lg">
                  <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <div>
                    <div className="text-xs text-green-100 mb-1">Email</div>
                    <div className="font-medium">Goverment@gmail.com</div>
                  </div>
                </div>

                {/* Location */}
                {/* <div className="flex items-start space-x-4 p-4 bg-green-500 bg-opacity-30 rounded-lg">
                  <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-xs text-green-100 mb-1">Address</div>
                    <div className="font-medium text-sm">
                      132 Dartmouth Street<br />
                      Boston, MA 02156<br />
                      United States
                    </div>
                  </div>
                </div> */}
              </div>

              {/* Form Section */}
              <div className="lg:col-span-2 p-8">
                <div className="space-y-6">
                  {/* Full Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-2 border-b-2 ${errors.fullName ? 'border-red-500' : 'border-gray-300'} focus:border-green-600 outline-none transition-colors`}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email and Phone Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border-b-2 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-green-600 outline-none transition-colors`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 012 3456 789"
                        className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-green-600 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Write your message..."
                      rows="5"
                      className={`w-full px-4 py-3 border-2 ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none`}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                    )}
                  </div>

                  {/* Success Message */}
                  {submitStatus === 'success' && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-green-700 font-medium">
                          Message sent successfully! We'll get back to you soon.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmit}
                      className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all shadow-md hover:shadow-lg"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;