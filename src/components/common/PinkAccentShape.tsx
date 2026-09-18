import React from 'react';

interface PinkAccentShapeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export const PinkAccentShape: React.FC<PinkAccentShapeProps> = ({
  className = '',
  size = 'md',
  animated = true,
}) => {
  const sizeClasses = {
    sm: 'w-40 h-40 blur-2xl',
    md: 'w-64 h-64 md:w-80 md:h-80 blur-3xl',
    lg: 'w-80 h-80 md:w-[420px] md:h-[420px] blur-3xl',
    xl: 'w-[360px] h-[360px] md:w-[520px] md:h-[520px] blur-[90px]',
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute select-none rounded-full bg-[#FFD4E9] opacity-70 mix-blend-multiply transition-all duration-700 ${
        sizeClasses[size]
      } ${animated ? 'animate-float-reverse' : ''} ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full fill-[#FFD4E9]"
      >
        <path
          d="M39.9,-65.7C52.6,-58.5,64.6,-49.2,71.5,-36.8C78.4,-24.4,80.2,-8.9,78.2,5.9C76.2,20.7,70.5,34.8,61.4,46.1C52.4,57.3,40,65.8,26.4,70.2C12.8,74.5,-2,74.7,-16.9,71.5C-31.7,68.3,-46.7,61.8,-57.8,51C-68.9,40.1,-76.2,25,-78.3,9C-80.4,-6.9,-77.4,-23.7,-68.8,-36.9C-60.2,-50.1,-46.1,-59.8,-32.3,-66.4C-18.4,-73,-4.8,-76.5,4.3,-83.5C13.4,-90.4,27.2,-72.9,39.9,-65.7Z"
          transform="translate(100 100)"
        />
      </svg>
    </div>
  );
};
