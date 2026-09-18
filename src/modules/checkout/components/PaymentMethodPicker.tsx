import React from 'react';
import { PAYMENT_METHODS } from '../../../data/orderData';
import { CreditCard, Landmark, Truck, Check, Lock } from 'lucide-react';
import type { PaymentMethodId } from '../../../types/order';

interface PaymentMethodPickerProps {
  selectedMethod: PaymentMethodId;
  onSelect: (method: PaymentMethodId) => void;
}

export const PaymentMethodPicker: React.FC<PaymentMethodPickerProps> = ({
  selectedMethod,
  onSelect,
}) => {
  const getIcon = (id: PaymentMethodId) => {
    switch (id) {
      case 'card':
        return <CreditCard className="w-5 h-5 text-[#5C3264]" />;
      case 'bank_transfer':
        return <Landmark className="w-5 h-5 text-[#5C3264]" />;
      case 'cod':
        return <Truck className="w-5 h-5 text-[#5C3264]" />;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-semibold text-[#1A1A1A]">
          Payment Method
        </h4>
        <p className="text-xs text-[#8A8A8A]">
          Select how you would like to complete your order. All channels are 100% encrypted.
        </p>
      </div>

      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;

          return (
            <div
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`cursor-pointer rounded-2xl p-4 sm:p-5 border-2 transition-all bg-white relative ${
                isSelected
                  ? 'border-[#EAD9EC] shadow-sm ring-2 ring-[#EAD9EC]/40 bg-[#EAD9EC]/10'
                  : 'border-black/[0.06] hover:border-[#EAD9EC]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAD9EC]/60 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(method.id)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm sm:text-base text-[#1A1A1A]">
                        {method.name}
                      </span>
                      {method.badge && (
                        <span className="text-[10px] font-semibold bg-[#EAD9EC]/60 text-[#5C3264] px-2 py-0.5 rounded-full border border-[#EAD9EC]">
                          {method.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8A8A8A] mt-1 leading-relaxed">
                      {method.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                    isSelected
                      ? 'border-[#EAD9EC] bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B]'
                      : 'border-black/20 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              {/* Conditional Mock Form Elements per selection */}
              {isSelected && method.id === 'card' && (
                <div className="mt-4 pt-4 border-t border-black/[0.05] space-y-3 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1">
                        Card Number (Mock Sandbox)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          defaultValue="•••• •••• •••• 4242"
                          disabled
                          className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 text-xs bg-gray-50 text-[#1A1A1A]"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-[#8A8A8A]">
                          <Lock className="w-3.5 h-3.5 text-emerald-500" />
                          <span>TLS 1.3</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        defaultValue="08/29"
                        disabled
                        className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 text-xs bg-gray-50 text-[#1A1A1A]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        defaultValue="891"
                        disabled
                        className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 text-xs bg-gray-50 text-[#1A1A1A]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {isSelected && method.id === 'bank_transfer' && (
                <div className="mt-4 pt-4 border-t border-black/[0.05] p-3 rounded-xl bg-[#EAD9EC]/40 border border-[#EAD9EC] text-xs text-[#5C3264] space-y-1 animate-in fade-in duration-200">
                  <p className="font-semibold">Bank Wire Instructions:</p>
                  <p>Bank: First National Reserve • Routing: 121000358 • Acct: 9948210492</p>
                  <p className="text-[11px] text-[#8A8A8A]">Use your order ID as the transfer memo reference.</p>
                </div>
              )}

              {isSelected && method.id === 'cod' && (
                <div className="mt-4 pt-4 border-t border-black/[0.05] p-3 rounded-xl bg-[#EAD9EC]/40 border border-[#EAD9EC] text-xs text-[#5C3264] space-y-1 animate-in fade-in duration-200">
                  <p className="font-semibold">Cash On Delivery Selected:</p>
                  <p>Please prepare exact cash for the delivery courier upon arrival.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
