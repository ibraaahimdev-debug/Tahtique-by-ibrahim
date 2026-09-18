import React, { useState } from 'react';
import { Card } from '../common/Card';
import { TRUST_FEATURES } from '../../data/mockData';
import {
  ShieldCheck,
  EyeOff,
  Lock,
  PhoneCall,
  Smartphone,
  Server,
  CheckCircle,
  X,
} from 'lucide-react';
import { Button } from '../common/Button';

export const TrustSection: React.FC = () => {
  const [activeNodeModal, setActiveNodeModal] = useState<number | null>(null);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number | null>(null);
  const [testSimState, setTestSimState] = useState<string | null>(null);

  const handleRunSim = (type: string) => {
    setTestSimState(type);
    setTimeout(() => {
      setTestSimState(null);
    }, 4000);
  };

  return (
    <section id="privacy" className="py-20 md:py-28 bg-white relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#D6E0F5]/80 via-[#EAD9EC]/80 to-[#F3D6DE]/80 text-[#5C3264] text-xs sm:text-sm font-bold uppercase tracking-wider border border-white/60 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#5C3264]" />
            <span>Bank-Grade Privacy & Relay Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A1A1A] tracking-tight">
            Your Personal Number Is Never Revealed
          </h2>
          <p className="text-base sm:text-lg text-gray-500 font-normal leading-relaxed">
            Unlike writing your mobile number on a paper dashboard slip, Tagtique acts as an encrypted buffer. Click any node below to test the connection.
          </p>
        </div>

        {/* Visual Relay Diagram Card */}
        <div className="mb-16">
          <Card className="bg-gradient-to-br from-[#EBF1FC]/70 via-white to-[#F7EBEF]/60 border border-[#EAD9EC] !p-8 md:!p-12 shadow-md rounded-3xl">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5C3264] bg-white px-3 py-1 rounded-full shadow-xs border border-[#EAD9EC]/60">
                Interactive Architecture
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-[#1A1A1A] mt-2">
                Click Any Node to Test Relay Security
              </h3>
            </div>

            {/* Diagram 3-Node Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative">
              
              {/* Step 1: Scanner Node */}
              <div
                onClick={() => setActiveNodeModal(1)}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border-2 border-transparent hover:border-[#EAD9EC] text-center flex flex-col items-center cursor-pointer transition-all duration-300 hover:-translate-y-1.5 group select-none"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D6E0F5] to-[#EAD9EC] group-hover:scale-105 flex items-center justify-center text-[#5C3264] mb-4 transition-all shadow-xs">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAD9EC]/60 text-[#5C3264] mb-2">
                  1. The Bystander
                </div>
                <h4 className="font-bold text-[#1A1A1A] text-base mb-1 group-hover:text-[#5C3264] transition-colors">
                  Scans Windshield Tag
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Opens camera app. Sees vehicle profile and taps "Notify Driver" or "Call Owner".
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 w-full flex items-center justify-center gap-1.5 text-xs text-[#5C3264] font-semibold">
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Click to Test Scanner View ➔</span>
                </div>
              </div>

              {/* Step 2: Tagtique Relay Gateway Node */}
              <div
                onClick={() => setActiveNodeModal(2)}
                className="bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] rounded-2xl p-6 shadow-xl border-2 border-white text-center flex flex-col items-center relative z-10 scale-[1.03] cursor-pointer transition-all duration-300 hover:scale-[1.06] select-none"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/40 backdrop-blur-md flex items-center justify-center text-[#5C3264] mb-4 border border-white/60 shadow-xs">
                  <Server className="w-7 h-7" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/80 text-[#5C3264] mb-2 shadow-xs">
                  2. Tagtique Cloud
                </div>
                <h4 className="font-bold text-[#1E293B] text-base mb-1">
                  Encrypted Relay Buffer
                </h4>
                <p className="text-xs text-[#5C3264] leading-relaxed">
                  Our telecom bridge assigns a masked virtual proxy line. Instantly routes calls/SMS securely.
                </p>
                <div className="mt-4 pt-3 border-t border-black/10 w-full flex items-center justify-center gap-1.5 text-xs text-[#7A2840] font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Click to Inspect Encryption ➔</span>
                </div>
              </div>

              {/* Step 3: Vehicle Owner Node */}
              <div
                onClick={() => setActiveNodeModal(3)}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border-2 border-transparent hover:border-[#EAD9EC] text-center flex flex-col items-center cursor-pointer transition-all duration-300 hover:-translate-y-1.5 group select-none"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F3D6DE] to-[#FFD4E9] group-hover:scale-105 flex items-center justify-center text-[#7A2840] mb-4 transition-all shadow-xs">
                  <PhoneCall className="w-7 h-7" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAD9EC]/60 text-[#5C3264] mb-2">
                  3. You (Car Owner)
                </div>
                <h4 className="font-bold text-[#1A1A1A] text-base mb-1 group-hover:text-[#5C3264] transition-colors">
                  Receive Safe Alert
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Your phone rings with caller ID "Tagtique Vehicle Alert". Answer safely without number sharing.
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 w-full flex items-center justify-center gap-1.5 text-xs text-[#5C3264] font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Click to Simulate Alert ➔</span>
                </div>
              </div>

            </div>

            {/* Bottom summary statement */}
            <div className="mt-8 pt-6 border-t border-[#EAD9EC] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#5C3264]" />
                <span className="font-semibold">
                  Guaranteed privacy: No marketing brokers, no public registries, and zero number leaks.
                </span>
              </div>
              <span className="text-[#5C3264] font-bold">
                100% Protected 24/7/365 in Pakistan
              </span>
            </div>
          </Card>
        </div>

        {/* 4 Clickable Trust Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_FEATURES.map((feature, idx) => (
            <div
              key={idx}
              onClick={() => setActiveFeatureIndex(idx)}
              className="p-6 rounded-2xl bg-white border-2 border-[#EAD9EC]/60 hover:border-[#EAD9EC] hover:bg-[#F7EBEF]/30 hover:shadow-md transition-all cursor-pointer select-none space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C3264] bg-[#EAD9EC]/70 px-2.5 py-0.5 rounded-full shadow-2xs">
                  {feature.badge}
                </span>
                <span className="text-xs text-[#5C3264] opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                  Read More ➔
                </span>
              </div>
              <h4 className="text-base font-bold text-[#1A1A1A] pt-1 group-hover:text-[#5C3264] transition-colors">
                {feature.title}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* NODE INTERACTIVE SIMULATION MODALS */}
      {/* ========================================================================= */}
      {activeNodeModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-200">
            
            <button
              type="button"
              onClick={() => {
                setActiveNodeModal(null);
                setTestSimState(null);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* NODE 1 MODAL */}
            {activeNodeModal === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D6E0F5] to-[#EAD9EC] text-[#5C3264] flex items-center justify-center shadow-xs">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Node 1: Bystander Scanner Interface</h3>
                    <p className="text-xs text-gray-500">Universal browser-based contact modal</p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  Anyone scanning your QR code opens a lightweight, secure mobile page. They never see your name, personal mobile number, or address.
                </p>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between font-mono text-[11px] text-gray-500 pb-2 border-b border-gray-200">
                    <span>STATUS: ANONYMIZED PROXY</span>
                    <span className="text-emerald-600 font-bold">ACTIVE</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleRunSim('bystander_block')}
                      className="flex-1 py-2 rounded-xl bg-white border border-gray-300 font-semibold hover:border-[#EAD9EC] hover:text-[#5C3264] transition-colors"
                    >
                      Simulate "Blocked Car"
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRunSim('bystander_light')}
                      className="flex-1 py-2 rounded-xl bg-white border border-gray-300 font-semibold hover:border-[#EAD9EC] hover:text-[#5C3264] transition-colors"
                    >
                      Simulate "Lights On"
                    </button>
                  </div>

                  {testSimState && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium animate-in fade-in">
                      ✓ Instant alert dispatched via encrypted gateway in 1.4 seconds!
                    </div>
                  )}
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  size="md"
                  onClick={() => {
                    setActiveNodeModal(null);
                    const el = document.getElementById('pricing');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Order Windshield QR Tag
                </Button>
              </div>
            )}

            {/* NODE 2 MODAL */}
            {activeNodeModal === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D6E0F5] to-[#EAD9EC] text-[#5C3264] flex items-center justify-center shadow-xs">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Node 2: Tagtique Cloud Telecom Gateway</h3>
                    <p className="text-xs text-gray-500">256-bit encrypted dynamic proxy lines</p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  When a call or SMS is triggered, our cloud server assigns an ephemeral masked telephone number that connects the call across Pakistani networks (Jazz, Zong, Telenor, Ufone).
                </p>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <span className="font-bold text-gray-700">Relay Encryption:</span>
                    <span className="font-mono text-emerald-600 font-bold">AES-256 SSL</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <span className="font-bold text-gray-700">Anti-Spam Filter:</span>
                    <span className="text-gray-600">Rate-limit max 3 alerts / 10 mins</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <span className="font-bold text-gray-700">Night Shield (DND):</span>
                    <span className="text-gray-600">Configurable Quiet Hours</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  size="md"
                  onClick={() => setActiveNodeModal(null)}
                >
                  Got It
                </Button>
              </div>
            )}

            {/* NODE 3 MODAL */}
            {activeNodeModal === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Node 3: Vehicle Owner Phone Receipt</h3>
                    <p className="text-xs text-gray-500">Safely answering alerts anywhere in Pakistan</p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  Your regular phone rings with the caller ID "TAGTIQUE ALERT". When you pick up, an automated voice prompts: *"You have a vehicle parking notification for plate ICT-492."*
                </p>

                <div className="p-4 rounded-2xl bg-gradient-to-b from-gray-900 to-black text-white space-y-3 text-center">
                  <PhoneCall className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                  <span className="text-sm font-bold block">INCOMING SECURE CALL</span>
                  <span className="text-xs text-gray-400 block font-mono">TAGTIQUE PROXY: +92 51 •••• 910</span>
                  <p className="text-[11px] text-gray-400">
                    Answer freely. The caller never discovers your personal mobile number.
                  </p>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  size="md"
                  onClick={() => setActiveNodeModal(null)}
                >
                  Close Simulation
                </Button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TRUST FEATURE PILLAR DEEP-DIVE MODAL */}
      {/* ========================================================================= */}
      {activeFeatureIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setActiveFeatureIndex(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors"
              aria-label="Close feature details"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EAD9EC]/70 text-[#5C3264] border border-[#EAD9EC]">
                {TRUST_FEATURES[activeFeatureIndex].badge}
              </span>
              <h3 className="text-xl font-bold text-gray-900">
                {TRUST_FEATURES[activeFeatureIndex].title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {TRUST_FEATURES[activeFeatureIndex].description}
              </p>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-1">
                <div className="font-bold text-gray-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#5C3264]" />
                  <span>Why this matters for your car:</span>
                </div>
                <p>
                  Paper notes on car windows lead to spam SMS, harassment calls, and unwanted marketing lists. TAGTIQUE eliminates this risk permanently with bank-grade caller encryption.
                </p>
              </div>

              <Button
                variant="primary"
                fullWidth
                size="md"
                onClick={() => setActiveFeatureIndex(null)}
              >
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
