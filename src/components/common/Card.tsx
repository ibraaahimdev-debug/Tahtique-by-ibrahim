import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevated?: boolean;
  hoverable?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = false,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-3xl p-6 md:p-8 transition-all duration-300 ${
        elevated
          ? 'shadow-[0_20px_45px_-10px_rgba(234,217,236,0.65),0_4px_12px_-2px_rgba(0,0,0,0.03)] border border-[#EAD9EC]'
          : 'shadow-[0_10px_30px_-5px_rgba(234,217,236,0.25),0_4px_10px_-2px_rgba(0,0,0,0.02)] border border-black/[0.03]'
      } ${
        hoverable
          ? 'hover:-translate-y-1.5 hover:shadow-[0_25px_50px_-12px_rgba(234,217,236,0.8)]'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
