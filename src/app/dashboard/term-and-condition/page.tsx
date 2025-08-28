// @ts-nocheck
"use client";
import React, { useState, useEffect, useRef } from "react";
import { DashboardHeader } from "@/src/components/layout/dashboard-header";
import { useRouter } from "next/navigation";

const TermsAndConditions = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("acceptance");
  const sectionRefs = useRef({});
  
  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  // Scroll to section when clicking on sidebar items
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Set up intersection observer to detect which section is in view
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6 // Trigger when 60% of section is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    Object.values(sectionRefs.current).forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Assign ref to each section
  const setSectionRef = (sectionId) => (el) => {
    sectionRefs.current[sectionId] = el;
  };

  const sections = [
    { id: "acceptance", title: "Acceptance of Terms" },
    { id: "license", title: "Use License" },
    { id: "account", title: "Account Registration" },
    { id: "responsibilities", title: "User Responsibilities" },
    { id: "property", title: "Intellectual Property" },
    { id: "content", title: "User Content" },
    { id: "prohibited", title: "Prohibited Uses" },
    { id: "termination", title: "Termination" },
    { id: "liability", title: "Limitation of Liability" },
    { id: "changes", title: "Changes to Terms" },
    { id: "law", title: "Governing Law" },
    { id: "contact", title: "Contact Information" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <DashboardHeader
        title="Terms and Conditions"
        description="Review our terms to understand the rules for using ChatSupplies"
        buttonText="Back to Dashboard"
        onButtonClick={handleBackToDashboard}
      />
      
      <div className="container mx-auto p-5 ">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                Contents
              </h3>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center ${
                        activeSection === section.id
                          ? "bg-indigo-100 text-indigo-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {activeSection === section.id && (
                        <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                      )}
                      {activeSection !== section.id && (
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      )}
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <h1 className="text-3xl font-bold">ChatSupplies Terms and Conditions</h1>
                <p className="mt-2 opacity-90">Last Updated: {new Date().toLocaleDateString()}</p>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="prose max-w-none">
                  <section 
                    id="acceptance" 
                    ref={setSectionRef("acceptance")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                      1. Acceptance of Terms
                    </h2>
                    <p className="mt-4 text-gray-600">
                      By accessing or using the ChatSupplies platform, you agree to be bound by these Terms and Conditions, 
                      all applicable laws and regulations, and agree that you are responsible for compliance with any applicable 
                      local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
                    </p>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="license" 
                    ref={setSectionRef("license")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                      2. Use License
                    </h2>
                    <p className="mt-4 text-gray-600">
                      Permission is granted to temporarily use ChatSupplies for business purposes. This is the grant of a license, 
                      not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        Modify or copy the materials;
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        Use the materials for any commercial purpose or for any public display;
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        Attempt to reverse engineer any software contained on ChatSupplies' platform;
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        Remove any copyright or other proprietary notations from the materials; or
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        Transfer the materials to another person or "mirror" the materials on any other server.
                      </li>
                    </ul>
                    <p className="mt-4 text-gray-600">
                      This license shall automatically terminate if you violate any of these restrictions and may be terminated 
                      by ChatSupplies at any time.
                    </p>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="account" 
                    ref={setSectionRef("account")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                      3. Account Registration
                    </h2>
                    <p className="mt-4 text-gray-600">
                      To access certain features of ChatSupplies, you must register for an account. You agree to provide accurate, 
                      current, and complete information during the registration process and to update such information to keep it 
                      accurate, current, and complete.
                    </p>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="responsibilities" 
                    ref={setSectionRef("responsibilities")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                 
                      4. User Responsibilities
                    </h2>
                    <p className="mt-4 text-gray-600">
                      You are responsible for maintaining the confidentiality of your account credentials and for all activities 
                      that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                    </p>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="property" 
                    ref={setSectionRef("property")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                  
                      5. Intellectual Property
                    </h2>
                    <p className="mt-4 text-gray-600">
                      The ChatSupplies platform and its original content, features, and functionality are owned by ChatSupplies 
                      and are protected by international copyright, trademark, patent, trade secret, and other intellectual 
                      property or proprietary rights laws.
                    </p>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="content" 
                    ref={setSectionRef("content")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                   
                      6. User Content
                    </h2>
                    <p className="mt-4 text-gray-600">
                      You retain all rights to any content you submit, post or display on or through ChatSupplies. By submitting 
                      content, you grant ChatSupplies a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, 
                      and display such content for the purpose of providing and improving our services.
                    </p>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="prohibited" 
                    ref={setSectionRef("prohibited")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                    
                      7. Prohibited Uses
                    </h2>
                    <p className="mt-4 text-gray-600">You may use our service only for lawful purposes and in accordance with these Terms. You agree not to use our service:</p>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        In any way that violates any applicable federal, state, local, or international law or regulation;
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        To transmit, or procure the sending of, any advertising or promotional material without our prior written consent;
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        To impersonate or attempt to impersonate ChatSupplies, a ChatSupplies employee, another user, or any other person or entity;
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the service.
                      </li>
                    </ul>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="termination" 
                    ref={setSectionRef("termination")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                     
                      8. Termination
                    </h2>
                    <p className="mt-4 text-gray-600">
                      We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, 
                      under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                    </p>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="liability" 
                    ref={setSectionRef("liability")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                     
                      9. Limitation of Liability
                    </h2>
                    <p className="mt-4 text-gray-600">
                      In no event shall ChatSupplies, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for 
                      any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, 
                      use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                    </p>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="changes" 
                    ref={setSectionRef("changes")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                    
                      10. Changes to Terms
                    </h2>
                    <p className="mt-4 text-gray-600">
                      We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use 
                      our service after those revisions become effective, you agree to be bound by the revised terms.
                    </p>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="law" 
                    ref={setSectionRef("law")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                     
                      11. Governing Law
                    </h2>
                    <p className="mt-4 text-gray-600">
                      These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.
                    </p>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="contact" 
                    ref={setSectionRef("contact")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                     
                      12. Contact Information
                    </h2>
                    <p className="mt-4 text-gray-600">
                      If you have any questions about these Terms, please contact us at <span className="text-indigo-600 font-medium">legal@chatsupplies.com</span>.
                    </p>
                  </section>
                </div>
                
                <div className="mt-12 p-6 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 mr-3 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-indigo-800">
                      By using ChatSupplies, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. 
                      If you do not agree to these terms, please discontinue use of our services.
                    </p>
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

export default TermsAndConditions;