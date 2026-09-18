import React, { useState } from 'react';
import { QRCard } from './QRCard';
import { QRHeader } from './QRHeader';
import { QRRenderer } from './QRRenderer';
import { QRContactAction } from './QRContactAction';
import { X, Send, CheckCircle2, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';

export interface GlassQRCodeProps {
  value?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  actionLabel?: string;
  tagId?: string;
  vehiclePlate?: string;
  onActionClick?: () => void;
  className?: string;
  qrSize?: number;
}

/**
 * GlassQRCode: Reusable, production-quality Glassmorphic QR Contact Card.
 * Complies with Apple-style frosted glass aesthetics, dark charcoal QR modules,
 * 100% scannable dynamic QR rendering, and the parking roadside contact hierarchy.
 */
export const GlassQRCode: React.FC<GlassQRCodeProps> = ({
  value = 'https://tagtique.com/c/PK-8492',
  title = 'Scan to Contact',
  subtitle = 'Need to reach the vehicle owner?',
  description = 'Scan this QR code to securely contact the vehicle owner.',
  actionLabel = 'Send a private notification',
  tagId = 'TGT-4820',
  vehiclePlate = 'LES-24-9182',
  onActionClick,
  className = '',
  qrSize = 210,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('blocking');
  const [customNote, setCustomNote] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleAction = () => {
    if (onActionClick) {
      onActionClick();
    } else {
      setIsSent(false);
      setIsModalOpen(true);
    }
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsSent(false);
      setCustomNote('');
    }, 2800);
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* The Frosted Glass Acrylic QR Card */}
      <QRCard>
        {/* Top Header: Security Status & Vehicle Tag Reference */}
        <QRHeader tagId={tagId} vehiclePlate={vehiclePlate} />

        {/* Center: High-Contrast Scannable Dynamic QR Plate */}
        <div className="w-full flex items-center justify-center py-4 sm:py-5">
          <div
            className="p-3 sm:p-3.5 rounded-2xl bg-white/95 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex items-center justify-center"
            title="Scan with phone camera to contact owner"
          >
            <QRRenderer value={value} size={qrSize} moduleColor="#0F172A" />
          </div>
        </div>

        {/* Bottom: Contact Action Hierarchy */}
        <QRContactAction
          title={title}
          subtitle={subtitle}
          description={description}
          actionLabel={actionLabel}
          onActionClick={handleAction}
        />
      </QRCard>

      {/* Realistic Soft Ambient Grounding Shadow on the Page Surface */}
      <div
        className="w-44 sm:w-56 h-6 rounded-[100%] bg-slate-900/6 blur-xl pointer-events-none mt-2"
        aria-hidden="true"
      />

      {/* INTERACTIVE PRIVATE NOTIFICATION MODAL (Demonstrates the Parking Contact Flow) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Private Vehicle Relay
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Target: {vehiclePlate || tagId}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            {isSent ? (
              <div className="py-8 flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h5 className="text-base font-semibold text-slate-900">
                  Notification Dispatched
                </h5>
                <p className="text-xs text-slate-500 max-w-xs">
                  An encrypted SMS and automated voice prompt have been triggered to the vehicle owner.
                </p>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Average owner response: 45 seconds
                </span>
              </div>
            ) : (
              <form onSubmit={handleSendNotification} className="pt-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Reason for contact:
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'blocking', label: 'Vehicle is blocking my way', icon: AlertTriangle },
                      { id: 'lights', label: 'Headlights or window left open', icon: Clock },
                      { id: 'emergency', label: 'Immediate parking emergency', icon: ShieldCheck },
                    ].map((reason) => {
                      const Icon = reason.icon;
                      return (
                        <button
                          key={reason.id}
                          type="button"
                          onClick={() => setSelectedReason(reason.id)}
                          className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-2.5 text-xs transition-all ${
                            selectedReason === reason.id
                              ? 'border-slate-900 bg-slate-50 font-semibold text-slate-900 shadow-2xs'
                              : 'border-slate-200 hover:border-slate-300 text-slate-600'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${selectedReason === reason.id ? 'text-slate-900' : 'text-slate-400'}`} />
                          <span>{reason.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Optional quick note:
                  </label>
                  <textarea
                    rows={2}
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="e.g., I need to leave in 5 minutes from space #12"
                    className="w-full px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5 text-slate-300" />
                  <span>Send Anonymous Alert to Owner</span>
                </button>

                <p className="text-[10px] text-center text-slate-400 leading-tight">
                  Your phone number will never be disclosed to the vehicle owner.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
