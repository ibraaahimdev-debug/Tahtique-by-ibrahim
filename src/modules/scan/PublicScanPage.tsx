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
  Phone,
  PhoneCall,
} from 'lucide-react';
import { orderBackendService, type PublicTagRelayData } from '../../services/orderBackendService';
import { vehicleService } from '../../services/vehicleService';

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
        // 1. Check orderBackendService (Supabase or local tag registry)
        const backendResult = await orderBackendService.lookupTagByToken(qrToken);
        if (backendResult && isMounted) {
          setTagData(backendResult);
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
            maskedName: 'Owner',
            phoneNumber: '',
            guardianNumber: '',
            tagMaterial: 'vinyl',
          });
        }
      } catch (err) {
        console.warn('Token scan resolution warning:', err);
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

  // 1. LOADING STATE
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBFD] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-3 border-[#5C3264] border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-semibold text-gray-700">Verifying secure QR relay token...</p>
      </div>
    );
  }

  // 2. REVOKED / INACTIVE TOKEN STATE
  if (tagData?.status === 'inactive') {
    return (
      <div className="min-h-screen bg-[#FDFBFD] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              This Tag Is Inactive
            </h1>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              The owner or administrator has deactivated this tag in Supabase. Messages to this QR code are suspended.
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-mono text-gray-400">
            Token: {qrToken.slice(0, 10)}... (Inactive)
          </div>

          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full py-3 rounded-full bg-[#5C3264] text-white font-bold text-sm shadow-sm hover:bg-[#4a2850] transition-all cursor-pointer"
          >
            Visit Tagtique Home
          </button>
        </div>
      </div>
    );
  }

  // 3. UNKNOWN / INVALID TOKEN STATE
  if (!tagData || !tagData.isValid) {
    return (
      <div className="min-h-screen bg-[#FDFBFD] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 mx-auto flex items-center justify-center text-gray-500">
            <QrCode className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Tag Not Registered
            </h1>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              This QR code does not correspond to an active registered vehicle record in the Tahtique registry.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full py-3 rounded-full bg-[#5C3264] text-white font-semibold text-sm hover:bg-[#4a2850] transition-all cursor-pointer"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  // 4. SUCCESS RELAY SENT CONFIRMATION
  if (isSent) {
    return (
      <div className="min-h-screen bg-[#FDFBFD] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 mx-auto flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full mb-3">
              Relayed Anonymously
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Notification Sent!
            </h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Your note was relayed to the vehicle owner securely. Your contact information is never disclosed without your consent.
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
              <span className="text-gray-400">Privacy Protection:</span>
              <span className="text-emerald-700 font-semibold">100% Phone Masking Active</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsSent(false);
              setCustomMessage('');
            }}
            className="w-full py-3 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all cursor-pointer"
          >
            Send Another Notice
          </button>
        </div>
      </div>
    );
  }

  // 5. ACTIVE SCAN RELAY INTERFACE
  const cleanPhone = tagData.phoneNumber ? tagData.phoneNumber.replace(/[^0-9+]/g, '') : '';
  const cleanGuardian = tagData.guardianNumber ? tagData.guardianNumber.replace(/[^0-9+]/g, '') : '';

  return (
    <div className="min-h-screen bg-[#FDFBFD] flex flex-col font-sans">
      {/* Top Banner */}
      <header className="bg-white border-b border-gray-200 px-4 py-3.5 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tahtique Relay</span>
          </button>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>Privacy Relay Active</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Vehicle Identity Header Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5C3264] via-[#7A2840] to-[#B89BBF]" />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#5C3264]">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#5C3264] uppercase tracking-wider block">
                  Registered Vehicle
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                  {tagData.vehicleType || 'Protected Vehicle'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Owner: {tagData.maskedName || 'Driver'}
                </p>
              </div>
            </div>

            <div className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 uppercase tracking-wider shadow-2xs">
              {tagData.vehicleNumber}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full Address & Private Data Protected</span>
            </span>
            <span className="text-[11px] text-gray-400">
              Verified E-Tag
            </span>
          </div>
        </div>

        {/* Quick Emergency Calling Actions */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#5C3264]" />
            <span>Direct Emergency Contact</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* Call Owner Button */}
            {tagData.phoneNumber ? (
              <a
                href={`tel:${cleanPhone}`}
                className="py-3 px-4 rounded-2xl bg-[#5C3264] hover:bg-[#4a2850] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Vehicle Owner</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => alert('Owner has masked calls to electronic relay messaging.')}
                className="py-3 px-4 rounded-2xl bg-gray-100 text-gray-600 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-gray-400" />
                <span>Relay Calling Protected</span>
              </button>
            )}

            {/* Call Guardian / Emergency Contact Button */}
            {tagData.guardianNumber ? (
              <a
                href={`tel:${cleanGuardian}`}
                className="py-3 px-4 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#5C3264] font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Phone className="w-4 h-4" />
                <span>Call Guardian Contact</span>
              </a>
            ) : (
              <a
                href={`https://wa.me/923292082080?text=${encodeURIComponent(
                  `Notice for vehicle ${tagData.vehicleNumber}: bystander emergency scan assistance.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Tagtique Dispatch Relay</span>
              </a>
            )}
          </div>
        </div>

        {/* Anonymous Messaging Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#5C3264]" />
              <span>Leave an Anonymous Parking Note</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Select an alert reason or compose a custom note. Your notice is delivered without exposing your personal phone number.
            </p>
          </div>

          <form onSubmit={handleSendMessage} className="space-y-4">
            {/* Reason Presets */}
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(presetMessages) as Array<keyof typeof presetMessages>).map((key) => {
                const preset = presetMessages[key];
                const isSelected = selectedTopic === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedTopic(key)}
                    className={`p-2.5 rounded-2xl border text-left text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'border-[#5C3264] bg-purple-50 text-[#5C3264] font-bold shadow-2xs'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                    }`}
                  >
                    <span className="text-base">{preset.icon}</span>
                    <span className="truncate">{preset.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Note text */}
            <div>
              <textarea
                rows={3}
                required
                value={
                  selectedTopic === 'custom'
                    ? customMessage
                    : customMessage || presetMessages[selectedTopic].defaultText
                }
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-3 rounded-2xl text-xs border border-gray-300 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#5C3264] focus:ring-1 focus:ring-[#5C3264] transition-all text-gray-900"
              />
            </div>

            {/* Optional sender contact */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Your Contact (Optional, for driver callback)
              </label>
              <input
                type="text"
                placeholder="e.g. 0300-1234567 or 'Owner of White Corolla'"
                value={senderContact}
                onChange={(e) => setSenderContact(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-300 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#5C3264] text-gray-900"
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3.5 rounded-full bg-[#5C3264] hover:bg-[#4a2850] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Relaying Message...' : 'Send Anonymous Notice'}</span>
            </button>
          </form>
        </div>

        {/* Security / Privacy Trust Footer */}
        <div className="text-center text-[11px] text-gray-400 py-2 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tahtique Secure Relay Protocol · Powered by Supabase Backend</span>
        </div>
      </main>
    </div>
  );
};
