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
  Loader2,
  Lock,
} from 'lucide-react';
import type { OrderFormData } from '../../../types/order';

interface LiveSummaryPanelProps {
  formData: OrderFormData;
  currentStep?: number;
  onNext: () => void;
  isLastStep?: boolean;
  ctaLabel?: string;
  isSubmitting?: boolean;
}

export const LiveSummaryPanel: React.FC<LiveSummaryPanelProps> = ({
  formData,
  onNext,
  ctaLabel = 'Place Order',
  isSubmitting = false,
}) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const pricing = calculateOrderPricing(
    formData.packageId,
    formData.materialId,
    formData.quantity
  );

  const validPlates = formData.vehicles
    .map((v) => v.vehiclePlate)
    .filter((plate) => plate && plate.trim().length > 0);

  return (
    <>
      {/* DESKTOP SIDEBAR (Sticky) */}
      <aside className="hidden lg:block w-80 xl:w-96 shrink-0">
        <div className="sticky top-24 space-y-4">
          <Card className="!p-6 border border-black/[0.06] shadow-lg bg-white rounded-3xl">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#5C3264]" />
                <h3 className="font-bold text-base text-[#1A1A1A]">
                  Order Summary
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Live Total
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
                      (+{pricing.extraTagsCount} extra)
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
                  {formData.quantity} {formData.quantity === 1 ? 'tag' : 'tags'}
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
                  {validPlates.length} of {formData.quantity} configured
                </span>
              </div>

              {validPlates.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {validPlates.map((plate, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-[#EAD9EC]/60 text-[#5C3264] font-semibold text-[11px] uppercase tracking-wider font-mono"
                    >
                      {plate}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-[#8A8A8A] italic">
                  Plate details entered will appear here live.
                </p>
              )}
            </div>

            {/* Delivery Destination Live Preview */}
            {formData.delivery.city && (
              <div className="py-3 border-b border-black/[0.05] text-xs flex items-center justify-between">
                <span className="text-[#8A8A8A]">Destination:</span>
                <span className="font-semibold text-[#1A1A1A] text-right">
                  {formData.delivery.city}
                </span>
              </div>
            )}

            {/* Price Calculations */}
            <div className="py-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#8A8A8A]">
                <span>Base Package:</span>
                <span className="text-[#1A1A1A] font-medium">PKR {pricing.basePackagePrice.toLocaleString()}</span>
              </div>
              {pricing.extraTagsPrice > 0 && (
                <div className="flex items-center justify-between text-[#8A8A8A]">
                  <span>Extra Tags ({pricing.extraTagsCount}x):</span>
                  <span className="text-[#5C3264] font-semibold">+PKR {pricing.extraTagsPrice.toLocaleString()}</span>
                </div>
              )}
              {pricing.materialUpgradeCost > 0 && (
                <div className="flex items-center justify-between text-[#8A8A8A]">
                  <span>Material Upgrade:</span>
                  <span className="text-[#1A1A1A] font-medium">+PKR {pricing.materialUpgradeCost.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-[#8A8A8A]">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#5C3264]" />
                  <span>Doorstep Delivery (Pakistan):</span>
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
                <span className="text-xl xl:text-2xl font-extrabold text-[#5C3264]">
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
              disabled={isSubmitting}
              icon={
                isSubmitting ? (
                  <Loader2 className="w-4 h-4 ml-1.5 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4 ml-1.5 shrink-0" />
                )
              }
              className="mt-3 cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all"
            >
              {isSubmitting ? 'Processing...' : ctaLabel}
            </Button>

            {/* Privacy note */}
            <div className="mt-4 pt-3 border-t border-black/[0.05] flex items-center justify-center gap-1.5 text-[11px] text-[#8A8A8A]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5C3264]" />
              <span>Relay protected & zero recurring fees</span>
            </div>
          </Card>
        </div>
      </aside>

      {/* MOBILE STICKY BOTTOM BAR (Always visible at bottom on mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/[0.08] shadow-[0_-10px_30px_rgba(0,0,0,0.12)]">
        {/* Expandable Drawer Content */}
        {mobileExpanded && (
          <div className="p-4 bg-[#F8FAFC] border-b border-black/[0.06] space-y-2 text-xs animate-in slide-in-from-bottom duration-200">
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
              <span>Courier Delivery:</span>
              <span className="text-emerald-600 font-semibold">FREE (Nationwide)</span>
            </div>
            {validPlates.length > 0 && (
              <div className="pt-2 border-t border-black/[0.06] flex items-center gap-1.5">
                <span className="text-[#8A8A8A]">Plates:</span>
                <span className="font-semibold text-[#5C3264] uppercase font-mono">
                  {validPlates.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Sticky Mobile Bar */}
        <div className="px-4 py-3 flex items-center justify-between gap-3 max-w-lg mx-auto">
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
              <span className="text-base font-extrabold text-[#5C3264]">
                PKR {pricing.grandTotal.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">One-Time</span>
            </div>
          </button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onNext}
            disabled={isSubmitting}
            icon={
              isSubmitting ? (
                <Loader2 className="w-4 h-4 ml-1 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 ml-1 shrink-0" />
              )
            }
            className="!px-6 shrink-0 cursor-pointer shadow-md active:scale-95 transition-all text-xs sm:text-sm font-bold"
          >
            {isSubmitting ? 'Placing...' : ctaLabel}
          </Button>
        </div>
      </div>
    </>
  );
};
