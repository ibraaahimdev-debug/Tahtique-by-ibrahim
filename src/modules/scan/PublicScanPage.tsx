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
} from 'lucide-react';
import { vehicleService } from '../../services/vehicleService';
import type { PublicVehicleScanData } from '../../types/vehicle';

interface PublicScanPageProps {
  qrToken: string;
  onNavigateHome: () => void;
}

export const PublicScanPage: React.FC<PublicScanPageProps> = ({
  qrToken,
  onNavigateHome,
}) => {
  const [scanData, setScanData] = useState<PublicVehicleScanData | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<
    'lights_on' | 'blocking' | 'alarm' | 'damage' | 'custom'
  >('lights_on');
  const [customMessage, setCustomMessage] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    // Reactive lookup by token only
    const data = vehicleService.lookupByQRToken(qrToken);
    setScanData(data);
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
    }, 600);
  };

  // 1. REVOKED TOKEN STATE
  if (scanData?.isRevoked) {
    return (
      <div className="min-h-screen bg-[#FBF7FA] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              This Tag Is No Longer Active
            </h1>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              The owner or fleet administrator has replaced or decommissioned this physical sticker. Any messages sent to this QR code will not be delivered.
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-mono text-gray-400">
            Token ID: {qrToken.slice(0, 8)}... (Decommissioned)
          </div>

          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            Visit Tagtique Public Portal
          </button>
        </div>
      </div>
    );
  }

  // 2. UNKNOWN / INVALID TOKEN STATE
  if (!scanData?.isValid) {
    return (
      <div className="min-h-screen bg-[#FBF7FA] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 mx-auto flex items-center justify-center text-gray-500">
            <QrCode className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Unassigned Tag
            </h1>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              This QR code does not correspond to an active registered vehicle record in the ParkSafe / Tagtique registry.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full py-3 rounded-full bg-gray-900 text-white font-semibold text-sm hover:bg-black transition-all"
          >
            Go to Tagtique Home
          </button>
        </div>
      </div>
    );
  }

  // 3. SUCCESS RELAY SENT CONFIRMATION
  if (isSent) {
    return (
      <div className="min-h-screen bg-[#FBF7FA] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 mx-auto flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full mb-3">
              Relayed Anonymously
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Message Delivered!
            </h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Your note was relayed to the registered vehicle owner via SMS / push notification through Tagtique’s secure proxy shield.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-left border border-gray-200 text-xs text-gray-600 space-y-1.5">
            <div className="flex justify-between text-gray-400">
              <span>Vehicle Plate:</span>
              <strong className="text-gray-800">{scanData.maskedPlate}</strong>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Relay Topic:</span>
              <span className="font-semibold text-gray-800 capitalize">{selectedTopic.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Privacy Guarantee:</span>
              <span className="text-emerald-700 font-medium">Both identities 100% masked</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsSent(false);
              setCustomMessage('');
            }}
            className="w-full py-3 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all"
          >
            Send Another Note
          </button>
        </div>
      </div>
    );
  }

  // 4. ACTIVE SCAN PAGE: MASKED MESSAGING VIEW
  return (
    <div className="min-h-screen bg-[#FBF7FA] flex flex-col font-sans">
      {/* Top Banner */}
      <header className="bg-white border-b border-gray-200 px-4 py-3.5 sticky top-0 z-20 shadow-xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tagtique</span>
          </button>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>Masked Relay Active</span>
          </div>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Vehicle Identity Header Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE]" />

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#EAD9EC]/40 border border-[#EAD9EC] flex items-center justify-center text-[#5C3264]">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#5C3264] uppercase tracking-wider block">
                  Registered Vehicle
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                  {scanData.vehicleModel || 'ParkSafe Protected Vehicle'}
                </h2>
              </div>
            </div>

            <div className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-mono font-bold text-gray-800 uppercase tracking-wider">
              {scanData.maskedPlate}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Identity & number securely masked</span>
            </span>
            <span className="text-[11px] text-gray-400">
              Verified Tag
            </span>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#5C3264]" />
              <span>Contact Driver / Vehicle Owner</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Select a quick reason below or compose a message. Your note is relayed without exposing your phone number or the owner's details.
            </p>
          </div>

          <form onSubmit={handleSendMessage} className="space-y-4">
            {/* Preset Topic Buttons */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Quick Reason
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(presetMessages) as Array<keyof typeof presetMessages>).map((key) => {
                  const preset = presetMessages[key];
                  const isSelected = selectedTopic === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedTopic(key)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-[#B89BBF] bg-[#EAD9EC]/30 text-[#1E293B] shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                      }`}
                    >
                      <span className="text-base">{preset.icon}</span>
                      <span className="font-semibold">{preset.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Message Content
              </label>
              <textarea
                rows={3}
                required
                value={
                  selectedTopic === 'custom'
                    ? customMessage
                    : customMessage || presetMessages[selectedTopic].defaultText
                }
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full p-3 rounded-2xl text-xs border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#B89BBF] focus:ring-2 focus:ring-[#EAD9EC]/60 transition-all text-gray-900"
              />
            </div>

            {/* Optional Sender Info */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Your Contact (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Phone or 'Driver of Blue Sedan'"
                value={senderContact}
                onChange={(e) => setSenderContact(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#B89BBF] transition-all"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Provide if you would like the driver to be able to text or call you back.
              </span>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Relaying via Tagtique Shield...' : 'Send Anonymous Message'}</span>
            </button>
          </form>
        </div>

        {/* Security / Privacy Trust Footer */}
        <div className="text-center text-[11px] text-gray-400 py-2 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Protected by Tagtique & ParkSafe Encrypted QR Protocol</span>
        </div>
      </main>
    </div>
  );
};
