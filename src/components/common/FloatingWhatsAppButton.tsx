import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

export const FloatingWhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const phoneNumber = '0329-2082080';
  const whatsappUrl = 'https://wa.me/923292082080?text=' + encodeURIComponent('Hello Tagtique! I would like to inquire about smart vehicle tags.');

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end select-none font-sans print:hidden">
      {/* Expanded Quick Card */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-white rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.18)] border border-[#EAD9EC] p-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between border-b border-black/[0.06] pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-sm">
                <MessageSquare className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#1A1A1A]">Tagtique WhatsApp</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  <span className="text-[11px] font-semibold text-emerald-700">Online • Dispatch Team</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Close WhatsApp card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            Have questions about placing an order, delivery updates, or vehicle masking? Chat directly with us!
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer active:scale-98"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Chat: {phoneNumber}</span>
          </a>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="relative group">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-xs sm:text-sm shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] transition-all transform hover:scale-[1.03] active:scale-95 border border-white/40 cursor-pointer"
          title="Direct WhatsApp: 0329-2082080"
          aria-label="Direct WhatsApp Contact"
        >
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-5 h-5 fill-current" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-ping" />
            </span>
          </div>
          <span className="tracking-wide">WhatsApp: {phoneNumber}</span>
        </a>

        {/* Small toggle info badge button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-md hover:bg-black transition-colors"
          title="Toggle info"
          aria-label="Toggle details"
        >
          ?
        </button>
      </div>
    </div>
  );
};
