import React, { useState } from 'react';
import { Button } from './Button';
import { Menu, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export interface NavbarProps {
  onLogin?: () => void;
  onOrderClick?: () => void;
  onHomeClick?: () => void;
  onTrackClick?: () => void;
  onSupportClick?: () => void;
  isLanding?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLogin: _onLogin,
  onOrderClick,
  onHomeClick,
  onTrackClick: _onTrackClick,
  onSupportClick,
  isLanding = true,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateToLandingSection = (selector: string) => {
    const scrollToTarget = (targetEl: Element) => {
      const headerOffset = 80;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
    };

    if (!isLanding && onHomeClick) {
      onHomeClick();
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const targetEl = document.querySelector(selector);
        if (targetEl) {
          scrollToTarget(targetEl);
          clearInterval(interval);
        } else if (attempts >= 40) {
          clearInterval(interval);
        }
      }, 50);
    } else {
      const el = document.querySelector(selector);
      if (el) {
        scrollToTarget(el);
      }
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
            className="group text-left focus:outline-none cursor-pointer"
            aria-label="TAGTIQUE Home"
          >
            <BrandLogo size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8">
            <button
              onClick={() => {
                if (onHomeClick) onHomeClick();
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-sm font-medium text-[#71717A] hover:text-[#1A1A1A] transition-colors relative py-1 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => handleLinkClick('#pricing')}
              className="text-sm font-medium text-[#71717A] hover:text-[#1A1A1A] transition-colors relative py-1 cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => handleLinkClick('#faq')}
              className="text-sm font-medium text-[#71717A] hover:text-[#1A1A1A] transition-colors relative py-1 cursor-pointer"
            >
              FAQs
            </button>
            <button
              onClick={() => {
                if (onSupportClick) onSupportClick();
                else handleLinkClick('#faq');
              }}
              className="text-sm font-medium text-[#71717A] hover:text-[#1A1A1A] transition-colors relative py-1 cursor-pointer"
            >
              Support
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center">
            <button
              type="button"
              onClick={handleOrder}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] hover:from-[#C8D6F2] hover:to-[#ECC7D2] text-[#1E293B] text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95 inline-flex items-center gap-1.5 border border-white/60 cursor-pointer"
            >
              <span>Order E-Tag</span>
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
              onClick={() => {
                setMobileMenuOpen(false);
                if (onHomeClick) onHomeClick();
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-2.5 rounded-xl text-base font-medium text-[#1A1A1A] hover:bg-[#EAD9EC]/40 hover:text-[#5C3264] transition-colors text-left"
            >
              Home
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
                if (onSupportClick) onSupportClick();
                else handleLinkClick('#faq');
              }}
              className="px-3 py-2.5 rounded-xl text-base font-medium text-[#1A1A1A] hover:bg-[#EAD9EC]/40 hover:text-[#5C3264] transition-colors text-left"
            >
              Support
            </button>

            <div className="pt-4 border-t border-black/[0.06] flex flex-col gap-2.5">
              <Button
                variant="primary"
                fullWidth
                size="md"
                onClick={handleOrder}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Order E-Tag
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
