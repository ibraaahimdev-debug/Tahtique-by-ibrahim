import React, { useState, useRef } from 'react';
import { Wifi } from 'lucide-react';

interface Glass3DCardPreviewProps {
  cardNumber: string;
  cardHolder: string;
  cardExpiry: string;
}

export const Glass3DCardPreview: React.FC<Glass3DCardPreviewProps> = ({
  cardNumber,
  cardHolder,
  cardExpiry,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotations, setRotations] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt: max 10 degrees tilt for comfortable, natural feel
    const rotateX = -((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 12;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotations({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.35 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotations({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  // Determine card network
  const cleanNum = cardNumber.replace(/\s+/g, '');
  const isVisa = cleanNum.startsWith('4');
  const isMastercard = cleanNum.startsWith('5');

  // Format 16 digits into 4 groups of 4 digits for a single-line embossed view
  const paddedDigits = (cleanNum || '4532892018424242').padEnd(16, '•');
  const g1 = paddedDigits.slice(0, 4);
  const g2 = paddedDigits.slice(4, 8);
  const g3 = paddedDigits.slice(8, 12);
  const g4 = paddedDigits.slice(12, 16);

  const displayName = (cardHolder && cardHolder.trim()) ? cardHolder.trim().toUpperCase() : 'VALUED CUSTOMER';
  const displayExpiry = (cardExpiry && cardExpiry.trim()) ? cardExpiry.trim() : '08/28';

  return (
    <div
      className="w-full max-w-[280px] sm:max-w-[300px] mx-auto select-none py-1"
      style={{ perspective: '1100px' }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full aspect-[1.586/1] rounded-2xl p-3.5 sm:p-4 relative overflow-hidden flex flex-col justify-between cursor-pointer transition-transform duration-150 ease-out"
        style={{
          transform: `rotateX(${rotations.x}deg) rotateY(${rotations.y}deg) scale3d(${
            isHovered ? 1.025 : 1
          }, ${isHovered ? 1.025 : 1}, 1)`,
          transformStyle: 'preserve-3d',
          background:
            'linear-gradient(135deg, rgba(92, 50, 100, 0.92) 0%, rgba(68, 30, 75, 0.95) 50%, rgba(35, 12, 40, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: isHovered
            ? '0 20px 40px -12px rgba(92, 50, 100, 0.55), 0 0 25px rgba(234, 217, 236, 0.25), inset 0 1px 1.5px rgba(255, 255, 255, 0.5)'
            : '0 12px 30px -10px rgba(92, 50, 100, 0.4), 0 0 15px rgba(234, 217, 236, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
        }}
      >
        {/* Ambient Glass Glow Orbs */}
        <div
          className="absolute -top-10 -left-10 w-36 h-36 rounded-full pointer-events-none blur-2xl"
          style={{ background: 'rgba(234, 217, 236, 0.28)' }}
        />
        <div
          className="absolute -bottom-12 -right-10 w-40 h-40 rounded-full pointer-events-none blur-2xl"
          style={{ background: 'rgba(160, 94, 156, 0.32)' }}
        />

        {/* Dynamic Specular Light Glare */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-2xl"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle 200px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.42), transparent 70%)`,
          }}
        />

        {/* Subtle Diagonal Frosted Sheen */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(115deg, transparent 25%, rgba(255, 255, 255, 0.12) 48%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.04) 52%, transparent 75%)',
          }}
        />

        {/* ========================================================================= */}
        {/* ROW 1: Chip, Contactless & Card Network */}
        {/* ========================================================================= */}
        <div
          className="flex items-center justify-between relative z-10"
          style={{ transform: 'translateZ(20px)' }}
        >
          {/* Chip & Wi-Fi */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Metallic Golden Glass Chip */}
            <div className="w-8 h-6 sm:w-8.5 sm:h-6.5 rounded-md bg-gradient-to-br from-[#FFE59E] via-[#F3C562] to-[#C9922C] border border-[#FFF0C2]/80 shadow-[0_2px_6px_rgba(0,0,0,0.3)] relative overflow-hidden flex items-center justify-center p-0.5">
              <div className="w-full h-full border border-amber-900/35 rounded-xs grid grid-cols-2 gap-0.5 opacity-85">
                <div className="border-r border-b border-amber-900/35" />
                <div className="border-b border-amber-900/35" />
                <div className="border-r border-amber-900/35" />
                <div />
              </div>
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent" />
            </div>

            {/* Contactless Wi-Fi Symbol */}
            <div className="text-[#EAD9EC]/85 drop-shadow-xs">
              <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-90 stroke-[2.2]" />
            </div>
          </div>

          {/* Network Brand Badge */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] tracking-wider text-[#EAD9EC]/75 font-semibold font-mono hidden sm:inline-block">
              DEBIT/CREDIT
            </span>

            {isVisa ? (
              <div className="px-2 py-0.5 rounded bg-white/15 backdrop-blur-md border border-white/25 shadow-xs">
                <span className="font-black italic text-[11px] sm:text-xs tracking-wider text-white font-sans">
                  VISA
                </span>
              </div>
            ) : isMastercard ? (
              <div className="flex items-center -space-x-1.5 px-1 py-0.5 rounded bg-white/10 backdrop-blur-md border border-white/20">
                <div className="w-4 h-4 rounded-full bg-red-500/90 shadow-xs" />
                <div className="w-4 h-4 rounded-full bg-amber-400/90 shadow-xs mix-blend-screen" />
              </div>
            ) : (
              <div className="px-2 py-0.5 rounded bg-white/15 backdrop-blur-md border border-white/25 shadow-xs">
                <span className="font-bold text-[10px] tracking-wider text-white font-mono">
                  PAYPAK
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 2: Embossed Number (Strictly Single-Line with 4-Digit Groups) */}
        {/* ========================================================================= */}
        <div
          className="my-auto py-1 relative z-10 w-full"
          style={{ transform: 'translateZ(24px)' }}
        >
          <div className="flex items-center justify-between w-full font-mono text-xs sm:text-[13.5px] font-bold text-white whitespace-nowrap select-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            <span className="tracking-[0.12em]">{g1}</span>
            <span className="tracking-[0.12em]">{g2}</span>
            <span className="tracking-[0.12em]">{g3}</span>
            <span className="tracking-[0.12em]">{g4}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROW 3: Cardholder Name & Expiry Date (Always 100% Visible) */}
        {/* ========================================================================= */}
        <div
          className="flex items-end justify-between relative z-10 w-full pt-1 pb-0.5"
          style={{ transform: 'translateZ(20px)' }}
        >
          {/* Cardholder Name */}
          <div className="flex-1 min-w-0 mr-2 text-left">
            <span className="text-[7.5px] sm:text-[8px] uppercase tracking-widest text-[#EAD9EC]/80 block font-bold leading-none mb-1">
              CARDHOLDER
            </span>
            <span
              className="font-bold uppercase tracking-wider text-white block truncate text-xs sm:text-[13px] leading-tight drop-shadow-sm"
              style={{
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              }}
              title={displayName}
            >
              {displayName}
            </span>
          </div>

          {/* Expiry Date */}
          <div className="text-right shrink-0">
            <span className="text-[7px] sm:text-[7.5px] uppercase tracking-tight text-[#EAD9EC]/75 block leading-none mb-1 font-bold">
              VALID THRU
            </span>
            <span
              className="font-mono font-bold text-xs sm:text-[13px] text-white leading-tight block drop-shadow-sm tracking-wider"
              style={{
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              }}
            >
              {displayExpiry}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
