import React from 'react';

interface DecorativeBlobProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export const DecorativeBlob: React.FC<DecorativeBlobProps> = ({
  className = '',
  size = 'md',
  animated = true,
}) => {
  const sizeClasses = {
    sm: 'w-48 h-48 blur-2xl',
    md: 'w-72 h-72 md:w-96 md:h-96 blur-3xl',
    lg: 'w-96 h-96 md:w-[480px] md:h-[480px] blur-3xl',
    xl: 'w-[400px] h-[400px] md:w-[600px] md:h-[600px] blur-[100px]',
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute select-none rounded-full bg-[#EBF1FC] opacity-75 mix-blend-multiply transition-all duration-700 ${
        sizeClasses[size]
      } ${animated ? 'animate-float' : ''} ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full fill-[#EBF1FC]"
      >
        <path
          d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,87.9,-0.8C85.8,14.6,79,29.3,70.2,42.4C61.4,55.5,50.6,67.1,37.3,74.2C24,81.3,8.2,83.9,-7.2,82.4C-22.6,80.9,-37.6,75.3,-50.2,66.8C-62.8,58.3,-73,46.8,-79.8,33.4C-86.6,20,-90,4.7,-87.3,-9.7C-84.6,-24.1,-75.8,-37.6,-64.5,-47.3C-53.2,-57,-39.4,-62.9,-26.1,-70.7C-12.8,-78.5,0,-88.2,14.1,-87.3C28.2,-86.4,30.6,-83.6,44.7,-76.4Z"
          transform="translate(100 100)"
        />
      </svg>
    </div>
  );
};
