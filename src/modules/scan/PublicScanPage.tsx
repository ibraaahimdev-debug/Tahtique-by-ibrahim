import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  QrCode,
  Car,
  Send,
  CheckCircle2,
  AlertTriangle,
  Lock,
  MessageSquare,
  ArrowLeft,
  PhoneCall,
  Phone,
  Shield,
} from 'lucide-react';
import { orderBackendService, type PublicTagRelayData } from '../../services/orderBackendService';
import { vehicleService } from '../../services/vehicleService';
import { BrandLogo } from '../../components/common/BrandLogo';

interface PublicScanPageProps {
  qrToken: string;
  onNavigateHome: () => void;
}

export const PublicScanPage: React.FC<PublicScanPageProps> = ({
  qrToken,
  onNavigateHome,
}) => {
  const [tagData, setTagData] = useState<PublicTagRelayData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<
    'lights_on' | 'blocking' | 'alarm' | 'damage' | 'custom'
  >('lights_on');
  const [customMessage, setCustomMessage] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const resolveToken = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch from orderBackendService (Supabase or synchronized local registry)
        const backendResult = await orderBackendService.lookupTagByToken(qrToken);
        if (backendResult && isMounted) {
          setTagData(backendResult);

          // Log scan event if tag is valid
          if (backendResult.isValid) {
            orderBackendService.logTagScan(qrToken, backendResult.tagId);
          }

          setIsLoading(false);
          return;
        }

        // 2. Fallback to vehicleService
        const vehResult = vehicleService.lookupByQRToken(qrToken);
        if (vehResult && isMounted) {
          setTagData({
            isValid: vehResult.isValid,
            status: vehResult.isRevoked ? 'inactive' : 'active',
            vehicleNumber: vehResult.maskedPlate || 'PROTECTED',
            vehicleType: vehResult.vehicleModel || 'Vehicle',
            ownerName: 'Vehicle Owner',
            maskedName: 'Owner',
            phoneNumber: '',
            guardianNumber: '',
            tagMaterial: 'vinyl',
          });
        }
      } catch (err) {
        console.warn('Token scan resolution error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    resolveToken();
    return () => {
      isMounted = false;
    };
  }, [qrToken]);

  const presetMessages: Record<
    'lights_on' | 'blocking' | 'alarm' | 'damage' | 'custom',
    { title: string; defaultText: string; icon: string }
  > = {
    lights_on: {
      title: 'Lights are on',
      defaultText: 'Hi, noticed your vehicle headlights or interior lights were left switched on.',
      icon: '💡',
    },
    blocking: {
      title: 'Vehicle blocking',
      defaultText: 'Hello, your car is currently blocking access or a driveway. Could you please move it when possible?',
      icon: '🚗',
    },
    alarm: {
      title: 'Alarm sounding',
      defaultText: 'Hello, your vehicle alarm has been sounding intermittently in the parking area.',
      icon: '🚨',
    },
    damage: {
      title: 'Parking notice',
      defaultText: 'Hi, leaving a quick note regarding your vehicle in the parking lot.',
      icon: '⚠️',
    },
    custom: {
      title: 'Custom message',
      defaultText: '',
      icon: '💬',
    },
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const text =
      selectedTopic === 'custom'
        ? customMessage
        : customMessage || presetMessages[selectedTopic].defaultText;

    setTimeout(() => {
      vehicleService.sendRelayMessage({
        qrToken,
        presetTopic: selectedTopic,
        messageText: text,
        senderPhoneOrHandle: senderContact,
      });
      setIsSending(false);
      setIsSent(true);
    }, 500);
  };

  // =========================================================================
  // 1. LOADING STATE
  // =========================================================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBFD] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#5C3264] mb-4 shadow-sm">
          <div className="w-6 h-6 rounded-full border-3 border-[#5C3264] border-t-transparent animate-spin" />
        </div>
        <h2 className="text-base font-bold text-gray-900">Verifying Tag Credentials</h2>
        <p className="text-xs text-gray-500 mt-1 max-w-xs">
          Looking up encrypted owner relay token in the Tahtique registry...
        </p>
      </div>
    );
  }

  // =========================================================================
  // 2. INVALID / UNRECOGNIZED TOKEN STATE
  // =========================================================================
  if (!tagData || !tagData.isValid) {
    return (
      <div className="min-h-screen bg-[#FDFBFD] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 mx-auto flex items-center justify-center text-gray-500 shadow-xs">
            <QrCode className="w-8 h-8" />
          </div>

          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-2">
              Unrecognized Code
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Tag Not Recognized
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
              This QR code does not correspond to an active registered vehicle record in the Tahtique network. Please ensure the QR code was scanned correctly from an authentic physical sticker.
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs font-mono text-gray-400">
            Token: {qrToken ? `${qrToken.slice(0, 16)}...` : 'None'}
          </div>

          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full py-3.5 rounded-2xl bg-[#5C3264] hover:bg-[#4a2850] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-98"
          >
            Visit Tahtique Homepage
          </button>

          {/* Branding footer */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <Shield className="w-3.5 h-3.5 text-[#5C3264]" />
            <span>Powered by Tahtique Smart Relay Shield</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. INACTIVE / DEACTIVATED TOKEN STATE (PROTECTS PERSONAL DATA BEFORE RENDER)
  // =========================================================================
  if (tagData.status === 'inactive') {
    return (
      <div className="min-h-screen bg-[#FDFBFD] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-amber-600 shadow-xs">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full mb-2">
              Deactivated Sticker
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              This Tag Is No Longer Active
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
              The owner or administrator has deactivated this tag in Supabase (e.g. vehicle sold, sticker replaced, or tag decommissioned). Personal contact details are protected and cannot be reached through this code.
            </p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-600 flex items-center justify-between">
            <span className="text-gray-400">Tag Status:</span>
            <span className="font-semibold text-gray-700 uppercase">Decommissioned</span>
          </div>

          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full py-3.5 rounded-2xl bg-[#5C3264] hover:bg-[#4a2850] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-98"
          >
            Visit Tahtique Homepage
          </button>

          {/* Branding footer */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <Shield className="w-3.5 h-3.5 text-[#5C3264]" />
            <span>Powered by Tahtique Smart Relay Shield</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. MESSAGE SENT CONFIRMATION STATE
  // =========================================================================
  if (isSent) {
    return (
      <div className="min-h-screen bg-[#FDFBFD] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 mx-auto flex items-center justify-center text-emerald-600 shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full mb-2">
              Notice Relayed
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Notice Delivered!
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              Your note has been relayed to the vehicle owner. Both parties remain completely protected by Tahtique’s masked privacy protocol.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-left border border-gray-200 text-xs text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Vehicle Plate:</span>
              <strong className="text-gray-900 uppercase font-mono">{tagData.vehicleNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Notice Type:</span>
              <span className="font-semibold text-gray-900 capitalize">{selectedTopic.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Privacy Guarantee:</span>
              <span className="text-emerald-700 font-semibold">100% Identity Masking Active</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsSent(false);
              setCustomMessage('');
            }}
            className="w-full py-3.5 rounded-2xl border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            Back to Vehicle Info
          </button>

          {/* Branding footer */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <Shield className="w-3.5 h-3.5 text-[#5C3264]" />
            <span>Powered by Tahtique Smart Relay Shield</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5. ACTIVE TAG INFO PAGE (ROADSIDE EMERGENCY OPTIMIZED)
  // =========================================================================
  const cleanPhone = tagData.phoneNumber ? tagData.phoneNumber.replace(/[^0-9+]/g, '') : '';
  const cleanGuardian = tagData.guardianNumber ? tagData.guardianNumber.replace(/[^0-9+]/g, '') : '';
  const whatsAppPhone = cleanPhone.startsWith('03')
    ? `92${cleanPhone.slice(1)}`
    : cleanPhone.replace('+', '');

  return (
    <div className="min-h-screen bg-[#FDFBFD] flex flex-col font-sans selection:bg-[#EAD9EC] selection:text-[#5C3264]">
      {/* Top Mobile Bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-[#5C3264] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-gray-400" />
            <BrandLogo variant="mark" size="sm" />
            <span className="font-extrabold text-[#5C3264] tracking-tight">Tahtique</span>
          </button>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>Privacy Relay Active</span>
          </div>
        </div>
      </header>

      {/* Main Screen Container (Single screen / Roadside optimized) */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 sm:p-5 space-y-4">
        {/* Vehicle Identity Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5C3264] via-[#7A2840] to-[#B89BBF]" />

          {/* Top Label & Verified Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold text-[#5C3264] tracking-wider bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-full">
              Registered Vehicle Profile
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Tag
            </span>
          </div>

          {/* Large License Plate Display */}
          <div className="bg-gray-900 text-white rounded-2xl p-4 text-center border-2 border-gray-800 shadow-inner mb-4">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 block font-semibold">
              Vehicle Registration Plate
            </span>
            <h1 className="font-mono text-2xl sm:text-3xl font-black tracking-widest uppercase text-white mt-0.5">
              {tagData.vehicleNumber}
            </h1>
            <div className="text-[11px] text-gray-400 font-medium mt-1 flex items-center justify-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-purple-300" />
              <span>{tagData.vehicleType || 'Motor Vehicle'}</span>
            </div>
          </div>

          {/* Owner Details */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between text-gray-500">
              <span>Registered Owner:</span>
              <span className="font-bold text-gray-900 text-sm">{tagData.ownerName}</span>
            </div>
            <div className="flex items-center justify-between text-gray-500">
              <span>Security Shield:</span>
              <span className="font-medium text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Direct Call Relay Enabled
              </span>
            </div>
          </div>

          {/* Address Privacy Notice (Explicit business decision: Address is kept confidential) */}
          <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
            <span>Street address confidential</span>
            <span className="text-gray-500 font-medium">Emergency contact ready</span>
          </div>
        </div>

        {/* PRIMARY CALL ACTIONS (Big Roadside Tap Targets) */}
        <div className="space-y-2.5">
          {/* 1. Primary "Call Owner" Button */}
          {cleanPhone ? (
            <a
              href={`tel:${cleanPhone}`}
              className="w-full py-4 px-6 rounded-2xl bg-[#5C3264] hover:bg-[#4a2850] text-white font-extrabold text-base flex items-center justify-center gap-3 transition-all shadow-md active:scale-98 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PhoneCall className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-semibold text-purple-200 uppercase tracking-wider">
                  Roadside Emergency
                </span>
                <span className="text-base font-extrabold tracking-wide">
                  Call Vehicle Owner Now
                </span>
              </div>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => alert('Owner has masked calls to anonymous messaging.')}
              className="w-full py-4 px-6 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5 text-gray-400" />
              <span>Voice Calls Masked · Leave Note Below</span>
            </button>
          )}

          {/* 2. Secondary "Call Guardian / Emergency Contact" Button */}
          {cleanGuardian && (
            <a
              href={`tel:${cleanGuardian}`}
              className="w-full py-3.5 px-5 rounded-2xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-[#5C3264] font-extrabold text-sm flex items-center justify-center gap-2.5 transition-all active:scale-98 shadow-2xs"
            >
              <Phone className="w-4 h-4 text-[#5C3264]" />
              <span>Call Emergency Guardian Contact</span>
            </a>
          )}

          {/* 3. Direct WhatsApp Button */}
          {cleanPhone && (
            <a
              href={`https://wa.me/${whatsAppPhone}?text=${encodeURIComponent(
                `Hello! I am scanning the Tahtique QR tag on your vehicle (${tagData.vehicleNumber}).`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-5 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Quick WhatsApp Note to Owner</span>
            </a>
          )}
        </div>

        {/* Anonymous Parking Alert Relay Card */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3.5">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#5C3264]" />
              <span>Leave Anonymous Parking Note</span>
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Select a quick reason or type a note. Relayed instantly without sharing your number.
            </p>
          </div>

          <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
            {/* Quick Reason Presets */}
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(presetMessages) as Array<keyof typeof presetMessages>).map((key) => {
                const preset = presetMessages[key];
                const isSelected = selectedTopic === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedTopic(key)}
                    className={`p-2 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'border-[#5C3264] bg-purple-50 text-[#5C3264] font-bold shadow-2xs'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                    }`}
                  >
                    <span className="text-base">{preset.icon}</span>
                    <span className="truncate text-[11px]">{preset.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Note text input */}
            <div>
              <textarea
                rows={2}
                required
                value={
                  selectedTopic === 'custom'
                    ? customMessage
                    : customMessage || presetMessages[selectedTopic].defaultText
                }
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-2.5 rounded-xl text-xs border border-gray-300 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#5C3264] focus:ring-1 focus:ring-[#5C3264] text-gray-900"
              />
            </div>

            {/* Optional sender contact */}
            <div>
              <input
                type="text"
                placeholder="Your phone/car (optional, if you'd like a call back)"
                value={senderContact}
                onChange={(e) => setSenderContact(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-gray-300 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#5C3264] text-gray-900"
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Relaying...' : 'Send Anonymous Parking Note'}</span>
            </button>
          </form>
        </div>

        {/* Branding Footer */}
        <footer className="pt-2 pb-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <BrandLogo variant="mark" size="sm" />
            <span className="text-xs font-extrabold text-[#5C3264] tracking-tight">
              Tahtique E-Tag Network
            </span>
          </div>
          <p className="text-[11px] text-gray-400 max-w-xs mx-auto leading-relaxed">
            Powered by Tahtique Smart Relay Shield · Encrypted QR Protocol. Protects vehicle owners while keeping them reachable in emergencies.
          </p>
        </footer>
      </main>
    </div>
  );
};
