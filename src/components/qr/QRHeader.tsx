import React from 'react';
import { ShieldCheck } from 'lucide-react';

export interface QRHeaderProps {
  tagId?: string;
  vehiclePlate?: string;
  className?: string;
}

/**
 * Minimalist, elegant header for the Glass QR Contact Card.
 * Displays verification status and discreet vehicle tag metadata without exposing personal info.
 */
export const QRHeader: React.FC<QRHeaderProps> = ({
  tagId = 'TGT-4820',
  vehiclePlate,
  className = '',
}) => {
  return (
    <div
      className={`w-full flex items-center justify-between px-1 pb-3 text-slate-500 border-b border-slate-100/80 ${className}`}
    >
      {/* Left: Security Status Badge */}
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-[11px] font-semibold text-slate-700 tracking-tight">
          Private Relay
        </span>
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-100 text-[9px] font-medium text-slate-600">
          <span className="w-1 h-1 rounded-full bg-emerald-500" />
          Active
        </span>
      </div>

      {/* Right: Tag ID or Plate reference */}
      <div className="text-[10px] font-mono font-medium text-slate-400 tracking-wider">
        {vehiclePlate ? vehiclePlate : tagId}
      </div>
    </div>
  );
};
