import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export interface GlassQRTagProps {
  value?: string;
  title?: string;
  subtitle?: string;
  qrSize?: number;
  standalone?: boolean;
  interactive?: boolean;
  className?: string;
}

export const GlassQRTag: React.FC<GlassQRTagProps> = ({
  value = typeof window !== 'undefined' ? `${window.location.origin}/#v/demo` : 'https://tagtique.pk/v/demo',
  title = 'TAGTIQUE SMART SHIELD',
  subtitle = 'Scan with any phone camera to contact vehicle owner',
  qrSize = 200,
  standalone = false,
  interactive = true,
  className = '',
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

  const tagContent = (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* Ambient Lighting Behind Tag */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        <div className="absolute -top-10 -left-10 w-[320px] h-[320px] rounded-full bg-gradient-to-br from-[#D6E0F5]/50 to-[#EAD9EC]/40 blur-[60px] pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-[340px] h-[340px] rounded-full bg-gradient-to-tl from-[#EAD9EC]/50 to-[#D6E0F5]/40 blur-[60px] pointer-events-none" />
      </div>

      {/* 3D FLOATING ASSEMBLY */}
      <div
        className="relative transition-transform duration-300 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? `rotateX(${12 + mouseOffset.y}deg) rotateY(${-12 + mouseOffset.x}deg) rotateZ(1deg) translateY(${mouseOffset.y * 0.25}px)`
            : 'rotateX(10deg) rotateY(-10deg) rotateZ(0.5deg) translateY(0px)',
          animation: isHovered ? 'none' : 'hero-qr-float 6s ease-in-out infinite',
        }}
      >
        {/* MAIN 3D AUTOMOTIVE GLASS / ACRYLIC SLAB */}
        <div
          className="
            relative
            w-full max-w-[360px] sm:max-w-[380px]
            rounded-[32px]
            p-6 sm:p-7
            border border-white/90
            bg-gradient-to-br from-white/[0.85] via-white/[0.65] to-[#F3EDF5]/[0.8]
            backdrop-blur-[24px]
            overflow-hidden
            shadow-[0_20px_50px_-10px_rgba(92,50,100,0.18)]
          "
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(0px)',
          }}
        >
          {/* Subtle Specular Glare Sweep */}
          <div
            className="
              absolute
              -top-24
              -left-20
              w-[500px]
              h-[180px]
              rotate-[-25deg]
              bg-gradient-to-b
              from-white/60
              via-white/20
              to-transparent
              blur-xl
              pointer-events-none
            "
          />

          {/* 3D CONTENT STACK */}
          <div className="relative z-10 space-y-4" style={{ transformStyle: 'preserve-3d' }}>
            {/* Top Specification Banner (Automotive Hardware Marking) */}
            <div
              className="flex items-center justify-between border-b border-black/[0.08] pb-3"
              style={{ transform: 'translateZ(18px)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#1E293B] uppercase">
                  3M™ AUTOMOTIVE GLASS SHIELD
                </span>
              </div>
              <span className="text-[9px] font-mono font-bold text-[#5C3264] bg-[#EAD9EC]/70 px-2 py-0.5 rounded">
                PKR RELAY
              </span>
            </div>

            {/* Inner Tag Header */}
            <div
              className="text-center"
              style={{
                transform: 'translateZ(22px)',
                transformStyle: 'preserve-3d',
              }}
            >
              <h2 className="text-base sm:text-lg font-black tracking-tight text-[#1A1A1A] uppercase">
                {title}
              </h2>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                {subtitle}
              </p>
            </div>

            {/* OPTICAL WAFER FOR 100% RELIABLE SCANNING */}
            <div
              className="
                mx-auto
                w-full
                max-w-[260px]
                aspect-square
                flex flex-col items-center justify-center
                rounded-2xl
                border border-black/[0.08]
                bg-white
                p-4 sm:p-5
                shadow-[0_8px_25px_-6px_rgba(0,0,0,0.12)]
                relative
              "
              style={{
                transform: 'translateZ(26px)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Corner Registration Reticles (Engineering Alignment) */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-[#5C3264]" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-[#5C3264]" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-[#5C3264]" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-[#5C3264]" />

              <QRCodeSVG
                value={value}
                size={qrSize}
                className="w-full h-full max-w-[190px] max-h-[190px]"
                bgColor="transparent"
                fgColor="#0F172A"
                level="H"
                includeMargin={false}
              />
            </div>

            {/* Bottom Hardware Serial Strip */}
            <div
              className="pt-2 border-t border-black/[0.06] flex items-center justify-between text-[10px] text-gray-500 font-mono"
              style={{ transform: 'translateZ(18px)' }}
            >
              <span className="font-bold text-[#5C3264]">ID: TGT-PK-492</span>
              <span>NO APP REQUIRED</span>
              <span className="font-semibold text-emerald-700">AES-256 RELAY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Realistic 3D Grounding Ambient Drop Shadow on Surface */}
      <div
        className="w-[260px] sm:w-[320px] h-8 sm:h-10 rounded-[100%] bg-gradient-to-r from-[#2C4875]/15 via-[#EAD9EC]/30 to-[#2C4875]/15 blur-xl pointer-events-none mt-4 transition-all duration-300"
        style={{
          transform: isHovered
            ? `scale(${1 + mouseOffset.y * 0.01}) translateX(${mouseOffset.x * 0.5}px)`
            : 'scale(1)',
          animation: isHovered ? 'none' : 'hero-shadow-pulse 6s ease-in-out infinite',
        }}
      />
    </div>
  );

  if (standalone) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-[#eef1f4] relative ${className}`}>
        {tagContent}
      </div>
    );
  }

  return tagContent;
};

export default GlassQRTag;
