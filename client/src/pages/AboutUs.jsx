import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ChevronLeft, Home, ChevronDown, Users, Eye, Target, HelpCircle, Sparkles } from 'lucide-react';

const AboutUsPage = () => {
  const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="border-b border-white/10">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center text-left py-5 group"
        >
          <span className="font-semibold text-lg text-white group-hover:text-emerald-400 transition-colors">{question}</span>
          <div className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-180 bg-emerald-500/30' : ''}`}>
            <ChevronDown className="w-5 h-5 text-emerald-400" />
          </div>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}>
          <p className="text-white/60 leading-relaxed pl-1">
            {answer}
          </p>
        </div>
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

  return (
    <>
      <Helmet>
        <title>About Us - Community Platform | Document Procedure Services</title>
        <meta name="description" content="Learn about our community-supervised platform that simplifies government document procedures. Meet our dedicated team helping citizens navigate visa, passport, and ID card applications efficiently." />
        <meta property="og:title" content="About Us - Community Platform | Document Procedure Services" />
        <meta property="og:description" content="Learn about our community-supervised platform that simplifies government document procedures. Meet our dedicated team helping citizens navigate visa, passport, and ID card applications efficiently." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 relative overflow-hidden">
        
        {/* Home button */}
        <Link 
          to="/" 
          className="fixed top-24 left-4 md:top-6 md:left-6 z-30 group flex items-center gap-2 px-3 py-2 md:px-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white/80 hover:text-white transition-all duration-300 border border-white/20"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <Home className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">Home</span>
        </Link>

        {/* Animated background shapes */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
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

        {/* Floating particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/40 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 6}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Section */}
        <section
          className="relative w-full h-[300px] sm:h-[400px] md:h-[530px] flex items-center justify-center bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/img_postivecaringrelationshipsteachers_4.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-emerald-900/50 to-slate-900"></div>
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-[56px] max-w-[1440px] mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 border border-white/20">
              <Users className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-white text-center mb-4 sm:mb-6 text-4xl sm:text-5xl md:text-6xl font-bold">
              About Us
            </h1>
            <p className="text-white/80 text-center max-w-2xl mx-auto text-lg sm:text-xl">
              Community-Supervised Platform to show Required Docs Procedures for Different Applications
            </p>
          </div>
        </section>

        {/* Our Service Section */}
        <section className="relative z-10 w-full py-16 sm:py-20 md:py-24">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-10 md:p-12 border border-white/20 shadow-2xl">
              <div className="flex flex-col items-center gap-6">
                {/* Section Header */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-white text-center text-3xl sm:text-4xl font-bold">
                    Our Service
                  </h2>
                  <img
                    src="/images/img_vector.svg"
                    alt="Decorative line"
                    className="w-[200px] h-[28px] sm:w-[250px] sm:h-[32px] md:w-[282px] md:h-[40px] opacity-70"
                  />
                </div>

                {/* Service Description */}
                <div className="w-full max-w-3xl">
                  <p className="text-center text-white/70 text-lg leading-relaxed">
                    Our platform displays the required documents and procedures for applications such as visas, passports, and ID cards in a clear and organized way. We simplify administrative processes by gathering reliable, community-reviewed information in one place. Whether you are preparing an application or checking requirements, the platform makes the process faster and easier.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Vision Section */}
        <section className="relative z-10 w-full py-8 sm:py-12 md:py-16">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-10 md:p-12 border border-white/20 shadow-2xl">
              <div className="flex flex-col items-center gap-6">
                {/* Section Header */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
                    <Eye className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-white text-center text-3xl sm:text-4xl font-bold">
                    Our Vision
                  </h2>
                  <img
                    src="/images/img_vector.svg"
                    alt="Decorative line"
                    className="w-[200px] h-[28px] sm:w-[250px] sm:h-[32px] md:w-[282px] md:h-[40px] opacity-70"
                  />
                </div>

                {/* Vision Description */}
                <div className="w-full max-w-3xl">
                  <p className="text-center text-white/70 text-lg leading-relaxed">
                    To create a trusted and user-friendly platform that brings together clear, accurate, and easily accessible administrative information, helping everyone understand the documents and procedures they need without confusion or difficulty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative z-10 w-full py-16 sm:py-20 md:py-24">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-10 md:p-12 border border-white/20 shadow-2xl">
              <div className="flex flex-col items-center">
                {/* Section Header */}
                <div className="flex flex-col items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
                    <HelpCircle className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-white text-center text-3xl sm:text-4xl font-bold">
                    Frequently Asked Questions
                  </h2>
                  <img
                    src="/images/img_vector.svg"
                    alt="Decorative line"
                    className="w-[200px] h-[28px] sm:w-[250px] sm:h-[32px] md:w-[282px] md:h-[40px] opacity-70"
                  />
                </div>

                {/* FAQ Accordion */}
                <div className="w-full max-w-3xl">
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
          </div>
        </section>

        {/* Our Team Section */}
        <section className="relative z-10 w-full py-16 sm:py-20 md:py-24 pb-24">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-10 md:p-12 border border-white/20 shadow-2xl">
              <div className="flex flex-col items-center">
                {/* Section Header */}
                <div className="flex flex-col items-center gap-4 mb-10 sm:mb-12">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-white text-center text-3xl sm:text-4xl font-bold">
                    Our Team
                  </h2>
                  <img
                    src="/images/img_vector.svg"
                    alt="Decorative line"
                    className="w-[200px] h-[28px] sm:w-[250px] sm:h-[32px] md:w-[282px] md:h-[40px] opacity-70"
                  />
                </div>

                {/* Team Members Grid */}
                <div className="w-full max-w-4xl mx-auto">
                  {/* First Row - 3 members */}
                  <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-6">
                    {teamMembers?.slice(0, 3)?.map((name, index) => (
                      <div
                        key={index}
                        className="group bg-gradient-to-r from-primary to-primary-dark rounded-xl px-6 sm:px-8 py-4 sm:py-5 text-center shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 border border-white/10 min-w-[200px] max-w-[260px] w-full"
                      >
                        <span className="block text-white font-semibold text-base sm:text-lg">
                          {name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Second Row - 2 members (centered) */}
                  <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
                    {teamMembers?.slice(3)?.map((name, index) => (
                      <div
                        key={index + 3}
                        className="group bg-gradient-to-r from-primary to-primary-dark rounded-xl px-6 sm:px-8 py-4 sm:py-5 text-center shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 border border-white/10 min-w-[200px] max-w-[260px] w-full"
                      >
                        <span className="block text-white font-semibold text-base sm:text-lg">
                          {name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default AboutUsPage;