// @ts-nocheck
"use client";
import React, { useState, useEffect, useRef } from "react";
import { DashboardHeader } from "@/src/components/layout/dashboard-header";
import { useRouter } from "next/navigation";

const PrivacyPolicy = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("introduction");
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
      threshold: 0.6
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
    { id: "introduction", title: "Introduction" },
    { id: "data-collection", title: "Data We Collect" },
    { id: "data-usage", title: "How We Use Data" },
    { id: "data-sharing", title: "Data Sharing" },
    { id: "data-security", title: "Data Security" },
    { id: "user-rights", title: "Your Rights" },
    { id: "cookies", title: "Cookies" },
    { id: "changes", title: "Policy Changes" },
    { id: "contact", title: "Contact Us" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <DashboardHeader
        title="Privacy Policy"
        description="Learn how we protect and handle your data at ChatSupplies"
        buttonText="Back to Dashboard"
        onButtonClick={handleBackToDashboard}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
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
                <h1 className="text-3xl font-bold">ChatSupplies Privacy Policy</h1>
                <p className="mt-2 opacity-90">Last Updated: {new Date().toLocaleDateString()}</p>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="prose max-w-none">
                  <section 
                    id="introduction" 
                    ref={setSectionRef("introduction")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                   
                      1. Introduction
                    </h2>
                    <p className="mt-4 text-gray-600">
                      At ChatSupplies, we prioritize your privacy and are committed to protecting your personal data. 
                      This Privacy Policy explains how we collect, use, and safeguard your information when you use our 
                      AI-powered chat platform and related services.
                    </p>
                    <p className="mt-4 text-gray-600">
                      By using ChatSupplies, you consent to the data practices described in this policy. If you do not 
                      agree with the terms outlined here, please do not use our services.
                    </p>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="data-collection" 
                    ref={setSectionRef("data-collection")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                   
                      2. Data We Collect
                    </h2>
                    <p className="mt-4 text-gray-600">
                      We collect several types of information to provide and improve our services:
                    </p>
                    
                    <h3 className="text-lg font-medium text-gray-800 mt-6">Personal Information</h3>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        <span className="font-medium">Account Information:</span> Name, email address, company details when you register
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        <span className="font-medium">Contact Information:</span> Email, phone number for customer support
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        <span className="font-medium">Billing Information:</span> Payment details for premium services
                      </li>
                    </ul>
                    
                    <h3 className="text-lg font-medium text-gray-800 mt-6">Usage Data</h3>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        Chat logs and conversation history
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        Device information and browser type
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        IP address and general location data
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        Pages visited and features used
                      </li>
                    </ul>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="data-usage" 
                    ref={setSectionRef("data-usage")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                     
                      3. How We Use Data
                    </h2>
                    <p className="mt-4 text-gray-600">
                      We use your information for the following purposes:
                    </p>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        To provide, maintain, and improve our services
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        To personalize your experience and customize chatbot responses
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        To process transactions and send related information
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        To send technical notices, updates, and support messages
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        To respond to your comments, questions, and requests
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        To monitor and analyze trends, usage, and activities
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        To detect, prevent, and address technical issues or fraud
                      </li>
                    </ul>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="data-sharing" 
                    ref={setSectionRef("data-sharing")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                     
                      4. Data Sharing
                    </h2>
                    <p className="mt-4 text-gray-600">
                      We may share your information in the following circumstances:
                    </p>
                    
                    <h3 className="text-lg font-medium text-gray-800 mt-6">Service Providers</h3>
                    <p className="mt-2 text-gray-600">
                      We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, 
                      perform service-related services, or assist us in analyzing how our service is used.
                    </p>
                    
                    <h3 className="text-lg font-medium text-gray-800 mt-6">Business Transfers</h3>
                    <p className="mt-2 text-gray-600">
                      If ChatSupplies is involved in a merger, acquisition, or asset sale, your personal data may be transferred. 
                      We will provide notice before your personal data is transferred and becomes subject to a different Privacy Policy.
                    </p>
                    
                    <h3 className="text-lg font-medium text-gray-800 mt-6">Legal Requirements</h3>
                    <p className="mt-2 text-gray-600">
                      We may disclose your personal data if required to do so by law or in response to valid requests by public authorities.
                    </p>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="data-security" 
                    ref={setSectionRef("data-security")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                    
                      5. Data Security
                    </h2>
                    <p className="mt-4 text-gray-600">
                      The security of your data is important to us. We implement appropriate technical and organizational measures 
                      to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                    </p>
                    <p className="mt-4 text-gray-600">
                      While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee 
                      its absolute security. No method of transmission over the Internet or electronic storage is 100% secure.
                    </p>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h4 className="font-medium text-blue-800 flex items-center">
                      
                        Security Measures We Implement
                      </h4>
                      <ul className="mt-2 space-y-1 text-blue-700">
                        <li className="flex items-start">
                          <span className="mr-2 mt-1">•</span>
                          Encryption of data in transit using SSL/TLS protocols
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-1">•</span>
                          Regular security assessments and vulnerability testing
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-1">•</span>
                          Access controls and authentication mechanisms
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-1">•</span>
                          Regular data backups and disaster recovery plans
                        </li>
                      </ul>
                    </div>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="user-rights" 
                    ref={setSectionRef("user-rights")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                     
                      6. Your Rights
                    </h2>
                    <p className="mt-4 text-gray-600">
                      Depending on your location, you may have the following rights regarding your personal data:
                    </p>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        <span className="font-medium">Access:</span> The right to access and receive a copy of your personal data
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        <span className="font-medium">Correction:</span> The right to correct inaccurate or incomplete data
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        <span className="font-medium">Deletion:</span> The right to request deletion of your personal data
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        <span className="font-medium">Objection:</span> The right to object to processing of your personal data
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        <span className="font-medium">Portability:</span> The right to receive your data in a structured, machine-readable format
                      </li>
                    </ul>
                    <p className="mt-4 text-gray-600">
                      To exercise any of these rights, please contact us at <span className="text-indigo-600 font-medium">privacy@chatsupplies.com</span>.
                    </p>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="cookies" 
                    ref={setSectionRef("cookies")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                     
                      7. Cookies
                    </h2>
                    <p className="mt-4 text-gray-600">
                      
                    </p>
                    <p className="mt-4 text-gray-600">
                      Cookies are files with a small amount of data that may include an anonymous unique identifier. They are sent to 
                      your browser from a website and stored on your device.
                    </p>
                    
                    <h3 className="text-lg font-medium text-gray-800 mt-6">Types of Cookies We Use</h3>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        <span className="font-medium">Essential Cookies:</span> Necessary for the operation of our service
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        <span className="font-medium">Analytics Cookies:</span> Allow us to analyze how visitors use our website
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        <span className="font-medium">Functionality Cookies:</span> Enable enhanced functionality and personalization
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        <span className="font-medium">Advertising Cookies:</span> Used to deliver relevant advertisements
                      </li>
                    </ul>
                    
                    <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
                      <h4 className="font-medium text-amber-800 flex items-center">
                       
                        Cookie Preferences
                      </h4>
                      <p className="mt-2 text-amber-700">
                        You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, 
                        if you do not accept cookies, you may not be able to use some portions of our service.
                      </p>
                    </div>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="changes" 
                    ref={setSectionRef("changes")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                    
                      8. Policy Changes
                    </h2>
                    <p className="mt-4 text-gray-600">
                      We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                      Privacy Policy on this page and updating the "Last Updated" date.
                    </p>
                    <p className="mt-4 text-gray-600">
                      You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy 
                      are effective when they are posted on this page.
                    </p>
                  </section>
                  
                  <div className="border-b my-8"></div>
                  
                  <section 
                    id="contact" 
                    ref={setSectionRef("contact")}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                     
                      9. Contact Us
                    </h2>
                    <p className="mt-4 text-gray-600">
                      If you have any questions about this Privacy Policy, please contact us:
                    </p>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        By email: <span className="text-indigo-600 font-medium">privacy@chatsupplies.com</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        Through our website: <span className="text-indigo-600 font-medium">chatsupplies.com/contact</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2 mt-1">•</span>
                        By mail: <span className="text-indigo-600 font-medium">ChatSupplies Inc., Butt Street, Rustam Park, Lahore</span>
                      </li>
                    </ul>
                  </section>
                </div>
                
                <div className="mt-12 p-6 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="flex items-start">
                    
                    <p className="text-indigo-800">
                      By using ChatSupplies, you acknowledge that you have read and understood this Privacy Policy and agree to 
                      the collection, use, and disclosure of your information as described herein.
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

export default PrivacyPolicy;