import React, { useState } from 'react';
import { Button } from '../../../components/common/Button';
import {
  MapPin,
  Building,
  Phone,
  User,
  ArrowRight,
  ArrowLeft,
  Truck,
  AlertCircle,
} from 'lucide-react';
import type { OrderFormData, DeliveryDetails } from '../../../types/order';

interface StepDeliveryDetailsProps {
  formData: OrderFormData;
  updateFormData: (updates: Partial<OrderFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepDeliveryDetails: React.FC<StepDeliveryDetailsProps> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const delivery = formData.delivery;

  const handleFieldChange = (field: keyof DeliveryDetails, value: string) => {
    updateFormData({
      delivery: {
        ...delivery,
        [field]: value,
      },
    });

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

    if (!delivery.fullName.trim()) {
      newErrors.fullName = 'Recipient full name is required';
    }
    if (!delivery.addressLine.trim()) {
      newErrors.addressLine = 'Street address is required';
    }
    if (!delivery.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!delivery.postalCode.trim()) {
      newErrors.postalCode = 'Postal / Zip code is required';
    }
    if (!delivery.deliveryPhone.trim()) {
      newErrors.deliveryPhone = 'Phone number for courier delivery is required';
    } else if (
      !phoneRegex.test(delivery.deliveryPhone.replace(/\s+/g, '')) &&
      delivery.deliveryPhone.replace(/\D/g, '').length < 7
    ) {
      newErrors.deliveryPhone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      // Auto-prefill billing recipient if not filled yet
      if (formData.billing.sameAsDelivery) {
        updateFormData({
          billing: {
            ...formData.billing,
            billingName: delivery.fullName,
            billingAddress: delivery.addressLine,
            billingCity: delivery.city,
            billingPostalCode: delivery.postalCode,
          },
        });
      }
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-[#5C3264] uppercase tracking-wider bg-[#EAD9EC]/60 px-3 py-1 rounded-full">
          Step 03
        </span>
        <h3 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A] mt-2">
          Shipping & Delivery Address
        </h3>
        <p className="text-sm text-[#8A8A8A]">
          Where should we send your physical weatherproof QR stickers?
        </p>
      </div>

      {/* Free Delivery Banner */}
      <div className="p-4 rounded-2xl bg-[#EAD9EC]/40 border border-[#EAD9EC] flex items-center gap-3 text-xs sm:text-sm text-[#5C3264]">
        <Truck className="w-5 h-5 shrink-0" />
        <div>
          <span className="font-semibold">Complimentary Standard Shipping:</span> Delivered in 3–5 business days in protective rigid card mailers.
        </div>
      </div>

      {/* Form Fields Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.05] shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recipient Full Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">
              Recipient Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Alex Henderson"
                value={delivery.fullName}
                onChange={(e) => handleFieldChange('fullName', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm border bg-[#F7EBEF]/30 focus:bg-white transition-all focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-black/10 focus:border-[#B89BBF] focus:ring-[#EAD9EC]/60'
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Street Address */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">
              Street Address & Apartment/Suite *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                value={delivery.addressLine}
                onChange={(e) => handleFieldChange('addressLine', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm border bg-[#F7EBEF]/30 focus:bg-white transition-all focus:outline-none focus:ring-2 ${
                  errors.addressLine
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-black/10 focus:border-[#B89BBF] focus:ring-[#EAD9EC]/60'
                }`}
              />
            </div>
            {errors.addressLine && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.addressLine}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">
              City / Town *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                <Building className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. San Francisco"
                value={delivery.city}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm border bg-[#F7EBEF]/30 focus:bg-white transition-all focus:outline-none focus:ring-2 ${
                  errors.city
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-black/10 focus:border-[#B89BBF] focus:ring-[#EAD9EC]/60'
                }`}
              />
            </div>
            {errors.city && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.city}
              </p>
            )}
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">
              Postal / ZIP Code *
            </label>
            <input
              type="text"
              placeholder="e.g. 94107"
              value={delivery.postalCode}
              onChange={(e) => handleFieldChange('postalCode', e.target.value)}
              className={`w-full px-4 py-3 rounded-2xl text-sm border bg-[#F7EBEF]/30 focus:bg-white transition-all focus:outline-none focus:ring-2 ${
                errors.postalCode
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-black/10 focus:border-[#B89BBF] focus:ring-[#EAD9EC]/60'
              }`}
            />
            {errors.postalCode && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.postalCode}
              </p>
            )}
          </div>

          {/* Phone for Delivery */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">
              Delivery Contact Phone *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                placeholder="e.g. +1 (555) 234-5678"
                value={delivery.deliveryPhone}
                onChange={(e) => handleFieldChange('deliveryPhone', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm border bg-[#F7EBEF]/30 focus:bg-white transition-all focus:outline-none focus:ring-2 ${
                  errors.deliveryPhone
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-black/10 focus:border-[#B89BBF] focus:ring-[#EAD9EC]/60'
                }`}
              />
            </div>
            {errors.deliveryPhone ? (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.deliveryPhone}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-[#8A8A8A]">
                Used by the courier driver strictly for package delivery updates.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          size="md"
          onClick={onBack}
          icon={<ArrowLeft className="w-4 h-4" />}
          iconPosition="left"
        >
          Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleContinue}
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Review Order Summary
        </Button>
      </div>
    </div>
  );
};
