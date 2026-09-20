import React from 'react';
import { PRICING_PACKAGES } from '../../../data/mockData';
import { TAG_MATERIALS, calculateOrderPricing } from '../../../data/orderData';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Check, Plus, Minus, Star, Layers, Shield, ArrowRight } from 'lucide-react';
import type { OrderFormData } from '../../../types/order';

interface StepChooseProductProps {
  formData: OrderFormData;
  updateFormData: (updates: Partial<OrderFormData>) => void;
  onNext: () => void;
}

export const StepChooseProduct: React.FC<StepChooseProductProps> = ({
  formData,
  updateFormData,
  onNext,
}) => {
  const pricing = calculateOrderPricing(
    formData.packageId,
    formData.materialId,
    formData.quantity
  );

  const handleSelectPackage = (pkgId: string) => {
    const pkg = PRICING_PACKAGES.find((p) => p.id === pkgId);
    const newCount = pkg ? pkg.tagCount : 1;

    // Adjust vehicles array length to match tag count
    const existingVehicles = [...formData.vehicles];
    while (existingVehicles.length < newCount) {
      existingVehicles.push({
        ownerName: '',
        contactNumber: '',
        vehiclePlate: '',
        vehicleModel: '',
      });
    }

    updateFormData({
      packageId: pkgId,
      quantity: newCount,
      vehicles: existingVehicles.slice(0, newCount),
    });
  };

  const handleSelectMaterial = (matId: string) => {
    updateFormData({ materialId: matId });
  };

  const handleAdjustQuantity = (delta: number) => {
    const newQty = Math.max(1, Math.min(10, formData.quantity + delta));

    // Automatically synchronize the packageId
    let newPkgId = formData.packageId;
    if (newQty === 1) {
      newPkgId = 'single-tag';
    } else if (newQty === 2 || newQty === 3) {
      newPkgId = 'pack-of-two';
    } else if (newQty >= 4) {
      newPkgId = 'family-pack';
    }

    const updatedVehicles = [...formData.vehicles];
    while (updatedVehicles.length < newQty) {
      updatedVehicles.push({
        ownerName: '',
        contactNumber: '',
        vehiclePlate: '',
        vehicleModel: '',
      });
    }
    updateFormData({
      packageId: newPkgId,
      quantity: newQty,
      vehicles: updatedVehicles.slice(0, newQty),
    });
  };

  return (
    <div className="space-y-8">
      {/* 1. Package Selection */}
      <div>
        <div className="mb-4">
          <span className="text-xs font-semibold text-[#5C3264] uppercase tracking-wider bg-[#EAD9EC]/60 px-3 py-1 rounded-full">
            Step 1.1
          </span>
          <h3 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A] mt-2">
            Select Your Tag Package
          </h3>
          <p className="text-sm text-[#8A8A8A]">
            Choose how many vehicles you want to protect today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRICING_PACKAGES.map((pkg) => {
            const isSelected = formData.packageId === pkg.id;

            return (
              <div
                key={pkg.id}
                onClick={() => handleSelectPackage(pkg.id)}
                className={`cursor-pointer rounded-2xl p-5 transition-all duration-200 border-2 bg-white relative ${
                  isSelected
                    ? 'border-[#EAD9EC] shadow-md ring-2 ring-[#EAD9EC]/40 bg-[#EAD9EC]/10'
                    : 'border-black/[0.06] hover:border-[#EAD9EC] hover:shadow-sm'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 right-4 bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-white/80">
                    <Star className="w-2.5 h-2.5 fill-current text-[#5C3264]" />
                    <span>Popular</span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-base text-[#1A1A1A]">
                    {pkg.name}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-[#EAD9EC] bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B]'
                        : 'border-black/20 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                    PKR {pkg.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#8A8A8A]">
                    ({pkg.tagCount} {pkg.tagCount === 1 ? 'tag' : 'tags'} • One-time)
                  </span>
                </div>

                <p className="text-xs text-[#8A8A8A] leading-relaxed line-clamp-2">
                  {pkg.tagline}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Tag Type / Material Selector */}
      <div>
        <div className="mb-4">
          <span className="text-xs font-semibold text-[#5C3264] uppercase tracking-wider bg-[#EAD9EC]/60 px-3 py-1 rounded-full">
            Step 1.2
          </span>
          <h3 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A] mt-2">
            Choose Tag Material & Format
          </h3>
          <p className="text-sm text-[#8A8A8A]">
            Select between flexible weatherproof vinyl or the rigid acrylic hard tag.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TAG_MATERIALS.map((mat) => {
            const isSelected = formData.materialId === mat.id;

            return (
              <div
                key={mat.id}
                onClick={() => handleSelectMaterial(mat.id)}
                className={`cursor-pointer rounded-2xl p-5 transition-all duration-200 border-2 bg-white relative ${
                  isSelected
                    ? 'border-[#EAD9EC] shadow-md ring-2 ring-[#EAD9EC]/40 bg-[#EAD9EC]/10'
                    : 'border-black/[0.06] hover:border-[#EAD9EC] hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#EAD9EC]/60 text-[#5C3264] flex items-center justify-center shrink-0">
                      {mat.id === '3m-sticker' ? (
                        <Layers className="w-4 h-4" />
                      ) : (
                        <Shield className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base text-[#1A1A1A]">
                        {mat.name}
                      </h4>
                      <span className="text-[11px] font-semibold text-[#5C3264]">
                        {mat.badge}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-[#EAD9EC] bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B]'
                        : 'border-black/20 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-xs text-[#8A8A8A] leading-relaxed mt-2">
                  {mat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Quantity Stepper */}
      <Card className="!p-5 border border-black/[0.04] bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h4 className="font-semibold text-base text-[#1A1A1A]">
              Total Tags to Print
            </h4>
            <span className="text-xs font-bold text-[#5C3264] bg-[#EAD9EC]/60 px-3 py-0.5 rounded-full border border-[#EAD9EC]">
              PKR {pricing.grandTotal.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Configured for {formData.quantity} vehicle{formData.quantity > 1 ? 's' : ''}. Each tag has its own unique QR identity.
            {pricing.extraTagsCount > 0 && (
              <span className="text-[#5C3264] font-semibold block mt-0.5">
                Includes {pricing.extraTagsCount} extra tag add-on (+PKR {pricing.extraTagsPrice.toLocaleString()})
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#F7EBEF] border border-[#EAD9EC] p-1.5 rounded-full">
          <button
            type="button"
            onClick={() => handleAdjustQuantity(-1)}
            disabled={formData.quantity <= 1}
            className="w-8 h-8 rounded-full bg-white text-[#1A1A1A] flex items-center justify-center shadow-xs hover:bg-[#EAD9EC] hover:text-[#5C3264] transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#1A1A1A] disabled:hover:scale-100 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-bold text-base px-3 text-[#5C3264] min-w-[2rem] text-center">
            {formData.quantity}
          </span>
          <button
            type="button"
            onClick={() => handleAdjustQuantity(1)}
            disabled={formData.quantity >= 10}
            className="w-8 h-8 rounded-full bg-white text-[#1A1A1A] flex items-center justify-center shadow-xs hover:bg-[#EAD9EC] hover:text-[#5C3264] transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#1A1A1A] disabled:hover:scale-100 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </Card>

      {/* Next Step Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onNext}
          icon={<ArrowRight className="w-5 h-5" />}
          className="w-full sm:w-auto shadow-md hover:shadow-xl cursor-pointer"
        >
          Continue to Vehicle Details
        </Button>
      </div>
    </div>
  );
};
