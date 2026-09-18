import React, { useState } from 'react';
import { Save, Check, Globe, Mail, Phone, MessageCircle, FileText } from 'lucide-react';

export const SettingsGeneralTab: React.FC = () => {
  const [siteName, setSiteName] = useState('TAGTIQUE');
  const [tagline, setTagline] = useState("Your car's contact card — without giving out your number.");
  const [supportEmail, setSupportEmail] = useState('ataitsolutions09@gmail.com');
  const [supportPhone, setSupportPhone] = useState('0329-2082080');
  const [whatsappNumber, setWhatsappNumber] = useState('+92 329 2082080');
  const [currency, setCurrency] = useState('PKR (Rs.)');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Stub: onSave()
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToastMessage('General site settings saved successfully.');
      setTimeout(() => setToastMessage(null), 3500);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div>
        <h3 className="text-base font-semibold text-gray-900">
          General Site Configuration
        </h3>
        <p className="text-xs text-gray-500">
          Customer-facing identity, contact phone numbers, and operational parameters
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5 bg-white p-6 rounded-xl border border-gray-200 shadow-xs text-xs">
        {/* Brand & Tagline */}
        <div className="space-y-4 border-b border-gray-100 pb-5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">
            Brand Identity
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Site & Product Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:border-[#B89BBF]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Base Billing Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:border-[#B89BBF]"
              >
                <option value="PKR (Rs.)">PKR (Rs.) — Pakistani Rupee (Default)</option>
                <option value="USD ($)">USD ($) — United States Dollar</option>
                <option value="GBP (£)">GBP (£) — British Pound</option>
                <option value="EUR (€)">EUR (€) — Euro</option>
                <option value="CAD ($)">CAD ($) — Canadian Dollar</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">
                Public Header Tagline
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FileText className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:border-[#B89BBF]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Customer Support Channels */}
        <div className="space-y-4 border-b border-gray-100 pb-5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">
            Customer Support & Channels
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Public Support Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:border-[#B89BBF]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Toll-Free Phone Line
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:border-[#B89BBF]"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">
                WhatsApp Dispatch Support Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:border-[#B89BBF]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-60 border border-white/80"
          >
            <Save className="w-3.5 h-3.5 text-[#5C3264]" />
            <span>{isSaving ? 'Saving...' : 'Save Site Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
