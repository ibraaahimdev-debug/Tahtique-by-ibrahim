import React, { useState } from 'react';
import { GlassQRTag } from './GlassQRTag';
import { Shield, Check, Car, Building2, Home } from 'lucide-react';

const SAMPLE_USE_CASES = [
  {
    id: 'vehicle',
    name: 'Vehicle Windshield Tag',
    icon: Car,
    plate: 'LES-24-9182',
    tagId: 'TGT-VEH-01',
    url: 'https://tagtique.com/c/LES-24-9182',
    title: 'Scan to Contact',
    subtitle: 'Need to reach the vehicle owner?',
    description: 'Scan this QR code to securely notify the driver for blocked parking or roadside alerts.',
  },
  {
    id: 'residential',
    name: 'Apartment Parking Permit',
    icon: Home,
    plate: 'BAY-402-RES',
    tagId: 'TGT-RES-402',
    url: 'https://tagtique.com/permit/BAY-402',
    title: 'Resident Contact',
    subtitle: 'Blocked assigned resident parking bay?',
    description: 'Scan to trigger an immediate priority alert to the registered apartment resident.',
  },
  {
    id: 'office',
    name: 'Corporate Fleet / Office',
    icon: Building2,
    plate: 'FLT-EXEC-08',
    tagId: 'TGT-CORP-08',
    url: 'https://tagtique.com/fleet/EXEC-08',
    title: 'Fleet Driver Relay',
    subtitle: 'Official corporate vehicle parking contact',
    description: 'Directs to company security dispatch and assigns immediate driver relocation.',
  },
];

export const GlassQRSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const current = SAMPLE_USE_CASES[activeTab];

  return (
    <section
      id="qr-contact-card"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50/90 via-slate-100/50 to-slate-50 overflow-hidden font-sans select-none"
    >
      {/* Subtle Neutral Ambient Shapes Behind the Glass (Enhances Frosted Backdrop Blur) */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-slate-200/50 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-1/4 w-[380px] h-[380px] rounded-full bg-slate-300/30 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Section Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 shadow-2xs text-[11px] font-semibold text-slate-700 mb-4">
          <Shield className="w-3.5 h-3.5 text-slate-600" />
          <span>PRODUCTION-READY COMPONENT</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight max-w-xl">
          Glassmorphic QR Contact Card
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-slate-500 max-w-lg font-normal leading-relaxed">
          Premium frosted acrylic card for vehicles and parking permits. High-contrast, 100% scannable QR with zero exposed personal phone numbers.
        </p>

        {/* Use Case Switcher Tabs */}
        <div className="mt-6 sm:mt-8 p-1 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/70 shadow-2xs inline-flex flex-wrap items-center justify-center gap-1">
          {SAMPLE_USE_CASES.map((uc, idx) => {
            const Icon = uc.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={uc.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-200' : 'text-slate-400'}`} />
                <span>{uc.name}</span>
              </button>
            );
          })}
        </div>

        {/* Centered QR Presentation Card */}
        <div className="mt-10 sm:mt-12 w-full flex flex-col items-center justify-center">
          <GlassQRTag
            key={current.id}
            value={current.url}
            title={current.title}
            subtitle={`${current.plate} • Private Relay`}
            qrSize={210}
          />
        </div>

        {/* Trust Badges below QR presentation */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-slate-700" />
            <span>100% Dynamic & Scannable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-slate-700" />
            <span>Apple-Grade Frosted Glass</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-slate-700" />
            <span>Zero Public Phone Number Leak</span>
          </div>
        </div>
      </div>
    </section>
  );
};
