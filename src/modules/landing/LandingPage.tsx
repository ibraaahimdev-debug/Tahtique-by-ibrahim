import React, { useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { HeroSection } from '../../components/landing/HeroSection';
import { HowItWorks } from '../../components/landing/HowItWorks';
import { PricingSection } from '../../components/landing/PricingSection';
import { FAQSection } from '../../components/landing/FAQSection';
import { PRICING_PACKAGES } from '../../data/mockData';
import { CheckCircle2, X, ShoppingBag, Shield } from 'lucide-react';
import { Button } from '../../components/common/Button';

interface LandingPageProps {
  onNavigateToOrder?: (packageId: string) => void;
  onLoginClick?: () => void;
  onNavigateToTracking?: (orderId: string) => void;
  onNavigateToContact?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToOrder,
  onLoginClick,
  onNavigateToTracking,
  onNavigateToContact,
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingResult, setTrackingResult] = useState<string | null>(null);

  // Order Click: if onNavigateToOrder is given, direct to Module 2 wizard; otherwise scroll to pricing
  const handleOrderClick = (packageId?: string) => {
    const targetId = packageId || 'pack-of-two';
    if (onNavigateToOrder) {
      onNavigateToOrder(targetId);
    } else {
      setSelectedPackageId(targetId);
      const el = document.getElementById('pricing');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Submit Order from Pricing section
  const handleSubmitOrder = (packageId: string) => {
    if (onNavigateToOrder) {
      onNavigateToOrder(packageId);
    } else {
      setSelectedPackageId(packageId);
      setIsOrderModalOpen(true);
    }
  };

  // Login handler
  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Track Order
  const handleTrackOrder = () => {
    if (onNavigateToTracking) {
      onNavigateToTracking('TGT-000482');
      return;
    }
    setIsTrackModalOpen(true);
    setTrackingResult(null);
    setTrackingCode('');
  };

  const handleSimulateTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;
    setTrackingResult(
      `Order #${trackingCode.toUpperCase()}: In transit via Express Courier. Expected delivery in 2 days to your address.`
    );
  };

  const currentPackage = PRICING_PACKAGES.find((p) => p.id === selectedPackageId);

  return (
    <div className="min-h-screen bg-transparent text-[#1A1A1A] flex flex-col selection:bg-[#EAD9EC] selection:text-[#5C3264] relative">
      {/* Dynamic Background Auras in Brand Pastels (#D6E0F5, #EBF1FC, #EAD9EC, #F3D6DE, #FFD4E9, #F7EBEF) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Soft Lavender-Blue Top Left (#D6E0F5) */}
        <div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full bg-[#D6E0F5]/75 blur-[120px]" />

        {/* Blended Lilac-Pink Upper Right (#EAD9EC) */}
        <div className="absolute top-[18%] -right-28 w-[680px] h-[680px] rounded-full bg-[#EAD9EC]/80 blur-[130px]" />

        {/* Warm Dusty Pink Mid-Section (#F3D6DE) */}
        <div className="absolute top-[42%] -left-32 w-[720px] h-[720px] rounded-full bg-[#F3D6DE]/75 blur-[130px]" />

        {/* Light Lavender-Blue (#EBF1FC) & Pink Accent (#FFD4E9) Lower Auras */}
        <div className="absolute top-[68%] -right-24 w-[750px] h-[750px] rounded-full bg-gradient-to-br from-[#FFD4E9]/70 via-[#EAD9EC]/60 to-[#EBF1FC]/80 blur-[130px]" />

        {/* Bottom Soft Lavender-Blue Anchor (#D6E0F5) */}
        <div className="absolute bottom-0 left-1/4 w-[650px] h-[650px] rounded-full bg-[#D6E0F5]/65 blur-[120px]" />
      </div>

      {/* Top Navbar */}
      <Navbar
        isLanding={true}
        onLogin={handleLogin}
        onOrderClick={() => handleOrderClick('pack-of-two')}
        onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onTrackClick={handleTrackOrder}
        onSupportClick={onNavigateToContact}
      />

      <main className="flex-1 relative z-0">
        {/* 2. Hero Section with 3D Animations & Exact Typography */}
        <HeroSection
          onOrderClick={(packageId) => handleOrderClick(packageId || 'pack-of-two')}
          onLearnMoreClick={() => {
            const el = document.getElementById('pricing');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onLoginClick={handleLogin}
        />

        {/* 3. How It Works (Interactive 4-Step Process) */}
        <HowItWorks
          onOrderClick={(packageId) => handleOrderClick(packageId || 'pack-of-two')}
          onNavigateToTracking={(orderId) => onNavigateToTracking && onNavigateToTracking(orderId || 'TGT-000482')}
        />

        {/* 4. Pricing / package cards */}
        <PricingSection onSubmitOrder={handleSubmitOrder} />

        {/* 5. FAQ section */}
        <FAQSection onContactClick={onNavigateToContact} />
      </main>

      {/* 7. Footer */}
      <Footer
        onTrackOrder={handleTrackOrder}
        onAdminClick={handleLogin}
        onContactClick={onNavigateToContact}
        onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* STUB MODAL: Order Selection / Flow Placeholder */}
      {isOrderModalOpen && currentPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-[#EAD9EC] animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#8A8A8A] hover:bg-[#EAD9EC]/50 hover:text-[#1A1A1A] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D6E0F5] to-[#EAD9EC] text-[#5C3264] flex items-center justify-center border border-white/80 shadow-xs">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#5C3264] uppercase tracking-wider">
                  Order Stub Ready
                </span>
                <h3 className="text-xl font-semibold text-[#1A1A1A]">
                  {currentPackage.name} Selected
                </h3>
              </div>
            </div>

            <p className="text-sm text-[#8A8A8A] mb-4">
              {currentPackage.tagline}. Total: <span className="font-semibold text-[#1A1A1A]">PKR {currentPackage.price.toLocaleString()}</span> (One-time payment).
            </p>

            <div className="p-3.5 rounded-2xl bg-[#EAD9EC]/40 border border-[#EAD9EC]/70 text-xs text-[#5C3264] mb-6 flex items-start gap-2">
              <Shield className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Backend integration stub: <code>onSubmitOrder('{currentPackage.id}')</code> triggered successfully. Next module will attach checkout & vehicle registration fields!
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={() => {
                  setIsOrderModalOpen(false);
                  if (onNavigateToOrder) {
                    onNavigateToOrder(currentPackage.id);
                  } else {
                    setToastMessage(`Package "${currentPackage.name}" recorded in session state.`);
                    setTimeout(() => setToastMessage(null), 4000);
                  }
                }}
              >
                Continue with {currentPackage.name} (PKR {currentPackage.price.toLocaleString()})
              </Button>
              <Button
                variant="ghost"
                fullWidth
                size="sm"
                onClick={() => setIsOrderModalOpen(false)}
              >
                Close preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STUB MODAL: Login Placeholder */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl relative border border-black/[0.05] animate-in zoom-in-95 duration-200 text-center">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#8A8A8A] hover:bg-[#EAD9EC]/50 hover:text-[#1A1A1A] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#D6E0F5] to-[#EAD9EC] text-[#5C3264] flex items-center justify-center mb-4 border border-white/80 shadow-xs">
              <Shield className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
              Customer & Admin Login
            </h3>
            <p className="text-xs text-[#8A8A8A] mb-6 leading-relaxed">
              Stub handler: <code>onLogin()</code> is wired up. Customer and Admin login portals will be configured in subsequent modules with mock session authentication.
            </p>

            <Button
              variant="primary"
              fullWidth
              size="md"
              onClick={() => setIsLoginModalOpen(false)}
            >
              Understood
            </Button>
          </div>
        </div>
      )}

      {/* STUB MODAL: Track Order */}
      {isTrackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-black/[0.05] animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsTrackModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#8A8A8A] hover:bg-[#EAD9EC]/50 hover:text-[#1A1A1A] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
              Track Your Tag Delivery
            </h3>
            <p className="text-xs text-[#8A8A8A] mb-4">
              Enter your order reference ID (e.g. <code>TAG-8921</code>) to view live tracking.
            </p>

            <form onSubmit={handleSimulateTrack} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">
                  Order Number or Email
                </label>
                <input
                  type="text"
                  placeholder="e.g. TAG-8921 or driver@example.com"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-black/10 text-sm focus:outline-none focus:border-[#B89BBF] focus:ring-2 focus:ring-[#EAD9EC]/60"
                  required
                />
              </div>

              {trackingResult && (
                <div className="p-3.5 rounded-2xl bg-[#EAD9EC]/40 border border-[#EAD9EC] text-xs text-[#5C3264] font-medium leading-relaxed">
                  {trackingResult}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="md"
              >
                Check Status
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300 text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4 text-[#EAD9EC]" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
