import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Check, Moon, Sun } from 'lucide-react';

export interface VehicleQRTagProps {
  qrValue?: string;
  plateNumber?: string;
  state?: string;
  showModeSwitcher?: boolean;
  showDownload?: boolean;
  className?: string;
}

export const VehicleQRTag: React.FC<VehicleQRTagProps> = ({
  qrValue = '89640001017048964000101704',
  plateNumber,
  state,
  showModeSwitcher = true,
  showDownload = true,
  className = '',
}) => {
  const [isNightMode, setIsNightMode] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const tagRef = useRef<HTMLDivElement>(null);

  const displayPlate = plateNumber
    ? `${state ? state.toUpperCase() + ' · ' : ''}${plateNumber.toUpperCase()}`
    : null;

  const handleDownloadSVG = () => {
    if (!tagRef.current) return;
    const svgEl = tagRef.current.querySelector('svg');
    if (!svgEl) return;

    // Create printable SVG wrapper
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const bgFill = isNightMode ? '#a3ffcc' : '#ffffff';
    const textColor = isNightMode ? '#052e16' : '#1e293b';

    const fullSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <rect width="300" height="300" rx="32" fill="${bgFill}" stroke="#e2e8f0" stroke-width="2"/>
  <text x="150" y="32" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="600" fill="${textColor}">
    Scan to privately contact vehicle owner
  </text>
  <g transform="translate(75, 52)">
    <rect width="150" height="150" rx="16" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"/>
    <g transform="translate(10, 10)">
      ${svgData.replace(/width="[^"]+"/, 'width="130"').replace(/height="[^"]+"/, 'height="130"')}
    </g>
  </g>
  <text x="150" y="235" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="bold" fill="${textColor}">
    ${displayPlate || 'Get a smart QR tag for your vehicle'}
  </text>
  <text x="150" y="255" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="8.5" fill="${textColor}" opacity="0.8">
    Stick on your windshield. Anyone can reach you for emergencies.
  </text>
  <text x="270" y="288" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="8" font-weight="bold" fill="${textColor}" opacity="0.6">
    ⚡ SMART-TAG
  </text>
</svg>`;

    const blob = new Blob([fullSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TAGTIQUE-${state || 'TAG'}-${plateNumber || 'STICKER'}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className={`flex flex-col items-center gap-3.5 ${className}`}>
      {/* Mode Switcher */}
      {showModeSwitcher && (
        <button
          type="button"
          onClick={() => setIsNightMode(!isNightMode)}
          className="px-4 py-1.5 text-xs font-semibold rounded-full bg-neutral-900 text-white shadow-md hover:bg-black transition-all flex items-center gap-1.5 active:scale-95"
        >
          {isNightMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span>Toggle Daylight (Reflective)</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-emerald-300" />
              <span>Toggle Night (Glow)</span>
            </>
          )}
        </button>
      )}

      {/* 3x3 Card Container */}
      <div
        ref={tagRef}
        className={`w-72 h-72 rounded-[28px] p-5 flex flex-col justify-between items-center text-center transition-all duration-300 relative select-none ${
          isNightMode
            ? 'bg-[#a3ffcc] text-[#052e16] shadow-[0_0_35px_rgba(74,222,128,0.7)] border border-[#86efac]'
            : 'bg-gradient-to-tr from-[#e2e8f0] via-[#fdf4ff] to-[#e0e7ff] text-[#1e293b] shadow-xl border border-white/60'
        }`}
      >
        {/* Top Header */}
        <p className="text-[10.5px] font-medium tracking-tight">
          Scan to privately contact the vehicle owner
        </p>

        {/* Dynamic Scannable QR Code */}
        <div className="bg-white p-2.5 rounded-xl shadow-sm">
          <QRCodeSVG
            value={qrValue}
            size={135}
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Bottom Text Content */}
        <div className="space-y-1">
          <h4 className="text-xs font-bold tracking-tight">
            {displayPlate || 'Get a smart QR tag for your vehicle'}
          </h4>
          <p className="text-[8.5px] leading-snug opacity-80 px-2">
            Stick on your windshield. Anyone can reach you for blocked driveways or emergencies.
          </p>
        </div>

        {/* Tag Footer Logo / Label */}
        <div className="absolute bottom-2.5 right-3 text-[7.5px] font-bold tracking-wider opacity-60 flex items-center gap-0.5">
          <span>⚡</span> SMART-TAG
        </div>
      </div>

      {/* Download SVG Print Asset Button */}
      {showDownload && (
        <button
          type="button"
          onClick={handleDownloadSVG}
          className="w-full max-w-72 py-2 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
        >
          {downloaded ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>SVG Downloaded</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-gray-600" />
              <span>Download Vector Print File (SVG)</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
