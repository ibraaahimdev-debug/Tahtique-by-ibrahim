import React from 'react';
import type { AdminOrderStatus } from '../../../types/admin';

interface AdminStatusBadgeProps {
  status: AdminOrderStatus;
  className?: string;
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const badgeConfig: Record<AdminOrderStatus, { bg: string; text: string; label: string; dot: string }> = {
    new: {
      bg: 'bg-[#EAD9EC]/50 border-[#EAD9EC]',
      text: 'text-[#5C3264]',
      label: 'New',
      dot: 'bg-[#5C3264]',
    },
    printing: {
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-700',
      label: 'Printing',
      dot: 'bg-amber-500',
    },
    shipped: {
      bg: 'bg-[#D6E0F5]/50 border-[#D6E0F5]',
      text: 'text-[#2C4875]',
      label: 'Shipped',
      dot: 'bg-[#2C4875]',
    },
    delivered: {
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-700',
      label: 'Delivered',
      dot: 'bg-emerald-600',
    },
    cancelled: {
      bg: 'bg-gray-100 border-gray-200',
      text: 'text-gray-600',
      label: 'Cancelled',
      dot: 'bg-gray-400',
    },
  };

  const config = badgeConfig[status] || badgeConfig.new;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
