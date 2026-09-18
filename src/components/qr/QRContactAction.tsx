import React from 'react';
import { PhoneCall, ShieldCheck } from 'lucide-react';

export interface QRContactActionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  className?: string;
}

/**
 * QRContactAction component implementing the exact requested parking contact hierarchy:
 * 1. "Scan to Contact"
 * 2. "Need to reach the vehicle owner?"
 * 3. "Send a private notification"
 */
export const QRContactAction: React.FC<QRContactActionProps> = ({
  title = 'Scan to Contact',
  subtitle = 'Need to reach the vehicle owner?',
  description = 'Scan this QR code to securely contact the vehicle owner.',
  actionLabel = 'Send a private notification',
  onActionClick,
  className = '',
}) => {
  return (
    <div className={`w-full flex flex-col items-center text-center space-y-3 pt-4 ${className}`}>
      {/* 1. Primary Title */}
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight leading-tight">
        {title}
      </h3>

      {/* 2. Contextual Subtitle & Description */}
      <div className="space-y-1 max-w-[280px]">
        <p className="text-xs sm:text-sm font-medium text-slate-600">
          {subtitle}
        </p>
        <p className="text-[11px] sm:text-xs text-slate-400 font-normal leading-relaxed">
          {description}
        </p>
      </div>

      {/* 3. Action CTA Button */}
      <div className="w-full pt-1">
        <button
          type="button"
          onClick={onActionClick}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white text-xs sm:text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-slate-400/40"
        >
          <PhoneCall className="w-3.5 h-3.5 text-slate-300" />
          <span>{actionLabel}</span>
        </button>
      </div>

      {/* 4. Subtle Privacy Assurance */}
      <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-normal pt-0.5">
        <ShieldCheck className="w-3 h-3 text-slate-400" />
        <span>Owner's phone number remains 100% private</span>
      </div>
    </div>
  );
};
