import React, { useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { HeroSection } from '../../components/landing/HeroSection';
import { HowItWorks } from '../../components/landing/HowItWorks';
import { PricingSection } from '../../components/landing/PricingSection';
import { FAQSection } from '../../components/landing/FAQSection';
import { CheckCircle2, X } from 'lucide-react';

interface LandingPageProps {
  onNavigateToOrder?: (packageId: string) => void;
  onLoginClick?: () => void;
  onNavigateToTracking?: (orderId: string) => void;
  onNavigateToContact?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToOrder,
  onLoginClick,
  onNavigateToTracking: _onNavigateToTracking,
  onNavigateToContact: _onNavigateToContact,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Order Click: navigate directly to order flow
  const handleOrderClick = (packageId?: string) => {
    const targetId = packageId || 'pack-of-two';
    if (onNavigateToOrder) {
      onNavigateToOrder(targetId);
    } else {
      const el = document.getElementById('pricing');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Submit Order from Pricing section
  const handleSubmitOrder = (packageId: string) => {
    if (onNavigateToOrder) {
      onNavigateToOrder(packageId);
    } else {
      handleOrderClick(packageId);
    }
  };

  // Login handler
  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    }
  };

  // Direct WhatsApp contact
  const handleOpenWhatsApp = () => {
    window.open('https://wa.me/923292082080', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFBFD] text-[#1A1A1A] flex flex-col selection:bg-[#EAD9EC] selection:text-[#5C3264] relative">
      {/* Engineered Ambient Background Lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#FDFBFD]">
        {/* Soft upper radiance */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-b from-[#EAD9EC]/30 via-[#D6E0F5]/20 to-transparent rounded-full blur-[110px]" />
        {/* Subtle mid-section highlight */}
        <div className="absolute top-[40%] -right-32 w-[520px] h-[520px] bg-[#EAD9EC]/20 rounded-full blur-[110px]" />
        {/* Subtle lower highlight */}
        <div className="absolute bottom-0 -left-32 w-[500px] h-[500px] bg-[#D6E0F5]/20 rounded-full blur-[100px]" />
      </div>

      {/* Top Navbar */}
      <Navbar
        isLanding={true}
        onLogin={handleLogin}
        onOrderClick={() => handleOrderClick('pack-of-two')}
        onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onTrackClick={handleOpenWhatsApp}
        onSupportClick={handleOpenWhatsApp}
      />

      <main className="flex-1 relative z-0">
        {/* Hero Section */}
        <HeroSection
          onOrderClick={(packageId) => handleOrderClick(packageId || 'pack-of-two')}
          onLearnMoreClick={() => {
            const el = document.getElementById('pricing');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onLoginClick={handleLogin}
        />

        {/* How It Works */}
        <HowItWorks
          onOrderClick={(packageId) => handleOrderClick(packageId || 'pack-of-two')}
          onNavigateToTracking={handleOpenWhatsApp}
        />

        {/* Pricing Packages */}
        <PricingSection onSubmitOrder={handleSubmitOrder} />

        {/* FAQ Section */}
        <FAQSection onContactClick={handleOpenWhatsApp} />
      </main>

      {/* Footer */}
      <Footer
        onTrackOrder={handleOpenWhatsApp}
        onAdminClick={handleLogin}
        onContactClick={handleOpenWhatsApp}
        onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300 text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4 text-[#EAD9EC]" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/60 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
