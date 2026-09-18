import React, { useMemo } from 'react';
import QRCode from 'qrcode';

export interface QRRendererProps {
  value: string;
  size?: number;
  className?: string;
  moduleColor?: string;
}

/**
 * Dynamic, 100% standard and scannable QR Code SVG Renderer.
 * Uses QRCode.create to compute the mathematical matrix, then renders
 * clean, crisp SVG rectangles with subtle corner rounding and generous quiet-zone.
 */
export const QRRenderer: React.FC<QRRendererProps> = ({
  value,
  size = 240,
  className = '',
  moduleColor = '#0F172A', // Premium dark charcoal
}) => {
  const qrMatrix = useMemo(() => {
    try {
      // Use Error Correction Level 'M' (standard 15% recovery, optimal for contact URLs)
      const qr = QRCode.create(value || 'https://tagtique.com/contact', {
        errorCorrectionLevel: 'M',
      });
      const matrixSize = qr.modules.size;
      const matrix: boolean[][] = [];

      for (let r = 0; r < matrixSize; r++) {
        const row: boolean[] = [];
        for (let c = 0; c < matrixSize; c++) {
          row.push(Boolean(qr.modules.get(r, c)));
        }
        matrix.push(row);
      }

      return {
        size: matrixSize,
        modules: matrix,
      };
    } catch (err) {
      console.error('Failed to generate QR Code:', err);
      return null;
    }
  }, [value]);

  if (!qrMatrix) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
        QR generation error
      </div>
    );
  }

  // Quiet-zone padding: 2 modules (standard is >= 2 modules for clean boundary isolation)
  const quietZone = 2;
  const viewBoxDim = qrMatrix.size + quietZone * 2;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${viewBoxDim} ${viewBoxDim}`}
        className="w-full h-full"
        shapeRendering="geometricPrecision"
        aria-label="Scannable QR Code"
        role="img"
      >
        {/* Crisp clean quiet zone background */}
        <rect
          x={0}
          y={0}
          width={viewBoxDim}
          height={viewBoxDim}
          fill="#FFFFFF"
          rx={3}
        />

        {/* Dynamic QR Modules */}
        {qrMatrix.modules.map((row, rIdx) =>
          row.map((isDark, cIdx) => {
            if (!isDark) return null;

            return (
              <rect
                key={`${rIdx}-${cIdx}`}
                x={cIdx + quietZone}
                y={rIdx + quietZone}
                width={1}
                height={1}
                rx={0.18} // Subtle organic corner radius that preserves 100% scan reliability
                fill={moduleColor}
              />
            );
          })
        )}
      </svg>
    </div>
  );
};
