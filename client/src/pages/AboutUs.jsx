import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

const AboutUsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ type: '', value: '' });

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <span className="font-semibold text-lg">{question}</span>
        <span className="text-2xl">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <p className="mt-3 text-gray-600 leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
};


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
        {/* FAQ Section */}
        <section className="w-full py-12 sm:py-16 md:py-20 bg-white">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[90px]">
            <div className="flex flex-col items-center">

              {/* Section Title */}
              <div className="flex flex-col items-center gap-3 mb-10 sm:mb-12">
                <h2
                  className="text-black text-center"
                  style={{
                    fontSize: "clamp(24px, 3vw, 28px)",
                    fontFamily: "Source Serif Pro",
                    fontWeight: "600",
                    lineHeight: "1.3"
                  }}
                >
                  Frequently Asked Questions
                </h2>
                <img
                  src="/images/img_vector.svg"
                  alt="Decorative line"
                  className="w-[200px] h-[28px] sm:w-[250px] sm:h-[32px] md:w-[282px] md:h-[40px]"
                />
              </div>

              {/* FAQ Accordion */}
              <div className="w-full max-w-4xl">
                {[
                  {
                    question: "Who can use this platform?",
                    answer: "Anyone can browse and view documents on our platform. However, to propose new documents, or report inaccuracies, you'll need to create a free account and verify your email address. This ensures the quality and authenticity of contributions to our community."
                  },
                  {
                    question: "How does the document verification process work?",
                    answer: "When a registered user proposes or uploads a new document, it goes through a review process by our Admin team. They verify the accuracy and appropriateness of the content before it's published on the platform. This community-supervised approach ensures that all information is reliable and up-to-date."
                  },
                  {
                    question: "Can I contribute to the platform?",
                    answer: "Yes! Registered users can propose new documents, and report any inaccurate or inappropriate content. Your contributions help keep the platform current and valuable for everyone in the community."
                  },
                  {
                      question: "What should I do if I find an error or inaccurate information in a document?",
                      answer: "If you discover any errors, outdated information, or inaccuracies in a document, you can report it using the 'Report' feature available on each document page. Simply click the report button, describe the issue you found, and submit your report. Our Admin team will review your report and take appropriate action to correct or update the information to ensure accuracy for all users."
                  },
                  {
                    question: "What types of documents and procedures can I find here?",
                    answer: "Our platform covers a wide range of government document procedures including visa applications, passport renewals, national ID cards, and other administrative documents. Each entry includes the required documents, step-by-step procedures, and relevant information organized by categories and tags for easy navigation."
                  },
                  {
                    question: "Is my personal information safe on this platform?",
                    answer: "Yes, we take data privacy seriously. All communications are encrypted , passwords are securely hashed, and your personal information is stored securely with access restricted to authorized personnel only."
                  }
                ].map((faq, index) => (
                  <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
              </div>
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



      </div>

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