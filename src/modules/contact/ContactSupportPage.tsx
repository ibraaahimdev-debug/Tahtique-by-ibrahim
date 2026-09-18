import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { ContactForm, type ContactFormData } from './components/ContactForm';
import { ContactMethods } from './components/ContactMethods';
import { FAQSection } from '../../components/landing/FAQSection';
import { ArrowLeft, Home, Headphones } from 'lucide-react';

interface ContactSupportPageProps {
  onNavigateHome: () => void;
  onNavigateTracking: (code: string) => void;
  onLoginClick?: () => void;
}

export const ContactSupportPage: React.FC<ContactSupportPageProps> = ({
  onNavigateHome,
  onNavigateTracking,
  onLoginClick,
}) => {
  // Stub function: onSubmitContact(formData)
  const handleSubmitContact = (data: ContactFormData) => {
    // Console log / stub notification
    console.log('Contact inquiry submitted:', data);
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col selection:bg-[#EAD9EC] selection:text-[#5C3264] relative">
      {/* Top Navbar */}
      <Navbar
        isLanding={false}
        onLogin={onLoginClick}
        onHomeClick={onNavigateHome}
        onTrackClick={() => onNavigateTracking('TGT-000482')}
        onSupportClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#8A8A8A] hover:text-[#5C3264] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#8A8A8A]">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#5C3264] flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-[#1A1A1A] font-medium">Contact & Support</span>
          </div>
        </div>

        {/* Header Title */}
        <div className="max-w-2xl mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAD9EC]/60 text-[#5C3264] text-xs font-semibold uppercase tracking-wider border border-[#EAD9EC]">
            <Headphones className="w-3.5 h-3.5" />
            <span>We're Here to Help</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1A1A1A] tracking-tight">
            Contact Tagtique Support
          </h1>
          <p className="text-sm sm:text-base text-[#8A8A8A]">
            Have a question about your vehicle QR tag, need to change your relay phone number, or want to place a custom fleet order? Reach out anytime.
          </p>
        </div>

        {/* 2-Column Grid: Form (Left) + Direct Methods (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          <div className="lg:col-span-7">
            <ContactForm onSubmitContact={handleSubmitContact} />
          </div>

          <div className="lg:col-span-5">
            <ContactMethods />
          </div>
        </div>

        {/* FAQ Shortcuts Section */}
        <div className="border-t border-black/[0.06] pt-12">
          <div className="text-center mb-6">
            <span className="text-xs font-semibold text-[#5C3264] uppercase tracking-wider bg-gradient-to-r from-[#D6E0F5]/80 via-[#EAD9EC]/80 to-[#F3D6DE]/80 px-3 py-1 rounded-full border border-white/60 shadow-xs">
              Quick Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mt-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#8A8A8A] mt-1">
              Find instant solutions without waiting for an email reply.
            </p>
          </div>

          <FAQSection onContactClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        </div>
      </main>

      {/* Footer */}
      <Footer
        onTrackOrder={() => onNavigateTracking('TGT-000482')}
        onAdminClick={onLoginClick}
        onHomeClick={onNavigateHome}
        onContactClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </div>
  );
};
