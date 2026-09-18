import React from 'react';
import { calculateOrderPricing } from '../../../data/orderData';
import { Button } from '../../../components/common/Button';
import {
  ShieldCheck,
  Edit2,
  Package,
  Car,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import type { OrderFormData } from '../../../types/order';

interface StepOrderConfirmProps {
  formData: OrderFormData;
  onSubmitOrder: (data: OrderFormData) => void;
  onBack: () => void;
  onJumpToStep: (step: number) => void;
}

export const StepOrderConfirm: React.FC<StepOrderConfirmProps> = ({
  formData,
  onSubmitOrder,
  onBack,
  onJumpToStep,
}) => {
  const pricing = calculateOrderPricing(
    formData.packageId,
    formData.materialId,
    formData.quantity
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-[#5C3264] uppercase tracking-wider bg-[#EAD9EC]/60 px-3 py-1 rounded-full">
          Step 04
        </span>
        <h3 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A] mt-2">
          Order Review & Confirmation
        </h3>
        <p className="text-sm text-[#8A8A8A]">
          Please review your configured tag details and delivery address before heading to payment.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Product & Materials Recap */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.05] shadow-sm">
          <div className="flex items-center justify-between border-b border-black/[0.05] pb-4 mb-4">
            <div className="flex items-center gap-2 text-base font-semibold text-[#1A1A1A]">
              <Package className="w-5 h-5 text-[#5C3264]" />
              <span>Selected Product Package</span>
            </div>
            <button
              type="button"
              onClick={() => onJumpToStep(1)}
              className="text-xs font-semibold text-[#5C3264] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-[#8A8A8A]">Package Plan:</span>
              <p className="font-semibold text-[#1A1A1A] mt-0.5">
                {pricing.basePackageName} (PKR {pricing.basePackagePrice.toLocaleString()})
                {pricing.extraTagsCount > 0 && (
                  <span className="text-[#5C3264] text-xs block font-medium">
                    +{pricing.extraTagsCount} Extra Tag{pricing.extraTagsCount > 1 ? 's' : ''} (+PKR {pricing.extraTagsPrice.toLocaleString()})
                  </span>
                )}
              </p>
            </div>
            <div>
              <span className="text-xs text-[#8A8A8A]">Tag Material:</span>
              <p className="font-semibold text-[#1A1A1A] mt-0.5">
                {pricing.materialName} {pricing.materialUpgradeCost > 0 ? `(+PKR ${pricing.materialUpgradeCost.toLocaleString()})` : ''}
              </p>
            </div>
            <div>
              <span className="text-xs text-[#8A8A8A]">Quantity:</span>
              <p className="font-semibold text-[#1A1A1A] mt-0.5">
                {formData.quantity} smart QR sticker{formData.quantity > 1 ? 's' : ''}
              </p>
            </div>
            <div>
              <span className="text-xs text-[#8A8A8A]">Routing Service:</span>
              <p className="font-semibold text-emerald-600 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Lifetime Anonymous Relay (Included)
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Vehicle & QR Encoding Recap */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.05] shadow-sm">
          <div className="flex items-center justify-between border-b border-black/[0.05] pb-4 mb-4">
            <div className="flex items-center gap-2 text-base font-semibold text-[#1A1A1A]">
              <Car className="w-5 h-5 text-[#5C3264]" />
              <span>Configured Vehicle QR Profiles ({formData.vehicles.length})</span>
            </div>
            <button
              type="button"
              onClick={() => onJumpToStep(2)}
              className="text-xs font-semibold text-[#5C3264] hover:underline flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.vehicles.map((v, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[#EAD9EC]/20 border border-[#EAD9EC]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#5C3264] bg-white px-2.5 py-0.5 rounded-full border border-[#EAD9EC]/60">
                      Tag #{i + 1}
                    </span>
                    <span className="font-semibold text-[#1A1A1A] uppercase tracking-wider">
                      {v.vehiclePlate || 'Plate pending'}
                    </span>
                    {v.vehicleModel && (
                      <span className="text-[#8A8A8A]">({v.vehicleModel})</span>
                    )}
                  </div>
                  <p className="text-[#8A8A8A] mt-1">
                    Owner: <span className="text-[#1A1A1A] font-medium">{v.ownerName || '—'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs text-[#5C3264] bg-white px-3 py-1.5 rounded-xl border border-[#EAD9EC] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Masked Relay: {v.contactNumber ? `••• ••• ${v.contactNumber.slice(-4)}` : 'Set'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Delivery Details Recap */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.05] shadow-sm">
          <div className="flex items-center justify-between border-b border-black/[0.05] pb-4 mb-4">
            <div className="flex items-center gap-2 text-base font-semibold text-[#1A1A1A]">
              <MapPin className="w-5 h-5 text-[#5C3264]" />
              <span>Delivery Destination</span>
            </div>
            <button
              type="button"
              onClick={() => onJumpToStep(3)}
              className="text-xs font-semibold text-[#5C3264] hover:underline flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-[#8A8A8A]">Recipient:</span>
              <p className="font-semibold text-[#1A1A1A] mt-0.5">
                {formData.delivery.fullName || '—'}
              </p>
            </div>
            <div>
              <span className="text-xs text-[#8A8A8A]">Courier Phone:</span>
              <p className="font-semibold text-[#1A1A1A] mt-0.5">
                {formData.delivery.deliveryPhone || '—'}
              </p>
            </div>
            <div className="sm:col-span-2">
              <span className="text-xs text-[#8A8A8A]">Shipping Address:</span>
              <p className="font-semibold text-[#1A1A1A] mt-0.5">
                {formData.delivery.addressLine}, {formData.delivery.city} {formData.delivery.postalCode}
              </p>
            </div>
          </div>
        </div>

        {/* Security & Guarantee Note */}
        <div className="p-4 rounded-2xl bg-white border border-[#EAD9EC] shadow-xs flex items-center gap-3 text-xs text-[#8A8A8A]">
          <Lock className="w-5 h-5 text-[#5C3264] shrink-0" />
          <span>
            Your vehicle data is stored with 256-bit encryption. When you click proceed, you will advance to checkout with order state preserved.
          </span>
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
          type="button"
          variant="primary"
          size="lg"
          onClick={() => onSubmitOrder(formData)}
          icon={<ArrowRight className="w-5 h-5" />}
          className="shadow-lg cursor-pointer"
        >
          Proceed to Checkout (PKR {pricing.grandTotal.toLocaleString()})
        </Button>
      </div>
    </div>
  );
};
