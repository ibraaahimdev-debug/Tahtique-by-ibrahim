import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'mark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: { mark: 32, text: 'text-lg', sub: 'text-[9px]' },
    md: { mark: 40, text: 'text-xl', sub: 'text-[10px]' },
    lg: { mark: 48, text: 'text-2xl', sub: 'text-[11px]' },
  };

  const currentSize = sizeMap[size];

  // Bespoke Engineered Vector Emblem for TAGTIQUE
  // Geometric shield silhouette with interlocking T-monogram and precision optical aperture
  const emblem = (
    <div
      className="relative shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 duration-200"
      style={{ width: currentSize.mark, height: currentSize.mark }}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          <linearGradient id="tgtShieldBg" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E293B" />
            <stop offset="0.5" stopColor="#331D38" />
            <stop offset="1" stopColor="#5C3264" />
          </linearGradient>
          <linearGradient id="tgtAccent" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EAD9EC" />
            <stop offset="1" stopColor="#D6E0F5" />
          </linearGradient>
          <linearGradient id="tgtBorder" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="1" stopColor="#EAD9EC" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Outer Hex-Shield Body */}
        <path
          d="M24 3L41 10.5V23C41 33.2 33.8 42.4 24 45C14.2 42.4 7 33.2 7 23V10.5L24 3Z"
          fill="url(#tgtShieldBg)"
          stroke="url(#tgtBorder)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Inner Precision Aperture Ring */}
        <path
          d="M24 9L37 15V23C37 31 31.4 38.2 24 40.4C16.6 38.2 11 31 11 23V15L24 9Z"
          fill="black"
          fillOpacity="0.2"
          stroke="white"
          strokeOpacity="0.15"
          strokeWidth="1"
        />

        {/* Stylized Engineered Monogram "T" & QR Optical Aperture */}
        {/* Top Crossbar of T */}
        <rect x="15" y="15" width="18" height="4" rx="1.5" fill="url(#tgtAccent)" />
        {/* Center Vertical Stem */}
        <rect x="22" y="19" width="4" height="15" rx="1" fill="url(#tgtAccent)" />
        
        {/* 4 Optical Corner Anchor Targets (QR & Automotive Sensor Motif) */}
        <rect x="15" y="22" width="3" height="3" rx="0.75" fill="white" fillOpacity="0.85" />
        <rect x="30" y="22" width="3" height="3" rx="0.75" fill="white" fillOpacity="0.85" />
        <rect x="17" y="29" width="2.5" height="2.5" rx="0.5" fill="white" fillOpacity="0.6" />
        <rect x="28.5" y="29" width="2.5" height="2.5" rx="0.5" fill="white" fillOpacity="0.6" />

        {/* Central Luminous Signal Dot */}
        <circle cx="24" cy="21" r="1" fill="#5C3264" />
      </svg>
    </div>
  );

  if (variant === 'mark') {
    return <div className={`inline-flex items-center ${className}`}>{emblem}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {emblem}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className={`font-black ${currentSize.text} tracking-tight text-[#1A1A1A] font-sans leading-none`}>
            TAGTIQUE
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#1A1A1A] text-white uppercase tracking-wider">
            Shield
          </span>
        </div>
        <span className={`${currentSize.sub} font-semibold text-[#8A8A8A] tracking-wider uppercase mt-1 leading-none`}>
          Smart Vehicle Contact
        </span>
      </div>
    </div>
  );
};
