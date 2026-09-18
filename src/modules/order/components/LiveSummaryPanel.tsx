import React, { useState } from 'react';
import { calculateOrderPricing } from '../../../data/orderData';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import {
  ShieldCheck,
  Package,
  Car,
  ChevronUp,
  ChevronDown,
  Truck,
  ArrowRight,
} from 'lucide-react';
import type { OrderFormData } from '../../../types/order';

interface LiveSummaryPanelProps {
  formData: OrderFormData;
  currentStep: number;
  onNext: () => void;
  isLastStep?: boolean;
}

export const LiveSummaryPanel: React.FC<LiveSummaryPanelProps> = ({
  formData,
  currentStep,
  onNext,
  isLastStep = false,
}) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const pricing = calculateOrderPricing(
    formData.packageId,
    formData.materialId,
    formData.quantity
  );

  const validPlates = formData.vehicles
    .map((v) => v.vehiclePlate)
    .filter((plate) => plate.trim().length > 0);

  const stepButtonLabels = [
    'Continue to Vehicle Info',
    'Continue to Delivery',
    'Review Order Summary',
    'Proceed to Checkout',
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR (Sticky) */}
      <aside className="hidden lg:block w-80 xl:w-96 shrink-0">
        <div className="sticky top-28 space-y-4">
          <Card className="!p-6 border border-black/[0.05] shadow-lg bg-white">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#5C3264]" />
                <h3 className="font-semibold text-base text-[#1A1A1A]">
                  Live Order Summary
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#5C3264] bg-[#EAD9EC]/60 px-2.5 py-0.5 rounded-full">
                Step {currentStep}/4
              </span>
            </div>

            {/* Selected Package Info */}
            <div className="space-y-3 pb-4 border-b border-black/[0.05] text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8A8A8A]">Selected Plan:</span>
                <span className="font-semibold text-[#1A1A1A]">
                  {pricing.basePackageName}
                  {pricing.extraTagsCount > 0 && (
                    <span className="text-[#5C3264] font-medium ml-1">
                      (+{pricing.extraTagsCount} extra tag{pricing.extraTagsCount > 1 ? 's' : ''})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8A8A8A]">Tag Material:</span>
                <span className="font-semibold text-[#1A1A1A] text-right">
                  {pricing.materialName.split(' ')[0]} {pricing.materialName.split(' ')[1]}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8A8A8A]">Total Quantity:</span>
                <span className="font-semibold text-[#1A1A1A]">
                  {formData.quantity} tag{formData.quantity > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Configured Vehicles Live Preview */}
            <div className="py-3 border-b border-black/[0.05] text-xs space-y-2">
              <div className="flex items-center justify-between text-[#8A8A8A]">
                <span className="flex items-center gap-1">
                  <Car className="w-3.5 h-3.5" />
                  <span>Encoded Plates:</span>
                </span>
                <span className="font-semibold text-[#1A1A1A]">
                  {validPlates.length} of {formData.quantity} set
                </span>
              </div>

              {validPlates.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {validPlates.map((plate, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-[#EAD9EC]/60 text-[#5C3264] font-semibold text-[11px] uppercase tracking-wider"
                    >
                      {plate}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-[#8A8A8A] italic">
                  Plate details entered in Step 2 will appear here live.
                </p>
              )}
            </div>

            {/* Delivery Destination Live Preview */}
            {formData.delivery.city && (
              <div className="py-3 border-b border-black/[0.05] text-xs flex items-center justify-between">
                <span className="text-[#8A8A8A]">Ship To:</span>
                <span className="font-semibold text-[#1A1A1A]">
                  {formData.delivery.city} {formData.delivery.postalCode}
                </span>
              </div>
            )}

            {/* Price Calculations */}
            <div className="py-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#8A8A8A]">
                <span>Base Package Price:</span>
                <span className="text-[#1A1A1A] font-medium">PKR {pricing.basePackagePrice.toLocaleString()}</span>
              </div>
              {pricing.extraTagsPrice > 0 && (
                <div className="flex items-center justify-between text-[#8A8A8A]">
                  <span>Additional Tags ({pricing.extraTagsCount}x @ PKR 1,000):</span>
                  <span className="text-[#5C3264] font-semibold">+PKR {pricing.extraTagsPrice.toLocaleString()}</span>
                </div>
              )}
              {pricing.materialUpgradeCost > 0 && (
                <div className="flex items-center justify-between text-[#8A8A8A]">
                  <span>Material Upgrade ({formData.quantity}x @ PKR 450):</span>
                  <span className="text-[#1A1A1A] font-medium">+PKR {pricing.materialUpgradeCost.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-[#8A8A8A]">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#5C3264]" />
                  <span>Courier Delivery (Pakistan):</span>
                </span>
                <span className="text-emerald-600 font-semibold uppercase text-[11px]">
                  Free
                </span>
              </div>

              <div className="pt-3 border-t border-black/[0.06] flex items-baseline justify-between text-base">
                <div>
                  <span className="font-bold text-[#1A1A1A]">Total Due:</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">One-time payment</span>
                </div>
                <span className="text-xl sm:text-2xl font-extrabold text-[#5C3264]">
                  PKR {pricing.grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Step Action Button */}
            <Button
              type="button"
              variant="primary"
              fullWidth
              size="md"
              onClick={onNext}
              icon={<ArrowRight className="w-4 h-4 ml-1.5 shrink-0" />}
              className="mt-3 cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all"
            >
              {stepButtonLabels[currentStep - 1] || 'Next'}
            </Button>

            {/* Privacy note */}
            <div className="mt-4 pt-3 border-t border-black/[0.05] flex items-center justify-center gap-1.5 text-[11px] text-[#8A8A8A]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5C3264]" />
              <span>Relay protected & zero monthly fees</span>
            </div>
          </Card>
        </div>
      </aside>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-black/[0.08] shadow-[0_-10px_25px_rgba(0,0,0,0.08)]">
        {/* Expandable Drawer Content */}
        {mobileExpanded && (
          <div className="p-4 bg-[#F7EBEF]/60 border-b border-black/[0.05] space-y-2 text-xs animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between text-[#8A8A8A]">
              <span>Plan: {pricing.basePackageName}</span>
              <span className="font-medium text-[#1A1A1A]">PKR {pricing.basePackagePrice.toLocaleString()}</span>
            </div>
            {pricing.extraTagsPrice > 0 && (
              <div className="flex justify-between text-[#8A8A8A]">
                <span>Additional Tags ({pricing.extraTagsCount}x):</span>
                <span className="font-medium text-[#5C3264]">+PKR {pricing.extraTagsPrice.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-[#8A8A8A]">
              <span>Material: {pricing.materialName}</span>
              <span className="font-medium text-[#1A1A1A]">
                {pricing.materialUpgradeCost > 0 ? `+PKR ${pricing.materialUpgradeCost.toLocaleString()}` : 'Included'}
              </span>
            </div>
            <div className="flex justify-between text-[#8A8A8A]">
              <span>Shipping:</span>
              <span className="text-emerald-600 font-semibold">FREE (Pakistan)</span>
            </div>
            {validPlates.length > 0 && (
              <div className="pt-2 border-t border-black/[0.06] flex items-center gap-1">
                <span className="text-[#8A8A8A]">Plates:</span>
                <span className="font-semibold text-[#5C3264] uppercase">
                  {validPlates.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Bar Summary Footer */}
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="flex flex-col text-left focus:outline-none cursor-pointer"
          >
            <div className="flex items-center gap-1 text-[11px] text-[#8A8A8A]">
              <span>{pricing.basePackageName} ({formData.quantity})</span>
              {mobileExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-[#5C3264]">
                PKR {pricing.grandTotal.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">One-Time</span>
            </div>
          </button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onNext}
            icon={<ArrowRight className="w-3.5 h-3.5 ml-1 shrink-0" />}
            className="!px-5 shrink-0 cursor-pointer shadow-md active:scale-95 transition-all"
          >
            {isLastStep ? 'Checkout' : 'Next Step'}
          </Button>
        </div>
      </div>
    </>
  );
};
