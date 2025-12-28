import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import NavBar from '../components/NavBar';

const AboutUsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ type: '', value: '' });

  const statisticsData = [
    {
      number: "1000+",
      label: "Number of Visitors"
    },
    {
      number: "250+", 
      label: "Number of Users"
    }
  ];

  const teamMembers = [
    "Madjd Baghdadi",
    "Dhiaa Eddine Zeroual", 
    "Aimene Boughenama",
    "Imene Tifour",
    "Amel Saidouni"
  ];

  const handleContactClick = (type, value) => {
    setModalContent({ type, value });
    setShowModal(true);
  };

  const handleProceed = () => {
    if (modalContent.type === 'phone') {
      window.open(`tel:${modalContent.value}`, '_self');
    } else if (modalContent.type === 'email') {
      window.open(`mailto:${modalContent.value}`, '_self');
    }
    setShowModal(false);
  };

  return (
    <>
      <Helmet>
        <title>About Us - Community Platform | Document Procedure Services</title>
        <meta name="description" content="Learn about our community-supervised platform that simplifies government document procedures. Meet our dedicated team helping citizens navigate visa, passport, and ID card applications efficiently." />
        <meta property="og:title" content="About Us - Community Platform | Document Procedure Services" />
        <meta property="og:description" content="Learn about our community-supervised platform that simplifies government document procedures. Meet our dedicated team helping citizens navigate visa, passport, and ID card applications efficiently." />
      </Helmet>
      <NavBar />
      <div className="w-full bg-white">

        {/* Hero Section */}
        <section 
          className="relative w-full h-[300px] sm:h-[400px] md:h-[530px] flex items-center justify-center bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/img_postivecaringrelationshipsteachers_4.png')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-[56px] max-w-[1440px] mx-auto">
            <h1 
              className="text-white text-center mb-4 sm:mb-6"
              style={{
                fontSize: "clamp(32px, 5vw, 42px)",
                fontFamily: "Source Serif Pro",
                fontWeight: "700",
                lineHeight: "1.2"
              }}
            >
              About Us
            </h1>
            <p 
              className="text-white text-center max-w-2xl mx-auto"
              style={{
                fontSize: "clamp(14px, 2vw, 18px)",
                fontFamily: "Lato", 
                fontWeight: "500",
                lineHeight: "1.5"
              }}
            >
              Community-Supervised Platform to show Required Docs Procedures for Different Applications
            </p>
          </div>
        </section>

        {/* Our Service Section */}
        <section className="w-full py-12 sm:py-16 md:py-20 lg:py-[86px] bg-white">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[90px]">
            <div className="flex flex-col items-center gap-8 md:gap-9">
              
              {/* Section Title */}
              <div className="flex flex-col items-center gap-3 mb-6">
                <h2 
                  className="text-black text-center"
                  style={{
                    fontSize: "clamp(24px, 3vw, 28px)",
                    fontFamily: "Source Serif Pro",
                    fontWeight: "600", 
                    lineHeight: "1.3"
                  }}
                >
                  Our Service
                </h2>
                <img 
                  src="/images/img_vector.svg"
                  alt="Decorative line"
                  className="w-[200px] h-[28px] sm:w-[250px] sm:h-[32px] md:w-[282px] md:h-[40px]"
                />
              </div>

              {/* Service Description */}
              <div className="w-full max-w-4xl">
                <p 
                  className="text-center leading-relaxed"
                  style={{
                    fontSize: "clamp(16px, 2vw, 18px)",
                    fontFamily: "Song Myung, sans-serif",
                    fontWeight: "400",
                    lineHeight: "1.7", 
                    color: "#273248"
                  }}
                >
                  Our platform displays the required documents and procedures for applications such as visas, passports, and ID cards in a clear and organized way. We simplify administrative processes by gathering reliable, community-reviewed information in one place. Whether you are preparing an application or checking requirements, the platform makes the process faster and easier.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Vision Section */}
        <section className="w-full py-8 sm:py-12 md:py-16 bg-white">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[90px]">
            <div className="flex flex-col items-center gap-8 md:gap-9">
              
              {/* Section Title */}
              <div className="flex flex-col items-center gap-3 mb-6">
                <h2 
                  className="text-black text-center"
                  style={{
                    fontSize: "clamp(24px, 3vw, 28px)",
                    fontFamily: "Source Serif Pro", 
                    fontWeight: "600",
                    lineHeight: "1.3"
                  }}
                >
                  Our Vision
                </h2>
                <img 
                  src="/images/img_vector.svg"
                  alt="Decorative line"
                  className="w-[200px] h-[28px] sm:w-[250px] sm:h-[32px] md:w-[282px] md:h-[40px]"
                />
              </div>

              {/* Vision Description */}
              <div className="w-full max-w-4xl">
                <p 
                  className="text-center leading-relaxed"
                  style={{
                    fontSize: "clamp(16px, 2vw, 18px)",
                    fontFamily: "Song Myung, sans-serif",
                    fontWeight: "400", 
                    lineHeight: "1.7",
                    color: "#273248"
                  }}
                >
                  To create a trusted and user-friendly platform that brings together clear, accurate, and easily accessible administrative information, helping everyone understand the documents and procedures they need without confusion or difficulty.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="w-full py-8 sm:py-12 md:py-16 bg-white">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[90px]">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-[112px]">
              
              {statisticsData?.map((stat, index) => (
                <div 
                  key={index}
                  className="w-full sm:w-auto bg-white border border-gray-200 rounded-lg p-6 sm:p-8 md:p-10 shadow-sm text-center flex flex-col items-center justify-center"
                  style={{
                    minWidth: "280px",
                    maxWidth: "320px",
                    minHeight: "140px",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)"
                  }}
                >
                  <h3 
                    className="mb-2"
                    style={{
                      fontSize: "clamp(28px, 4vw, 36px)",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: "600",
                      lineHeight: "1.2",
                      textAlign: "center",
                      color: "#313131"
                    }}
                  >
                    {stat?.number}
                  </h3>
                  <p 
                    style={{
                      fontSize: "clamp(14px, 1.5vw, 16px)", 
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: "400",
                      lineHeight: "1.5",
                      textAlign: "center",
                      color: "#61646b"
                    }}
                  >
                    {stat?.label}
                  </p>
                </div>
              ))}
              
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="w-full py-12 sm:py-16 md:py-[102px] bg-white">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[56px]">
            <div className="flex flex-col items-center">
              
              {/* Section Title */}
              <div className="flex flex-col items-center gap-3 mb-10 sm:mb-12 md:mb-16">
                <h2 
                  className="text-black text-center"
                  style={{
                    fontSize: "clamp(24px, 3vw, 28px)",
                    fontFamily: "Source Serif Pro",
                    fontWeight: "600",
                    lineHeight: "1.3"
                  }}
                >
                  Our Team
                </h2>
                <img 
                  src="/images/img_vector.svg"
                  alt="Decorative line"
                  className="w-[200px] h-[28px] sm:w-[250px] sm:h-[32px] md:w-[282px] md:h-[40px]"
                />
              </div>

              {/* Team Members Grid */}
              <div className="w-full max-w-6xl mx-auto">
                {/* First Row - 3 members */}
                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
                  {teamMembers?.slice(0, 3)?.map((name, index) => (
                    <div 
                      key={index}
                      className="bg-primary-background rounded-lg px-6 sm:px-8 md:px-10 py-4 sm:py-5 text-center shadow-md hover:shadow-lg transition-shadow duration-300"
                      style={{ 
                        backgroundColor: "#37a331",
                        minWidth: "200px",
                        width: "100%",
                        maxWidth: "260px"
                      }}
                    >
                      <span 
                        className="block"
                        style={{
                          fontSize: "clamp(15px, 1.5vw, 17px)",
                          fontFamily: "Arimo, sans-serif",
                          fontWeight: "500",
                          lineHeight: "1.4",
                          textAlign: "center",
                          color: "#ffffff"
                        }}
                      >
                        {name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Second Row - 2 members (centered) */}
                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8">
                  {teamMembers?.slice(3)?.map((name, index) => (
                    <div 
                      key={index + 3}
                      className="bg-primary-background rounded-lg px-6 sm:px-8 md:px-10 py-4 sm:py-5 text-center shadow-md hover:shadow-lg transition-shadow duration-300"
                      style={{ 
                        backgroundColor: "#37a331",
                        minWidth: "200px",
                        width: "100%",
                        maxWidth: "260px"
                      }}
                    >
                      <span 
                        className="block"
                        style={{
                          fontSize: "clamp(15px, 1.5vw, 17px)",
                          fontFamily: "Arimo, sans-serif",
                          fontWeight: "500",
                          lineHeight: "1.4",
                          textAlign: "center",
                          color: "#ffffff"
                        }}
                      >
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Contact Us Section */}
        <section className="w-full py-12 sm:py-16 md:py-20 bg-white">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[90px]">
            <div className="flex flex-col items-center">
              
              {/* Section Title */}
              <div className="flex flex-col items-center gap-3 mb-10 sm:mb-12 md:mb-16">
                <h2 
                  className="text-black text-center"
                  style={{
                    fontSize: "clamp(24px, 3vw, 28px)",
                    fontFamily: "Source Serif Pro, serif",
                    fontWeight: "600",
                    lineHeight: "1.3"
                  }}
                >
                  Contact Us
                </h2>
                <div className="w-[200px] h-[4px] sm:w-[250px] md:w-[282px] bg-green-500 rounded-full"></div>
              </div>

              {/* Contact Information */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-8 sm:gap-16 md:gap-24 lg:gap-32 w-full max-w-3xl">
                
                {/* Phone */}
                <button
                  onClick={() => handleContactClick('phone', '+1234567890')}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none p-0"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                      />
                    </svg>
                  </div>
                  <span 
                    style={{
                      fontSize: "clamp(16px, 2vw, 18px)",
                      fontFamily: "Lato, sans-serif",
                      fontWeight: "500",
                      color: "#273248"
                    }}
                  >
                    +123 456 7890
                  </span>
                </button>

                {/* Email - Opens Gmail in Browser */}
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=imene.tifour@ensia.edu.dz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                      />
                    </svg>
                  </div>
                  <span 
                    style={{
                      fontSize: "clamp(16px, 2vw, 18px)",
                      fontFamily: "Lato, sans-serif",
                      fontWeight: "500",
                      color: "#273248"
                    }}
                  >
                    Government@gmail.com
                  </span>
                </a>

              </div>
            </div>
          </div>
        </section>
        
      </div>

      {/* Modern Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-8 h-8 text-green-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 
                className="mb-2"
                style={{
                  fontSize: "24px",
                  fontFamily: "Source Serif Pro, serif",
                  fontWeight: "600",
                  color: "#273248"
                }}
              >
                Make a Call
              </h3>

              {/* Description */}
              <p 
                className="mb-6"
                style={{
                  fontSize: "16px",
                  fontFamily: "Lato, sans-serif",
                  fontWeight: "400",
                  color: "#61646b",
                  lineHeight: "1.5"
                }}
              >
                Do you want to call {modalContent.value}?
              </p>

              {/* Buttons */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors"
                  style={{
                    fontSize: "16px",
                    fontFamily: "Lato, sans-serif",
                    fontWeight: "500",
                    color: "#273248"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceed}
                  className="flex-1 px-6 py-3 rounded-lg transition-all hover:shadow-lg"
                  style={{
                    fontSize: "16px",
                    fontFamily: "Lato, sans-serif",
                    fontWeight: "500",
                    backgroundColor: "#37a331",
                    color: "#ffffff"
                  }}
                >
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default AboutUsPage;