import React, { useState, useRef } from 'react';
import { QrCode, Shield, PhoneCall } from 'lucide-react';

export interface Hero3DQRProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

// 17x17 Stylized Brand QR Matrix
// 0 = empty/recessed channel
// 1 = Primary Brand Pastel
// 2 = Lavender Highlight (#EBF1FC)
// 3 = Soft Pink Accent Jewel (#FF69B4)
const QR_GRID: number[][] = [
  // 00-06: TL Finder (0..6)         Cols 7-9         TR Finder (10..16)
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 3, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 2, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  // 07-09: Separator & Central Timing Hub
  [0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 2, 1, 0, 1, 2, 1, 1, 3, 1, 1, 2, 1, 1, 2, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  // 10-16: BL Finder (0..6)         Cols 7-10        Alignment (11..15) & Data (16)
  [1, 1, 1, 1, 1, 1, 1, 2, 0, 1, 3, 1, 0, 1, 3, 1, 0],
  [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
  [1, 0, 1, 1, 1, 0, 1, 3, 1, 1, 0, 1, 0, 0, 0, 1, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 3, 0, 1, 0],
  [1, 0, 1, 1, 1, 0, 1, 2, 0, 0, 1, 1, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 1, 2, 1, 1, 0, 1, 1],
];

export const Hero3DQR: React.FC<Hero3DQRProps> = ({
  className = '',
  size = 'lg',
  interactive = true,
}) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth mouse tilt handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x: x * 14, y: -y * 14 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
  };

  const sizeClasses = {
    sm: 'w-[280px] h-[280px]',
    md: 'w-[330px] h-[330px] sm:w-[360px] sm:h-[360px]',
    lg: 'w-[310px] h-[310px] sm:w-[390px] sm:h-[390px] lg:w-[430px] lg:h-[430px]',
  };

  // Helper to check if coordinates fall into one of the 3 corner finder zones
  const isFinderZone = (r: number, c: number) => {
    const isTL = r <= 6 && c <= 6;
    const isTR = r <= 6 && c >= 10;
    const isBL = r >= 10 && c <= 6;
    return isTL || isTR || isBL;
  };

  // Render a unified 7x7 3D Finder Component
  const renderFinder = (gridArea: string, key: string) => (
    <div
      key={key}
      style={{
        gridArea,
        transform: 'translateZ(13px)',
        transformStyle: 'preserve-3d',
      }}
      className="w-full h-full relative"
    >
      {/* Outer 7x7 Extruded Rounded Frame */}
      <div
        className="w-full h-full rounded-[13px] sm:rounded-[16px] bg-gradient-to-br from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] p-[13%] flex items-center justify-center relative select-none"
        style={{
          boxShadow:
            '0 1px 0 #d0bdd3, 0 2px 0 #bfa8c2, 0 3px 0 #ad92b1, 0 4px 0 #987a9c, 0 6px 10px rgba(92,50,100,0.22), inset 0 1.5px 1px rgba(255,255,255,0.75), inset 0 -1px 1px rgba(0,0,0,0.1)',
        }}
      >
        {/* Recessed 5x5 White Moat Channel */}
        <div className="w-full h-full rounded-[7px] sm:rounded-[9px] bg-[#F8FAFD] p-[17%] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)] relative">
          {/* Solid 3x3 Raised Center Core Block */}
          <div
            className="w-full h-full rounded-[5px] sm:rounded-[6px] bg-gradient-to-br from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] flex items-center justify-center relative"
            style={{
              boxShadow:
                '0 1px 0 #d0bdd3, 0 2px 0 #bfa8c2, 0 3px 0 #ad92b1, 0 4px 0 #987a9c, 0 5px 8px rgba(92,50,100,0.25), inset 0 1.5px 1px rgba(255,255,255,0.9)',
              transform: 'translateZ(7px)',
            }}
          >
            {/* Glossy specular dot */}
            <div className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-xs" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* FLOATING 3D ACCENT BADGE 1: Masked Call Relay */}
      <div
        className="absolute -top-4 -right-2 sm:-right-8 z-40 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#EAD9EC] shadow-[0_12px_28px_rgba(234,217,236,0.5)] flex items-center gap-2.5 pointer-events-none transition-transform duration-700 hidden sm:flex"
        style={{
          transform: `translate3d(${mouseOffset.x * 0.7}px, ${-mouseOffset.y * 0.7}px, 55px)`,
          animation: 'hero-float-badge-1 5s ease-in-out infinite',
        }}
      >
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#D6E0F5] to-[#EAD9EC] flex items-center justify-center text-[#5C3264] shadow-xs">
          <PhoneCall className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-gray-800 tracking-tight leading-none">
            100% Masked Calls
          </span>
          <span className="text-[9px] font-bold text-emerald-600 leading-tight mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Carrier-Grade Relay
          </span>
        </div>
      </div>

      {/* FLOATING 3D ACCENT BADGE 2: Weatherproof Rating */}
      <div
        className="absolute -bottom-2 -left-2 sm:-left-8 z-40 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-white shadow-[0_12px_28px_rgba(255,105,180,0.2)] flex items-center gap-2.5 pointer-events-none transition-transform duration-700 hidden sm:flex"
        style={{
          transform: `translate3d(${-mouseOffset.x * 0.6}px, ${mouseOffset.y * 0.6}px, 45px)`,
          animation: 'hero-float-badge-2 6s ease-in-out infinite 0.6s',
        }}
      >
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#FF69B4] to-[#F43F9E] flex items-center justify-center text-white shadow-xs">
          <Shield className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-gray-800 tracking-tight leading-none">
            3M™ Polymer Tag
          </span>
          <span className="text-[9px] font-bold text-gray-500 leading-tight mt-0.5">
            -10°C to +85°C UV Shield
          </span>
        </div>
      </div>

      {/* Main Floating 3D Assembly */}
      <div
        className="relative transition-transform duration-300 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? `rotateX(${16 + mouseOffset.y}deg) rotateY(${-16 + mouseOffset.x}deg) rotateZ(1deg) translateY(${mouseOffset.y * 0.25}px)`
            : 'rotateX(15deg) rotateY(-14deg) rotateZ(1deg) translateY(0px)',
          animation: isHovered ? 'none' : 'hero-qr-float 6s ease-in-out infinite',
        }}
      >
        {/* Sculpted Acrylic Automotive Tag Slab */}
        <div
          className={`${sizeClasses[size]} relative rounded-[36px] sm:rounded-[44px] p-5 sm:p-7 md:p-8 bg-gradient-to-b from-white/98 via-[#F9FBFF]/96 to-[#EDF3FD]/96 border border-white/90 flex flex-col items-center justify-between`}
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(0px)',
            boxShadow:
              '0 1px 0 #ffffff, 0 3px 0 #e2e8f0, 0 6px 0 #cbd5e1, 0 9px 1px #94a3b8, 0 20px 40px -10px rgba(50, 123, 228, 0.32), 0 35px 70px -15px rgba(15, 23, 42, 0.22)',
          }}
        >
          {/* Diagonal Glass Sheen & Glare Overlay */}
          <div className="absolute inset-0 rounded-[36px] sm:rounded-[44px] pointer-events-none overflow-hidden">
            <div className="absolute -top-1/4 -left-1/4 w-[160%] h-[160%] bg-gradient-to-br from-white/50 via-white/10 to-transparent rotate-35 pointer-events-none" />
          </div>

          {/* 4 CNC Precision Metallic Allen Screws */}
          <div className="absolute top-3.5 left-3.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-tr from-[#94A3B8] via-[#E2E8F0] to-white shadow-[0_1px_3px_rgba(0,0,0,0.35)] border border-[#CBD5E1] flex items-center justify-center">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-br from-[#64748B] to-[#94A3B8] shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-gray-200/90 rounded-full rotate-45" />
            </div>
          </div>
          <div className="absolute top-3.5 right-3.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-tr from-[#94A3B8] via-[#E2E8F0] to-white shadow-[0_1px_3px_rgba(0,0,0,0.35)] border border-[#CBD5E1] flex items-center justify-center">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-br from-[#64748B] to-[#94A3B8] shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-gray-200/90 rounded-full -rotate-45" />
            </div>
          </div>
          <div className="absolute bottom-3.5 left-3.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-tr from-[#94A3B8] via-[#E2E8F0] to-white shadow-[0_1px_3px_rgba(0,0,0,0.35)] border border-[#CBD5E1] flex items-center justify-center">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-br from-[#64748B] to-[#94A3B8] shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-gray-200/90 rounded-full -rotate-45" />
            </div>
          </div>
          <div className="absolute bottom-3.5 right-3.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-tr from-[#94A3B8] via-[#E2E8F0] to-white shadow-[0_1px_3px_rgba(0,0,0,0.35)] border border-[#CBD5E1] flex items-center justify-center">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-br from-[#64748B] to-[#94A3B8] shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-gray-200/90 rounded-full rotate-45" />
            </div>
          </div>

          {/* Floating High-Tech Status Badge */}
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-[0_10px_25px_rgba(15,23,42,0.4)] border border-white/25 flex items-center gap-2 select-none"
            style={{
              transform: 'translateX(-50%) translateZ(32px)',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <Shield className="w-3.5 h-3.5 text-[#FF85C0]" />
            <span className="text-white tracking-widest">TAGTIQUE RELAY</span>
            <span className="text-[8px] font-bold text-[#EAD9EC] pl-1.5 border-l border-white/20">
              ACTIVE
            </span>
          </div>

          {/* Sunken Recessed QR Chamber */}
          <div
            className="w-full flex-1 rounded-[22px] sm:rounded-[26px] bg-gradient-to-b from-[#FAFBFD] to-[#EFF5FD] p-2 sm:p-2.5 border border-[#EAD9EC]/60 shadow-[inset_0_2px_6px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(0,0,0,0.08)] relative"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(6px)',
              backgroundImage: 'radial-gradient(#5C3264 0.5px, transparent 0.5px)',
              backgroundSize: '10px 10px',
            }}
          >
            {/* 17x17 CSS Grid */}
            <div
              className="w-full h-full grid grid-cols-[repeat(17,minmax(0,1fr))] grid-rows-[repeat(17,minmax(0,1fr))] gap-[2px] sm:gap-[3px] relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* 3 Unified Corner Finders */}
              {renderFinder('1 / 1 / 8 / 8', 'finder-tl')}
              {renderFinder('1 / 11 / 8 / 18', 'finder-tr')}
              {renderFinder('11 / 1 / 18 / 8', 'finder-bl')}

              {/* Individual Tactile 3D Extruded Data Blocks */}
              {QR_GRID.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                  if (isFinderZone(rIdx, cIdx) || cell === 0) {
                    return null;
                  }

                  let blockStyle = '';
                  let shadowStyle = '';
                  let elevation = 'translateZ(9px)';

                  if (cell === 1) {
                    // Primary Brand Pastel Extruded Voxel Block
                    blockStyle =
                      'bg-gradient-to-br from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] border-t border-l border-white/60';
                    shadowStyle =
                      '0 1px 0 #d0bdd3, 0 2px 0 #bfa8c2, 0 3px 0 #ad92b1, 0 4px 5px rgba(92,50,100,0.2), inset 0 1px 0 rgba(255,255,255,0.65)';
                  } else if (cell === 2) {
                    // Frosted Lavender Highlight Block
                    blockStyle =
                      'bg-gradient-to-br from-[#FFFFFF] via-[#EAD9EC]/60 to-[#D6E0F5]/80 border-t border-l border-white';
                    shadowStyle =
                      '0 1px 0 #e2d2e4, 0 2px 0 #cfbdd2, 0 3px 0 #bfa8c2, 0 4px 5px rgba(234,217,236,0.3), inset 0 1px 0 rgba(255,255,255,0.95)';
                  } else if (cell === 3) {
                    // Pink Ruby / Candy Jewel Block
                    blockStyle =
                      'bg-gradient-to-br from-[#FFE4F2] via-[#FF69B4] to-[#E11D48] border-t border-l border-white/80';
                    shadowStyle =
                      '0 1px 0 #f43f5e, 0 2px 0 #e11d48, 0 3px 0 #be123c, 0 4px 7px rgba(244,63,94,0.45), inset 0 1px 0 rgba(255,255,255,0.85)';
                    elevation = 'translateZ(10px)';
                  }

                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      style={{
                        gridColumn: cIdx + 1,
                        gridRow: rIdx + 1,
                        transform: elevation,
                        transformStyle: 'preserve-3d',
                        boxShadow: shadowStyle,
                      }}
                      className={`w-full h-full rounded-[2.5px] sm:rounded-[3.5px] transition-transform duration-200 ${blockStyle}`}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Bottom Vehicle Plate Laser-Etched Typography */}
          <div
            className="mt-2.5 sm:mt-3 flex items-center justify-between w-full px-1.5 text-[9px] sm:text-[10px] font-bold text-slate-600 select-none"
            style={{ transform: 'translateZ(16px)' }}
          >
            <span className="flex items-center gap-1.5 text-[#5C3264] font-black tracking-wider">
              <QrCode className="w-3.5 h-3.5 text-[#5C3264]" />
              <span>TAGTIQUE SHIELD™</span>
              <span className="px-1.5 py-0.2 rounded bg-[#EAD9EC]/80 text-[7px] sm:text-[8px] font-mono text-[#5C3264] border border-[#EAD9EC]">
                NFC
              </span>
            </span>
            <span className="font-mono text-[8px] sm:text-[9px] text-slate-400 tracking-wider">
              3M™ • UV400+
            </span>
          </div>
        </div>
      </div>

      {/* Realistic Multi-Layer Grounding Ambient Drop Shadow */}
      <div
        className="w-[260px] sm:w-[340px] lg:w-[380px] h-10 sm:h-12 rounded-[100%] bg-gradient-to-r from-[#D6E0F5]/25 via-[#EAD9EC]/35 to-[#F3D6DE]/30 blur-xl pointer-events-none mt-5 transition-all duration-300"
        style={{
          transform: isHovered
            ? `scale(${1 + mouseOffset.y * 0.01}) translateX(${mouseOffset.x * 0.5}px)`
            : 'scale(1)',
          animation: isHovered ? 'none' : 'hero-shadow-pulse 6s ease-in-out infinite',
        }}
      />
    </div>
  );
};
