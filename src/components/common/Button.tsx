import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'right',
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium font-sans transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#EAD9EC] focus:ring-offset-2';

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs md:text-sm rounded-full gap-1.5',
    md: 'px-6 py-2.5 text-sm md:text-base rounded-full gap-2',
    lg: 'px-8 py-3.5 text-base md:text-lg rounded-full gap-2.5 font-semibold shadow-md',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] font-bold border border-white/80 shadow-[0_4px_16px_rgba(234,217,236,0.65)] hover:shadow-[0_8px_24px_rgba(234,217,236,0.95)] hover:-translate-y-0.5 hover:from-[#C8D6F2] hover:via-[#E2CDE5] hover:to-[#ECC7D2]',
    secondary:
      'bg-[#EAD9EC]/60 text-[#5C3264] hover:bg-[#EAD9EC] font-semibold',
    outline:
      'bg-transparent border-2 border-[#D6E0F5] text-[#2C4875] hover:bg-[#D6E0F5]/30 font-semibold',
    ghost:
      'bg-transparent text-[#1A1A1A] hover:bg-[#EBF1FC] hover:text-[#5C3264]',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
