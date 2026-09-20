import React, { useState } from 'react';
import { Card } from '../common/Card';
import { HOW_IT_WORKS_STEPS } from '../../data/mockData';
import {
  ShoppingCart,
  Smartphone,
  Printer,
  ArrowRight,
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  PhoneCall,
  BellRing,
  Truck,
  EyeOff,
  Car,
} from 'lucide-react';
import { Button } from '../common/Button';

interface HowItWorksProps {
  onOrderClick: (packageId?: string) => void;
  onNavigateToTracking?: (orderId?: string) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  onOrderClick,
  onNavigateToTracking: _onNavigateToTracking,
}) => {
  const [activeModalStep, setActiveModalStep] = useState<number | null>(null);

  // Step 2 Simulator State
  const [demoPlate, setDemoPlate] = useState('ICT • 492');
  const [demoPhone, setDemoPhone] = useState('+92 300 1234567');
  const [demoMasked, setDemoMasked] = useState(false);

  // Step 4 Bystander Simulator State
  const [bystanderAlertSent, setBystanderAlertSent] = useState<string | null>(null);
  const [isCallingOwner, setIsCallingOwner] = useState(false);

  const stepIcons = [
    <ShoppingCart className="w-6 h-6 text-[#5C3264]" />,
    <Smartphone className="w-6 h-6 text-[#5C3264]" />,
    <Printer className="w-6 h-6 text-[#5C3264]" />,
    <ShieldCheck className="w-6 h-6 text-[#5C3264]" />,
  ];

  const handleCardClick = (stepNumber: number) => {
    setActiveModalStep(stepNumber);
    setBystanderAlertSent(null);
    setIsCallingOwner(false);
  };

  const handleSimulateAlert = (alertText: string) => {
    setBystanderAlertSent(alertText);
    setTimeout(() => {
      setBystanderAlertSent(null);
    }, 4500);
  };

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative overflow-hidden bg-transparent font-sans scroll-mt-24">
      <span id="product" className="sr-only" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs sm:text-sm font-semibold text-[#5C3264] uppercase tracking-wider bg-gradient-to-r from-[#D6E0F5]/80 via-[#EAD9EC]/80 to-[#F3D6DE]/80 px-3.5 py-1.5 rounded-full inline-block border border-white/60 shadow-xs">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A1A1A] tracking-tight">
            How Tagtique Works
          </h2>
          <p className="text-base sm:text-lg text-[#71717A] font-normal leading-relaxed">
            From ordering your tag to total vehicle privacy on the road — fully configured in minutes.
          </p>
        </div>

        {/* 4 Clickable Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <div
              key={step.stepNumber}
              onClick={() => handleCardClick(step.stepNumber)}
              className="relative flex flex-col cursor-pointer group select-none"
            >
              <Card
                hoverable
                className="flex-1 flex flex-col justify-between border-2 border-[#EAD9EC]/60 group-hover:border-[#EAD9EC] group-hover:shadow-[0_12px_30px_rgba(234,217,236,0.5)] transition-all duration-300 !p-7 bg-white group-hover:-translate-y-2 rounded-3xl"
              >
                <div>
                  {/* Step Header Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold text-[#5C3264] bg-[#EAD9EC]/70 group-hover:bg-gradient-to-r group-hover:from-[#D6E0F5] group-hover:to-[#EAD9EC] group-hover:text-[#1E293B] transition-colors px-3 py-1 rounded-full">
                      {step.badge}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D6E0F5] to-[#EAD9EC] flex items-center justify-center group-hover:scale-110 shadow-xs transition-all duration-300">
                      {stepIcons[index]}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2.5 tracking-tight group-hover:text-[#5C3264] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Sub-indicator CTA Button */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#5C3264]">
                  <span>Step {index + 1} of 4</span>
                  <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom Fast Action Prompt */}
        <div className="mt-14 text-center">
          <button
            type="button"
            onClick={() => onOrderClick('pack-of-two')}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#5C3264] hover:text-[#7A2840] hover:underline"
          >
            <span>Ready to protect your vehicle? Choose your pack (From PKR 1,499)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE STEP DEMONSTRATION MODALS */}
      {/* ========================================================================= */}
      {activeModalStep !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalStep(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors focus:outline-none"
              aria-label="Close interactive modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* MODAL CONTENT: STEP 1 (Order Your Tag) */}
            {activeModalStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D6E0F5] to-[#EAD9EC] text-[#5C3264] flex items-center justify-center shrink-0 shadow-xs">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5C3264]">
                      Step 01 Interactive Preview
                    </span>
                    <h3 className="text-xl font-bold text-[#1A1A1A]">
                      Select Your Tagtique Pack
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Choose the number of tags needed for your vehicles. Fast doorstep delivery across all cities in Pakistan with Cash on Delivery (COD).
                </p>

                {/* Quick Pack Selector in Modal */}
                <div className="grid grid-cols-3 gap-3">
                  <div
                    onClick={() => {
                      setActiveModalStep(null);
                      onOrderClick('single-tag');
                    }}
                    className="p-3.5 rounded-2xl border-2 border-gray-200 hover:border-[#EAD9EC] hover:bg-[#EAD9EC]/20 cursor-pointer transition-all text-center"
                  >
                    <span className="text-xs font-bold text-gray-700 block">Single Tag</span>
                    <span className="text-base font-extrabold text-[#1A1A1A] block mt-1">PKR 1,499</span>
                    <span className="text-[10px] text-gray-400">1 Vehicle</span>
                  </div>

                  <div
                    onClick={() => {
                      setActiveModalStep(null);
                      onOrderClick('pack-of-two');
                    }}
                    className="p-3.5 rounded-2xl border-2 border-[#EAD9EC] bg-gradient-to-b from-[#EBF1FC]/50 to-[#EAD9EC]/30 cursor-pointer transition-all text-center shadow-xs relative ring-2 ring-[#EAD9EC]/40"
                  >
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] text-[9px] font-bold rounded-full uppercase border border-white/80 shadow-xs">
                      Popular
                    </span>
                    <span className="text-xs font-bold text-[#5C3264] block">Pack of 2</span>
                    <span className="text-base font-extrabold text-[#1A1A1A] block mt-1">PKR 2,499</span>
                    <span className="text-[10px] text-gray-500">2 Vehicles</span>
                  </div>

                  <div
                    onClick={() => {
                      setActiveModalStep(null);
                      onOrderClick('family-pack');
                    }}
                    className="p-3.5 rounded-2xl border-2 border-gray-200 hover:border-[#EAD9EC] hover:bg-[#EAD9EC]/20 cursor-pointer transition-all text-center"
                  >
                    <span className="text-xs font-bold text-gray-700 block">Family 4-Pack</span>
                    <span className="text-base font-extrabold text-[#1A1A1A] block mt-1">PKR 4,499</span>
                    <span className="text-[10px] text-gray-400">4 Vehicles</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>100% One-Time Charge</span>
                  </div>
                  <p className="text-emerald-700">
                    No monthly fees. Lifetime QR proxy relay and free courier delivery across Pakistan included.
                  </p>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={() => {
                    setActiveModalStep(null);
                    onOrderClick('pack-of-two');
                  }}
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Start Order Wizard in PKR
                </Button>
              </div>
            )}

            {/* MODAL CONTENT: STEP 2 (Add Your Details & Privacy Simulation) */}
            {activeModalStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D6E0F5] to-[#EAD9EC] text-[#5C3264] flex items-center justify-center shrink-0 shadow-xs">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5C3264]">
                      Step 02 Interactive Simulator
                    </span>
                    <h3 className="text-xl font-bold text-[#1A1A1A]">
                      Test Number Masking Live
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  Type your vehicle registration plate and private phone below to test how our encryption shield keeps your real number hidden from the public.
                </p>

                <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Your Vehicle Plate (e.g. ICT-492, LEA-8821):
                    </label>
                    <input
                      type="text"
                      value={demoPlate}
                      onChange={(e) => setDemoPlate(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono font-bold uppercase bg-white text-[#1A1A1A] focus:outline-none focus:border-[#B89BBF] focus:ring-2 focus:ring-[#EAD9EC]/60"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Your Personal Mobile Number:
                    </label>
                    <input
                      type="text"
                      value={demoPhone}
                      onChange={(e) => setDemoPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white text-[#1A1A1A] focus:outline-none focus:border-[#B89BBF] focus:ring-2 focus:ring-[#EAD9EC]/60"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setDemoMasked(!demoMasked)}
                    className={`w-full py-2 rounded-xl text-xs font-bold shadow-sm transition-all ${
                      demoMasked
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] border border-white/80'
                    }`}
                  >
                    {demoMasked ? '✓ Encrypted Relay Proxy Active' : 'Generate Encrypted Relay Proxy'}
                  </button>
                </div>

                {/* Simulated Output Box */}
                <div className="p-4 rounded-2xl bg-white border-2 border-[#EAD9EC] shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-700 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#5C3264]" />
                      Public Windshield QR View:
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Protected
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Bystanders scanning <span className="font-mono font-bold text-[#1A1A1A]">{demoPlate || 'YOUR CAR'}</span> only see:
                  </p>
                  <div className="p-2.5 rounded-xl bg-[#EAD9EC]/40 text-xs font-mono text-[#5C3264] flex items-center justify-between font-bold border border-[#EAD9EC]/60">
                    <span>RELAY ID: TGT-{demoPlate.replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'PAK'}-SECURE</span>
                    <EyeOff className="w-4 h-4 text-[#5C3264]" />
                  </div>
                  <p className="text-[11px] text-gray-400 italic">
                    Your real number ({demoPhone}) is securely locked in our telecom gateway and never rendered in HTML or QR data.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    fullWidth
                    size="md"
                    onClick={() => {
                      setActiveModalStep(null);
                      onOrderClick('pack-of-two');
                    }}
                  >
                    Configure My Vehicle Details
                  </Button>
                </div>
              </div>
            )}

            {/* MODAL CONTENT: STEP 3 (We Print & Ship Demo) */}
            {activeModalStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D6E0F5] to-[#EAD9EC] text-[#5C3264] flex items-center justify-center shrink-0 shadow-xs">
                    <Printer className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5C3264]">
                      Step 03 Manufacturing & Shipping
                    </span>
                    <h3 className="text-xl font-bold text-[#1A1A1A]">
                      High-Precision Automotive Printing
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  Every tag is printed using precision Japanese UV-cure ink on automotive 3M vinyl, sealed with an anti-scratch matte layer.
                </p>

                {/* Visual Layers Spec */}
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <span className="font-bold text-gray-800">Top Layer:</span>
                    <span className="text-gray-600">UV Matte Lamination (Anti-glare & Sun-resistant)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <span className="font-bold text-gray-800">Print Layer:</span>
                    <span className="text-gray-600">Ultra-crisp 2400 DPI Vector QR Core</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <span className="font-bold text-gray-800">Adhesive Base:</span>
                    <span className="text-gray-600">3M Automotive Glass Vinyl (No residue removal)</span>
                  </div>
                </div>

                {/* Delivery Spec */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#D6E0F5]/50 to-[#EAD9EC]/50 border border-[#EAD9EC] text-xs text-[#2C4875] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Truck className="w-4 h-4 text-[#5C3264]" />
                    <span>Nationwide Fast Courier Delivery:</span>
                  </div>
                  <p className="text-[#5C3264]">
                    Shipped in tamper-evident protective mailers via TCS & Leopard Courier with live online SMS tracking.
                  </p>
                </div>

                <div className="flex gap-3">
                  <a
                    href="https://wa.me/923292082080"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-full border border-[#25D366] text-emerald-700 hover:bg-emerald-50 text-sm font-semibold transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span>WhatsApp: 0329-2082080</span>
                  </a>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setActiveModalStep(null);
                      onOrderClick('pack-of-two');
                    }}
                    className="flex-1"
                  >
                    Order My Tag
                  </Button>
                </div>
              </div>
            )}

            {/* MODAL CONTENT: STEP 4 (Interactive Bystander Scanner Simulation) */}
            {activeModalStep === 4 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D6E0F5] to-[#EAD9EC] text-[#5C3264] flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5C3264]">
                      Step 04 Live Bystander Interaction
                    </span>
                    <h3 className="text-xl font-bold text-[#1A1A1A]">
                      What Someone Sees When Scanning
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  No app required. When someone points their iPhone or Android camera at your tag, this exact interactive screen opens instantly in their mobile browser:
                </p>

                {/* Simulated Phone Screen */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#1E293B] to-[#0F172A] text-white shadow-inner border border-gray-700 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-white">
                        TAGTIQUE VERIFIED VEHICLE
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#EAD9EC]/20 text-[#EAD9EC] text-[10px] font-mono border border-[#EAD9EC]/30">
                      ICT • 492
                    </span>
                  </div>

                  <div className="text-center py-1">
                    <h4 className="text-base font-bold text-white">
                      Need to reach the vehicle owner?
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Select an alert below or tap to call through our masked line:
                    </p>
                  </div>

                  {/* Simulated Alert Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleSimulateAlert('Alert Sent: Car is blocking driveway!')}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition-all flex items-center gap-2"
                    >
                      <Car className="w-4 h-4 text-[#D6E0F5] shrink-0" />
                      <span>Blocked Driveway</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateAlert('Alert Sent: Headlights left on!')}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition-all flex items-center gap-2"
                    >
                      <BellRing className="w-4 h-4 text-[#FACC15] shrink-0" />
                      <span>Headlights Left On</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSimulateAlert('Alert Sent: Window is cracked open!')}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition-all flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#4ADE80] shrink-0" />
                      <span>Window Left Open</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsCallingOwner(true);
                        setTimeout(() => setIsCallingOwner(false), 4000);
                      }}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] text-left font-bold transition-all flex items-center gap-2 border border-white/80"
                    >
                      <PhoneCall className="w-4 h-4 text-[#5C3264] shrink-0" />
                      <span>Call Owner Privately</span>
                    </button>
                  </div>

                  {/* Simulated Toast inside Phone */}
                  {bystanderAlertSent && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>{bystanderAlertSent} (Relayed via SMS in under 2s)</span>
                    </div>
                  )}

                  {isCallingOwner && (
                    <div className="p-2.5 rounded-xl bg-[#EAD9EC]/20 border border-[#EAD9EC]/40 text-[#EAD9EC] text-xs flex items-center gap-2 animate-in fade-in">
                      <PhoneCall className="w-4 h-4 shrink-0 text-[#EAD9EC] animate-bounce" />
                      <span>Masked relay connected! Calling owner via proxy +92 51 •••• 910...</span>
                    </div>
                  )}
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={() => {
                    setActiveModalStep(null);
                    onOrderClick('pack-of-two');
                  }}
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Get This Tag for My Car
                </Button>
              </div>
            )}

          </div>
        </div>
      )}
    </section>
  );
};
