import React from 'react';
import { Shield, Mail, MapPin, Heart, MessageSquare } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onTrackOrder?: () => void;
  onAdminClick?: () => void;
  onContactClick?: () => void;
  onHomeClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onAdminClick: _onAdminClick,
  onHomeClick,
}) => {
  return (
    <footer className="relative overflow-hidden bg-transparent border-t border-[#EAD9EC]/60 pt-16 pb-12 transition-colors font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 pb-12 border-b border-black/[0.06]">
          {/* Brand Column */}
          <div className="space-y-4 max-w-md">
            <button
              type="button"
              onClick={() => {
                if (onHomeClick) onHomeClick();
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="focus:outline-none text-left group cursor-pointer"
            >
              <BrandLogo size="md" />
            </button>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Your car's smart contact card — connect with anyone who needs to reach you without ever exposing your private mobile number. 100% one-time charges in PKR.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5C3264] bg-gradient-to-r from-[#D6E0F5]/70 to-[#EAD9EC]/70 border border-white/60 shadow-xs px-3 py-1.5 rounded-full w-fit">
              <Shield className="w-3.5 h-3.5 text-[#5C3264]" />
              <span>Encrypted Privacy Relay Active</span>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Get in Touch
            </h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href="https://wa.me/923292082080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors flex items-center gap-1"
                >
                  WhatsApp: 0329-2082080
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#5C3264] shrink-0" />
                <a href="mailto:ataitsolutions09@gmail.com" className="hover:text-[#5C3264] transition-colors">
                  ataitsolutions09@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#5C3264] shrink-0 mt-0.5" />
                <span>208 Chak Road, Blue Bell Road, Canal Road, FSD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} TAGTIQUE Inc. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-[#F3D6DE] fill-[#EAD9EC]" /> for driver safety in Pakistan
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
};
