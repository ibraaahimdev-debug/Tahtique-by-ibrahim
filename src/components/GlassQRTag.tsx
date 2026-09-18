import React, { useState, useRef } from 'react';
import { QrCode } from 'lucide-react';
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
  value = 'https://yourwebsite.com/contact/vehicle-123',
  title = 'Scan QR Code',
  subtitle = 'Scan to privately contact the vehicle owner',
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
      {/* Ambient Color Glow Behind Glass to make Transparent Refraction Visible */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        {/* Soft cool lavender-blue aura on the left and upper left */}
        <div className="absolute -top-12 -left-16 w-[380px] h-[380px] rounded-full bg-gradient-to-br from-[#D6E0F5]/60 via-[#EAD9EC]/50 to-[#EBF1FC]/60 blur-[75px] pointer-events-none" />
        
        {/* Soft lavender-blue & lilac aura on the bottom-right (matching left) */}
        <div className="absolute -bottom-14 -right-16 w-[420px] h-[420px] rounded-full bg-gradient-to-tl from-[#D6E0F5]/70 via-[#EBF1FC]/75 to-[#EAD9EC]/60 blur-[85px] pointer-events-none" />
        
        {/* Central luminous pearl halo directly behind QR code */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-white/80 blur-[50px] pointer-events-none" />
      </div>

      {/* 3D FLOATING ASSEMBLY */}
      <div
        className="relative transition-transform duration-300 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? `rotateX(${14 + mouseOffset.y}deg) rotateY(${-14 + mouseOffset.x}deg) rotateZ(1deg) translateY(${mouseOffset.y * 0.25}px)`
            : 'rotateX(12deg) rotateY(-12deg) rotateZ(1deg) translateY(0px)',
          animation: isHovered ? 'none' : 'hero-qr-float 6s ease-in-out infinite',
        }}
      >
        {/* MAIN 3D TRANSPARENT GLASS SLAB */}
        <div
          className="
            relative
            w-full max-w-[380px] sm:max-w-[390px]
            rounded-[34px]
            p-7 sm:p-8
            border border-white/80
            bg-gradient-to-br from-white/[0.22] via-white/[0.14] to-[#D6E0F5]/[0.18]
            backdrop-blur-[24px]
            overflow-hidden
          "
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(0px)',
            boxShadow:
              '0 1px 0 rgba(255,255,255,1), 0 3px 0 rgba(226,232,240,0.7), 0 6px 0 rgba(203,213,225,0.45), 0 9px 1px rgba(148,163,184,0.3), 0 25px 60px -10px rgba(214, 224, 245, 0.45), 0 15px 35px -10px rgba(235, 241, 252, 0.5), inset 0 1.5px 2px 0 rgba(255,255,255,0.95), inset 0 -2px 4px 0 rgba(214, 224, 245, 0.15)',
          }}
        >
          {/* Glass diagonal specular glare sweep */}
          <div
            className="
              absolute
              -top-28
              -left-20
              w-[520px]
              h-[200px]
              rotate-[-22deg]
              bg-gradient-to-b
              from-white/40
              via-white/15
              to-transparent
              blur-xl
              pointer-events-none
            "
          />

          {/* Top glass bevel edge highlight */}
          <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent" />

          {/* 3D CONTENT STACK */}
          <div className="relative z-10" style={{ transformStyle: 'preserve-3d' }}>
            {/* Header */}
            <div
              className="text-center mb-6"
              style={{
                transform: 'translateZ(20px)',
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-white/40 border border-white/60 shadow-xs flex items-center justify-center backdrop-blur-md">
                  <QrCode size={19} strokeWidth={2} className="text-slate-800" />
                </div>
                <h2 className="text-[21px] sm:text-[22px] font-semibold tracking-[-0.02em] text-slate-900">
                  {title}
                </h2>
              </div>
              <p className="text-[12px] sm:text-[13px] text-slate-500 font-medium">
                {subtitle}
              </p>
            </div>

            {/* 3D FROSTED INNER GLASS HOLDER */}
            <div
              className="
                mx-auto
                w-full
                max-w-[300px]
                aspect-square
                flex items-center justify-center
                rounded-[28px]
                border border-white/90
                bg-gradient-to-br from-white/[0.35] via-white/[0.24] to-[#EBF1FC]/[0.30]
                backdrop-blur-[20px]
                p-5 sm:p-6
                transition-all duration-300
              "
              style={{
                transform: 'translateZ(24px)',
                transformStyle: 'preserve-3d',
                boxShadow:
                  '0 12px 30px -6px rgba(214, 224, 245, 0.4), 0 8px 20px -4px rgba(235, 241, 252, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.95), inset 0 -2px 4px rgba(0, 0, 0, 0.03)',
              }}
            >
              {/* WHITE OPTICAL WAFER FOR 100% RELIABLE SCANNING */}
              <div
                className="
                  w-full
                  h-full
                  flex items-center justify-center
                  rounded-[18px]
                  bg-white/95
                  p-3.5
                  border border-white
                "
                style={{
                  transform: 'translateZ(14px)',
                  boxShadow:
                    '0 8px 20px -4px rgba(15, 23, 42, 0.08), inset 0 1px 1px rgba(255, 255, 255, 1)',
                }}
              >
                <QRCodeSVG
                  value={value}
                  size={qrSize}
                  className="w-full h-full max-w-[210px] max-h-[210px]"
                  bgColor="transparent"
                  fgColor="#0F172A"
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>
          </div>

          {/* Bottom glass highlight line with soft lavender-to-sky glow */}
          <div className="absolute bottom-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 via-[#D6E0F5]/80 to-transparent" />
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
