import React, { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Hash, Mail, ArrowRight } from 'lucide-react';

interface TrackingLookupFormProps {
  initialOrderNumber?: string;
  onTrack: (orderNumber: string, contact: string) => void;
  isLoading?: boolean;
}

export const TrackingLookupForm: React.FC<TrackingLookupFormProps> = ({
  initialOrderNumber = '',
  onTrack,
  isLoading = false,
}) => {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [contact, setContact] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    onTrack(orderNumber.trim().toUpperCase(), contact.trim());
  };

  const handleQuickFill = (code: string) => {
    setOrderNumber(code);
    onTrack(code, '');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.05] shadow-sm mb-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#1A1A1A]">
          Track Your Package
        </h3>
        <p className="text-xs sm:text-sm text-[#8A8A8A]">
          Enter your order reference code and the contact number or email used during checkout.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Order Number */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
              Order Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                <Hash className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. TGT-000482"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm uppercase tracking-wider border border-black/10 bg-[#F7EBEF]/30 focus:bg-white focus:outline-none focus:border-[#B89BBF] focus:ring-2 focus:ring-[#EAD9EC]/60"
                required
              />
            </div>
          </div>

          {/* Contact Email or Phone */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
              Email or Phone (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. alex@example.com"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm border border-black/10 bg-[#F7EBEF]/30 focus:bg-white focus:outline-none focus:border-[#B89BBF] focus:ring-2 focus:ring-[#EAD9EC]/60"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Quick Demo Fill Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A8A8A] w-full sm:w-auto">
            <span className="text-[11px] font-medium">Try Demo Orders:</span>
            <button
              type="button"
              onClick={() => handleQuickFill('TGT-000482')}
              className="px-2.5 py-1 rounded-lg bg-[#EAD9EC]/60 text-[#5C3264] font-semibold hover:bg-[#EAD9EC] hover:text-[#1E293B] border border-[#EAD9EC] transition-colors"
            >
              TGT-000482 (Printing)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('TGT-000109')}
              className="px-2.5 py-1 rounded-lg bg-[#EAD9EC]/60 text-[#5C3264] font-semibold hover:bg-[#EAD9EC] hover:text-[#1E293B] border border-[#EAD9EC] transition-colors"
            >
              TGT-000109 (Shipped)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('TGT-000994')}
              className="px-2.5 py-1 rounded-lg bg-[#EAD9EC]/60 text-[#5C3264] font-semibold hover:bg-[#EAD9EC] hover:text-[#1E293B] border border-[#EAD9EC] transition-colors"
            >
              TGT-000994 (Delivered)
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto shrink-0 shadow-md"
          >
            {isLoading ? 'Searching...' : 'Track Order'}
          </Button>
        </div>
      </form>
    </div>
  );
};
