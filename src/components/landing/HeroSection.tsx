import React, { useState } from 'react';
import { Check, ArrowRight, Truck } from 'lucide-react';
import GlassQRTag from '../GlassQRTag';

interface HeroSectionProps {
  onOrderClick: (packageId?: string) => void;
  onLearnMoreClick?: () => void;
  onLoginClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOrderClick,
}) => {
  const [emailInput, setEmailInput] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOrderClick('pack-of-two');
  };

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-transparent py-6 sm:py-10 md:py-14 px-3 sm:px-6 lg:px-8 font-sans scroll-mt-24">
      {/* Main Showcase Canvas / Card */}
      <div className="relative max-w-[1240px] mx-auto bg-gradient-to-br from-[#FFFFFF] via-[#FCF9FB] to-[#FFF1F4]/50 rounded-[32px] sm:rounded-[44px] shadow-[0_25px_80px_rgba(235,160,180,0.35)] border border-white/90 overflow-hidden transition-all duration-300">
        
        {/* Hero Body Content */}
        <div className="relative px-6 sm:px-10 lg:px-12 pt-10 sm:pt-14 pb-14 sm:pb-20">
          
          {/* Subtle Background Blobs inside Canvas */}
          <div className="absolute top-10 left-1/4 w-[480px] h-[480px] bg-gradient-to-br from-[#D6E0F5]/75 via-[#EBF1FC]/85 to-[#EAD9EC]/60 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-[540px] h-[540px] bg-gradient-to-tl from-[#D6E0F5]/80 via-[#EBF1FC]/85 to-[#EAD9EC]/70 rounded-full blur-[110px] pointer-events-none" />

          {/* Double slashes decoration in bottom right corner */}
          <div className="absolute bottom-6 right-8 pointer-events-none select-none z-10 text-white/90 font-black text-5xl sm:text-6xl tracking-[-0.2em] italic drop-shadow-[0_2px_10px_rgba(214,224,245,0.8)]">
            //
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Headline, Subtitle, Input Box */}
            <div className="lg:col-span-5 space-y-6 text-left z-10">
              
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#D6E0F5]/80 via-[#EAD9EC]/80 to-[#F3D6DE]/80 border border-white/80 shadow-xs text-xs font-semibold text-[#2D2833]">
                <span className="w-2 h-2 rounded-full bg-[#8C5280] animate-pulse" />
                TAGTIQUE Smart Vehicle Tag
              </div>

              {/* Exact Geometric Sans Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#1A1A1A] leading-[1.12] tracking-tight">
                Get a smart QR<br />tag for your vehicle
              </h1>

              {/* Subheading text */}
              <p className="text-base sm:text-lg text-[#71717A] leading-relaxed max-w-md font-normal">
                Stick on your windshield. Anyone can reach you for blocked driveways or emergencies without seeing your real phone number.
              </p>

              {/* Input Group with Plate & Order Button */}
              <form onSubmit={handleFormSubmit} className="pt-1 max-w-md">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-2xl sm:rounded-full bg-white border border-[#EAD9EC] shadow-sm focus-within:border-[#B89BBF] focus-within:ring-2 focus-within:ring-[#EAD9EC]/60 transition-all">
                  <input
                    type="text"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter vehicle registration plate"
                    className="flex-1 px-4 py-2.5 sm:py-2 text-sm text-[#1A1A1A] placeholder:text-gray-400 bg-transparent focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 sm:py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] hover:from-[#C8D6F2] hover:via-[#E2CDE5] hover:to-[#ECC7D2] text-[#1E293B] font-bold text-sm shadow-[0_4px_16px_rgba(234,217,236,0.7)] hover:shadow-[0_6px_22px_rgba(234,217,236,0.95)] transition-all whitespace-nowrap active:scale-95 flex items-center justify-center gap-1.5 border border-white/80"
                  >
                    <span>Order tag</span>
                    <ArrowRight className="w-4 h-4 text-[#1E293B]" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-600 pl-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#D6E0F5] text-[#2C4875] flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </span>
                    <span>100% One-time payment</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#EAD9EC] text-[#5C3264] flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </span>
                    <span>Zero monthly fees</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#F3D6DE] text-[#7A2840] flex items-center justify-center shrink-0 shadow-xs">
                      <Truck className="w-3 h-3 stroke-[2.5]" />
                    </span>
                    <span>COD across Pakistan</span>
                  </span>
                </div>
              </form>

            </div>

            {/* Right Column: GlassQRTag */}
            <div className="lg:col-span-7 relative flex flex-col items-center justify-center py-6 lg:py-0">
              {/* Diffused color wash directly behind QR Tag card (matching left lavender-blue) */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="absolute -top-4 -left-10 w-[360px] h-[360px] rounded-full bg-gradient-to-br from-[#D6E0F5]/70 via-[#EBF1FC]/75 to-[#EAD9EC]/50 blur-[75px]" />
                <div className="absolute -bottom-8 -right-8 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-[#D6E0F5]/70 via-[#EBF1FC]/75 to-[#EAD9EC]/50 blur-[85px]" />
              </div>
              <GlassQRTag
                value="https://yourwebsite.com/contact/vehicle-123"
                title="Scan QR Code"
                subtitle="Scan to privately contact the vehicle owner"
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
