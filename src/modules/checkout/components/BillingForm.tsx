import React from 'react';
import { User, Mail, MapPin, Building } from 'lucide-react';
import type { BillingDetails, DeliveryDetails } from '../../../types/order';

interface BillingFormProps {
  billing: BillingDetails;
  delivery: DeliveryDetails;
  onChange: (billing: BillingDetails) => void;
}

export const BillingForm: React.FC<BillingFormProps> = ({
  billing,
  delivery,
  onChange,
}) => {
  const handleToggleSame = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSame = e.target.checked;
    if (isSame) {
      onChange({
        ...billing,
        sameAsDelivery: true,
        billingName: delivery.fullName,
        billingAddress: delivery.addressLine,
        billingCity: delivery.city,
        billingPostalCode: delivery.postalCode,
      });
    } else {
      onChange({
        ...billing,
        sameAsDelivery: false,
      });
    }
  };

  const handleFieldChange = (field: keyof BillingDetails, value: string | boolean) => {
    onChange({
      ...billing,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-semibold text-[#1A1A1A]">
          Billing Information
        </h4>
        <p className="text-xs text-[#8A8A8A]">
          Receipt and electronic invoice will be sent to this email address.
        </p>
      </div>

      {/* Same as Delivery Checkbox */}
      <label className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#EAD9EC]/40 border border-[#EAD9EC] cursor-pointer select-none">
        <input
          type="checkbox"
          checked={billing.sameAsDelivery}
          onChange={handleToggleSame}
          className="w-4 h-4 rounded accent-[#5C3264]"
        />
        <span className="text-xs font-semibold text-[#1A1A1A]">
          Billing address is the same as delivery shipping address
        </span>
      </label>

      {/* Email Field (Always Required) */}
      <div>
        <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
          Email Address for Order Confirmation & Portal Access *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
            <Mail className="w-4 h-4" />
          </div>
          <input
            type="email"
            placeholder="e.g. driver@example.com"
            value={billing.billingEmail}
            onChange={(e) => handleFieldChange('billingEmail', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm border border-black/10 bg-[#F7EBEF]/30 focus:bg-white focus:outline-none focus:border-[#B89BBF] focus:ring-2 focus:ring-[#EAD9EC]/60"
            required
          />
        </div>
      </div>

      {/* Custom Billing Address if not same as delivery */}
      {!billing.sameAsDelivery && (
        <div className="space-y-4 pt-2 animate-in fade-in duration-200">
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
              Billing Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Name on card"
                value={billing.billingName}
                onChange={(e) => handleFieldChange('billingName', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm border border-black/10 bg-[#F7EBEF]/30 focus:bg-white focus:outline-none focus:border-[#B89BBF] focus:ring-2 focus:ring-[#EAD9EC]/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
              Billing Street Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Street address"
                value={billing.billingAddress}
                onChange={(e) => handleFieldChange('billingAddress', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm border border-black/10 bg-[#F7EBEF]/30 focus:bg-white focus:outline-none focus:border-[#B89BBF] focus:ring-2 focus:ring-[#EAD9EC]/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                City *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                  <Building className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="City"
                  value={billing.billingCity}
                  onChange={(e) => handleFieldChange('billingCity', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm border border-black/10 bg-[#F7EBEF]/30 focus:bg-white focus:outline-none focus:border-[#B89BBF] focus:ring-2 focus:ring-[#EAD9EC]/60"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                Postal Code *
              </label>
              <input
                type="text"
                placeholder="ZIP / Postal"
                value={billing.billingPostalCode}
                onChange={(e) => handleFieldChange('billingPostalCode', e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl text-sm border border-black/10 bg-[#F7EBEF]/30 focus:bg-white focus:outline-none focus:border-[#B89BBF] focus:ring-2 focus:ring-[#EAD9EC]/60"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
