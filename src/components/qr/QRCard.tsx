import React from 'react';

export interface QRCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Premium Frosted Glass Acrylic Container.
 * Designed with Apple-style physical frosted acrylic aesthetic:
 * - 28–36px rounded corners (rounded-[32px])
 * - Semi-transparent white backdrop-blur-xl
 * - Subtle translucent white border
 * - Soft layered diffuse shadow
 * - Gentle upper reflection highlight
 * - Natural hover lift transition
 */
export const QRCard: React.FC<QRCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`relative w-full max-w-[380px] sm:max-w-[400px] mx-auto rounded-[30px] sm:rounded-[34px] p-6 sm:p-7 bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.07),0_10px_20px_-6px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.1),0_12px_24px_-6px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col items-center select-none overflow-hidden ${className}`}
      style={{
        boxShadow:
          '0 20px 50px -12px rgba(15, 23, 42, 0.08), 0 8px 16px -4px rgba(15, 23, 42, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 1px rgba(0, 0, 0, 0.02)',
      }}
    >
      {/* Subtle Upper Reflection / Sheen across the frosted surface */}
      <div
        className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-white/50 via-white/10 to-transparent pointer-events-none rounded-t-[30px] sm:rounded-t-[34px]"
        aria-hidden="true"
      />

      {/* Subtle diagonal ambient light streak */}
      <div
        className="absolute -top-16 -left-16 w-64 h-64 bg-gradient-to-br from-white/30 via-transparent to-transparent rotate-45 pointer-events-none"
        aria-hidden="true"
      />

      {/* Card Content Container */}
      <div className="relative w-full z-10 flex flex-col items-center">
        {children}
      </div>
    </div>
  );
};
