import React, { useState } from 'react';
import { Button } from './Button';
import { Menu, X, QrCode, ShieldCheck, ArrowRight } from 'lucide-react';

export interface NavbarProps {
  onLogin?: () => void;
  onOrderClick?: () => void;
  onHomeClick?: () => void;
  onTrackClick?: () => void;
  onSupportClick?: () => void;
  isLanding?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLogin = () => alert('Login modal / flow (Stub - ready for auth)'),
  onOrderClick,
  onHomeClick,
  onTrackClick,
  onSupportClick,
  isLanding = true,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateToLandingSection = (selector: string) => {
    if (!isLanding && onHomeClick) {
      onHomeClick();
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const targetEl = document.querySelector(selector);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
          clearInterval(interval);
        } else if (attempts >= 30) {
          clearInterval(interval);
        }
      }, 40);
    } else {
      const el = document.querySelector(selector);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrder = () => {
    if (onOrderClick) {
      onOrderClick();
    } else {
      navigateToLandingSection('#pricing');
    }
    setMobileMenuOpen(false);
  };

  const handleLinkClick = (href: string, action?: () => void) => {
    setMobileMenuOpen(false);
    if (action) {
      action();
      return;
    }
    if (href.startsWith('#')) {
      navigateToLandingSection(href);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#EAD9EC]/50 shadow-xs transition-all font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Left */}
          <button
            type="button"
            onClick={() => {
              if (onHomeClick) onHomeClick();
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02] text-left focus:outline-none"
            aria-label="TAGTIQUE Home"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] flex items-center justify-center text-[#1E293B] shadow-[0_4px_12px_rgba(234,217,236,0.6)] group-hover:shadow-[0_6px_16px_rgba(234,217,236,0.85)] border border-white/80 transition-all">
              <QrCode className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-[#1A1A1A]">
                  TAGTIQUE
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAD9EC]/80 text-[#5C3264] uppercase tracking-wider">
                  Smart QR
                </span>
              </div>
              <span className="text-[11px] text-[#8A8A8A] font-medium leading-tight hidden sm:inline">
                Vehicle Contact Shield
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8">
            <button
              onClick={() => handleLinkClick('#how-it-works')}
              className="text-sm font-medium text-[#71717A] hover:text-[#1A1A1A] transition-colors relative py-1"
            >
              How It Works
            </button>
            <button
              onClick={() => handleLinkClick('#pricing')}
              className="text-sm font-medium text-[#71717A] hover:text-[#1A1A1A] transition-colors relative py-1"
            >
              Pricing
            </button>
            <button
              onClick={() => handleLinkClick('#faq')}
              className="text-sm font-medium text-[#71717A] hover:text-[#1A1A1A] transition-colors relative py-1"
            >
              FAQs
            </button>
            <button
              onClick={() => {
                if (onTrackClick) onTrackClick();
                else handleLinkClick('#tracking');
              }}
              className="text-sm font-medium text-[#71717A] hover:text-[#1A1A1A] transition-colors relative py-1"
            >
              Track Order
            </button>
            <button
              onClick={() => {
                if (onSupportClick) onSupportClick();
                else handleLinkClick('#faq');
              }}
              className="text-sm font-medium text-[#71717A] hover:text-[#1A1A1A] transition-colors relative py-1"
            >
              Support
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={onLogin}
              className="px-5 py-2 rounded-full border border-[#D6E0F5] hover:border-[#B89BBF] hover:bg-[#EBF1FC]/50 text-[#2C4875] text-sm font-semibold transition-all active:scale-95 shadow-xs"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleOrder}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] hover:from-[#C8D6F2] hover:to-[#ECC7D2] text-[#1E293B] text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95 inline-flex items-center gap-1.5 border border-white/60"
            >
              <span>Order your tag</span>
              <ArrowRight className="w-4 h-4 text-[#1E293B]" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-xl text-[#1A1A1A] hover:bg-[#EAD9EC]/40 hover:text-[#5C3264] transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/[0.05] bg-white px-5 pt-4 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleLinkClick('#how-it-works')}
              className="px-3 py-2.5 rounded-xl text-base font-medium text-[#1A1A1A] hover:bg-[#EAD9EC]/40 hover:text-[#5C3264] transition-colors text-left"
            >
              How It Works
            </button>
            <button
              onClick={() => handleLinkClick('#pricing')}
              className="px-3 py-2.5 rounded-xl text-base font-medium text-[#1A1A1A] hover:bg-[#EAD9EC]/40 hover:text-[#5C3264] transition-colors text-left"
            >
              Pricing
            </button>
            <button
              onClick={() => handleLinkClick('#faq')}
              className="px-3 py-2.5 rounded-xl text-base font-medium text-[#1A1A1A] hover:bg-[#EAD9EC]/40 hover:text-[#5C3264] transition-colors text-left"
            >
              FAQs
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onTrackClick) onTrackClick();
                else handleLinkClick('#tracking');
              }}
              className="px-3 py-2.5 rounded-xl text-base font-medium text-[#1A1A1A] hover:bg-[#EAD9EC]/40 hover:text-[#5C3264] transition-colors text-left"
            >
              Track Order
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onSupportClick) onSupportClick();
                else handleLinkClick('#faq');
              }}
              className="px-3 py-2.5 rounded-xl text-base font-medium text-[#1A1A1A] hover:bg-[#EAD9EC]/40 hover:text-[#5C3264] transition-colors text-left"
            >
              Support
            </button>

            <div className="pt-4 border-t border-black/[0.06] flex flex-col gap-2.5">
              <Button
                variant="outline"
                fullWidth
                size="md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogin();
                }}
              >
                Login
              </Button>
              <Button
                variant="primary"
                fullWidth
                size="md"
                onClick={handleOrder}
                icon={<ArrowRight className="w-4 h-4" />}
              >

                Order your tag
              </Button>
            </div>

            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-[#8A8A8A]">
              <ShieldCheck className="w-4 h-4 text-[#5C3264]" />
              <span>100% Privacy Protection Guaranteed</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
