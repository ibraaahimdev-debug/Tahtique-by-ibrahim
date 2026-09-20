import React, { useState } from 'react';
import { PRICING_PACKAGES } from '../../../data/mockData';
import { TAG_MATERIALS, PAYMENT_METHODS, calculateOrderPricing } from '../../../data/orderData';
import {
  Package,
  Car,
  MapPin,
  CreditCard,
  Check,
  ChevronDown,
  ChevronUp,
  Star,
  ShieldCheck,
  Phone,
  User,
  AlertCircle,
  Copy,
  Plus,
  Minus,
  Truck,
  Landmark,
  ShieldAlert,
  Lock,
} from 'lucide-react';
import type { OrderFormData, VehicleDetails } from '../../../types/order';
import { Glass3DCardPreview } from './Glass3DCardPreview';

interface StreamlinedOrderFormProps {
  formData: OrderFormData;
  updateFormData: (updates: Partial<OrderFormData>) => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const VEHICLE_TYPES = ['Car', 'SUV', 'Motorcycle', 'Commercial'];
const POPULAR_CITIES = ['Islamabad', 'Rawalpindi', 'Lahore', 'Karachi', 'Peshawar', 'Faisalabad'];

export const StreamlinedOrderForm: React.FC<StreamlinedOrderFormProps> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
}) => {
  // Track open/collapsed state of each vehicle accordion (Vehicle 0 open by default)
  const [openVehicleIndices, setOpenVehicleIndices] = useState<number[]>([0]);

  // Card details state (auto-fills demo details when credit option is selected)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4532 8920 1842 4242',
    cardHolder: formData.vehicles[0]?.ownerName || 'Muhammad Ali',
    cardExpiry: '08/28',
    cardCvc: '892',
  });
  const [copiedRaast, setCopiedRaast] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);

  // Sync cardholder name if empty and vehicle 1 owner name changes
  React.useEffect(() => {
    if (formData.vehicles[0]?.ownerName && (!cardDetails.cardHolder || cardDetails.cardHolder === 'Muhammad Ali')) {
      setCardDetails((prev) => ({
        ...prev,
        cardHolder: formData.vehicles[0].ownerName,
      }));
    }
  }, [formData.vehicles[0]?.ownerName]);

  const pricing = calculateOrderPricing(
    formData.packageId,
    formData.materialId,
    formData.quantity
  );

  const toggleVehicleAccordion = (index: number) => {
    setOpenVehicleIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSelectPackage = (pkgId: string) => {
    const pkg = PRICING_PACKAGES.find((p) => p.id === pkgId);
    const newCount = pkg ? pkg.tagCount : 1;

    const existingVehicles = [...formData.vehicles];
    while (existingVehicles.length < newCount) {
      existingVehicles.push({
        ownerName: '',
        contactNumber: '',
        guardianContact: '',
        vehiclePlate: '',
        vehicleModel: '',
        vehicleType: 'Car',
      });
    }

    updateFormData({
      packageId: pkgId,
      quantity: newCount,
      vehicles: existingVehicles.slice(0, newCount),
    });

    // Keep vehicle 0 open
    setOpenVehicleIndices([0]);
  };

  const handleSelectMaterial = (matId: string) => {
    updateFormData({ materialId: matId });
  };

  const handleAdjustQuantity = (delta: number) => {
    const newQty = Math.max(1, Math.min(10, formData.quantity + delta));
    let newPkgId = formData.packageId;
    if (newQty === 1) newPkgId = 'single-tag';
    else if (newQty === 2 || newQty === 3) newPkgId = 'pack-of-two';
    else if (newQty >= 4) newPkgId = 'family-pack';

    const existing = [...formData.vehicles];
    while (existing.length < newQty) {
      existing.push({
        ownerName: '',
        contactNumber: '',
        guardianContact: '',
        vehiclePlate: '',
        vehicleModel: '',
        vehicleType: 'Car',
      });
    }

    updateFormData({
      packageId: newPkgId,
      quantity: newQty,
      vehicles: existing.slice(0, newQty),
    });
  };

  const handleVehicleChange = (
    index: number,
    field: keyof VehicleDetails,
    value: string
  ) => {
    const updated = [...formData.vehicles];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    updateFormData({ vehicles: updated });

    // Clear inline error on change
    const errKey = `veh_${index}_${field}`;
    if (errors[errKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errKey];
        return next;
      });
    }
  };

  const handleCopyFromVehicle1 = (targetIndex: number) => {
    if (targetIndex === 0) return;
    const v1 = formData.vehicles[0];
    const updated = [...formData.vehicles];
    updated[targetIndex] = {
      ...updated[targetIndex],
      ownerName: v1.ownerName,
      contactNumber: v1.contactNumber,
      guardianContact: v1.guardianContact || '',
    };
    updateFormData({ vehicles: updated });

    // Clear related errors
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`veh_${targetIndex}_ownerName`];
      delete next[`veh_${targetIndex}_contactNumber`];
      return next;
    });
  };

  const handleDeliveryChange = (field: string, value: string) => {
    updateFormData({
      delivery: {
        ...formData.delivery,
        [field]: value,
      },
    });

    const errKey = `del_${field}`;
    if (errors[errKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errKey];
        return next;
      });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      {/* ========================================================================= */}
      {/* SECTION 1: TAG PACKAGE & MATERIAL (IN SAME SECTION) */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-black/[0.06] shadow-sm">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#EAD9EC] flex items-center justify-center text-[#5C3264]">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">
              Choose Package & Tag Material
            </h2>
            <p className="text-xs sm:text-sm text-[#8A8A8A]">
              Select vehicle count and physical badge format.
            </p>
          </div>
        </div>

        {/* Package Selector Cards */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRICING_PACKAGES.map((pkg) => {
            const isSelected = formData.packageId === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => handleSelectPackage(pkg.id)}
                className={`cursor-pointer rounded-xl sm:rounded-2xl p-4 transition-all duration-200 border-2 relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#5C3264] bg-[#5C3264]/[0.03] shadow-md ring-2 ring-[#5C3264]/20'
                    : 'border-black/[0.08] hover:border-[#5C3264]/50 bg-white'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-[#5C3264] to-[#7D4687] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    Popular
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm sm:text-base text-[#1A1A1A]">
                      {pkg.name}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-[#5C3264] bg-[#5C3264] text-white'
                          : 'border-[#8A8A8A]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-lg sm:text-xl font-extrabold text-[#1A1A1A]">
                      PKR {pkg.price.toLocaleString()}
                    </span>
                    {pkg.originalPrice && (
                      <span className="text-[11px] text-[#8A8A8A] line-through">
                        PKR {pkg.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#8A8A8A] mt-1 leading-snug">
                    {pkg.tagCount} QR Tag{pkg.tagCount > 1 ? 's' : ''} • One-time fee
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tag Material Options */}
        <div className="mt-5 pt-4 border-t border-black/[0.06]">
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-2 uppercase tracking-wider">
            Tag Material
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TAG_MATERIALS.map((mat) => {
              const isSelected = formData.materialId === mat.id;
              return (
                <div
                  key={mat.id}
                  onClick={() => handleSelectMaterial(mat.id)}
                  className={`cursor-pointer rounded-xl p-3.5 border-2 transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-[#5C3264] bg-[#5C3264]/[0.03] ring-1 ring-[#5C3264]/20'
                      : 'border-black/[0.08] hover:border-[#5C3264]/40 bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs sm:text-sm text-[#1A1A1A]">
                        {mat.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8A8A8A] leading-relaxed">
                      {mat.id === '3m-sticker'
                        ? 'Flexible, weatherproof windshield vinyl (Included).'
                        : '3mm beveled rigid acrylic badge (+PKR 450/tag).'}
                    </p>
                    <span className="inline-block text-[10px] font-semibold text-[#5C3264] bg-[#EAD9EC]/60 px-2 py-0.5 rounded-md">
                      {mat.badge}
                    </span>
                  </div>
                  <div
                    className={`w-4 h-4 mt-0.5 rounded-full border shrink-0 flex items-center justify-center ${
                      isSelected
                        ? 'border-[#5C3264] bg-[#5C3264] text-white'
                        : 'border-[#8A8A8A]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quantity Stepper */}
        <div className="mt-4 pt-3 border-t border-black/[0.06] flex items-center justify-between text-xs">
          <span className="text-[#8A8A8A] font-medium">
            Total Tags to Print ({formData.quantity} {formData.quantity === 1 ? 'vehicle' : 'vehicles'}):
          </span>
          <div className="flex items-center gap-2 bg-[#F8FAFC] border border-black/[0.08] rounded-xl p-1">
            <button
              type="button"
              onClick={() => handleAdjustQuantity(-1)}
              disabled={formData.quantity <= 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-xs text-[#1A1A1A] hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-[#1A1A1A]">
              {formData.quantity}
            </span>
            <button
              type="button"
              onClick={() => handleAdjustQuantity(1)}
              disabled={formData.quantity >= 10}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-xs text-[#1A1A1A] hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: PER-VEHICLE FORM (REPEAT / COLLAPSIBLE PER TAG) */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-black/[0.06] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EAD9EC] flex items-center justify-center text-[#5C3264]">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">
                Vehicle & Contact Details
              </h2>
              <p className="text-xs sm:text-sm text-[#8A8A8A]">
                License plate, driver contact & emergency guardian number.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-xs font-semibold text-[#5C3264] bg-[#EAD9EC]/60 px-2.5 py-1 rounded-full">
            {formData.vehicles.length} {formData.vehicles.length === 1 ? 'Vehicle' : 'Vehicles'}
          </span>
        </div>

        {/* Vehicles list */}
        <div className="space-y-3 mt-4">
          {formData.vehicles.map((vehicle, idx) => {
            const isOpen = openVehicleIndices.includes(idx);
            const isCompleted =
              vehicle.ownerName.trim() &&
              vehicle.contactNumber.trim() &&
              vehicle.vehiclePlate.trim();

            const hasError =
              errors[`veh_${idx}_ownerName`] ||
              errors[`veh_${idx}_contactNumber`] ||
              errors[`veh_${idx}_vehiclePlate`];

            return (
              <div
                key={idx}
                id={`vehicle-card-${idx}`}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  hasError
                    ? 'border-red-400 bg-red-50/20'
                    : isOpen
                    ? 'border-[#5C3264]/40 bg-[#FAFAFA]'
                    : 'border-black/[0.08] bg-white hover:border-[#5C3264]/30'
                }`}
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleVehicleAccordion(idx)}
                  className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-[#EAD9EC] text-[#5C3264]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-[#1A1A1A]">
                          Vehicle {idx + 1}
                          {vehicle.vehiclePlate && (
                            <span className="ml-1 text-[#5C3264] uppercase font-mono">
                              ({vehicle.vehiclePlate})
                            </span>
                          )}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" />
                            Ready
                          </span>
                        )}
                        {hasError && (
                          <span className="text-[10px] font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" />
                            Incomplete
                          </span>
                        )}
                      </div>
                      {!isOpen && vehicle.ownerName && (
                        <p className="text-[11px] text-[#8A8A8A] mt-0.5">
                          {vehicle.ownerName} • {vehicle.contactNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {idx > 0 && isOpen && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyFromVehicle1(idx);
                        }}
                        className="text-[11px] font-semibold text-[#5C3264] hover:bg-[#EAD9EC]/60 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy from #1</span>
                      </button>
                    )}
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#8A8A8A]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#8A8A8A]" />
                    )}
                  </div>
                </div>

                {/* Accordion Body */}
                {isOpen && (
                  <div className="px-3.5 pb-4 sm:px-5 sm:pb-5 pt-1 space-y-3.5 border-t border-black/[0.05] bg-white">
                    {/* Fast Copy Banner if Vehicle > 1 */}
                    {idx > 0 && !vehicle.ownerName && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#EAD9EC]/30 border border-[#EAD9EC] text-xs">
                        <span className="text-[#5C3264] font-medium">
                          Same owner as Vehicle 1?
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyFromVehicle1(idx)}
                          className="bg-[#5C3264] text-white px-2.5 py-1 rounded-lg font-semibold hover:bg-[#4A2851] transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Prefill Contact</span>
                        </button>
                      </div>
                    )}

                    {/* 1. Vehicle Number / Plate */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                        Vehicle Number (License Plate) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ICT-LE-1234 or LEA-20-456"
                        value={vehicle.vehiclePlate}
                        onChange={(e) =>
                          handleVehicleChange(idx, 'vehiclePlate', e.target.value.toUpperCase())
                        }
                        className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border font-mono uppercase transition-colors outline-none focus:ring-2 focus:ring-[#5C3264]/20 ${
                          errors[`veh_${idx}_vehiclePlate`]
                            ? 'border-red-500 bg-red-50/20'
                            : 'border-black/[0.12] focus:border-[#5C3264]'
                        }`}
                      />
                      {errors[`veh_${idx}_vehiclePlate`] && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors[`veh_${idx}_vehiclePlate`]}</span>
                        </p>
                      )}
                    </div>

                    {/* 2. Vehicle Type Selection Pills */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                        Vehicle Type
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {VEHICLE_TYPES.map((type) => {
                          const isTypeSelected = (vehicle.vehicleType || 'Car') === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => handleVehicleChange(idx, 'vehicleType', type)}
                              className={`py-2 px-2.5 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                                isTypeSelected
                                  ? 'border-[#5C3264] bg-[#5C3264] text-white shadow-xs'
                                  : 'border-black/[0.1] bg-white text-[#1A1A1A] hover:border-black/30'
                              }`}
                            >
                              {type}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Owner Name */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                        Owner / Vehicle Owner Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3" />
                        <input
                          type="text"
                          placeholder="e.g. Ali Khan"
                          value={vehicle.ownerName}
                          onChange={(e) =>
                            handleVehicleChange(idx, 'ownerName', e.target.value)
                          }
                          className={`w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border transition-colors outline-none focus:ring-2 focus:ring-[#5C3264]/20 ${
                            errors[`veh_${idx}_ownerName`]
                              ? 'border-red-500 bg-red-50/20'
                              : 'border-black/[0.12] focus:border-[#5C3264]'
                          }`}
                        />
                      </div>
                      {errors[`veh_${idx}_ownerName`] && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors[`veh_${idx}_ownerName`]}</span>
                        </p>
                      )}
                    </div>

                    {/* 4. Phone Number */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3" />
                        <input
                          type="tel"
                          placeholder="e.g. 0300 1234567"
                          value={vehicle.contactNumber}
                          onChange={(e) =>
                            handleVehicleChange(idx, 'contactNumber', e.target.value)
                          }
                          className={`w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border transition-colors outline-none focus:ring-2 focus:ring-[#5C3264]/20 ${
                            errors[`veh_${idx}_contactNumber`]
                              ? 'border-red-500 bg-red-50/20'
                              : 'border-black/[0.12] focus:border-[#5C3264]'
                          }`}
                        />
                      </div>
                      {errors[`veh_${idx}_contactNumber`] && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors[`veh_${idx}_contactNumber`]}</span>
                        </p>
                      )}
                      <p className="text-[10px] text-[#8A8A8A] mt-1">
                        Number is masked for 100% privacy when people scan the tag.
                      </p>
                    </div>

                    {/* 5. Guardian / Emergency Contact */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-[#1A1A1A]">
                          Guardian / Emergency Contact Number
                        </label>
                        <span className="text-[10px] font-medium text-[#8A8A8A]">
                          Optional Backup
                        </span>
                      </div>
                      <div className="relative">
                        <ShieldAlert className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3" />
                        <input
                          type="tel"
                          placeholder="e.g. 0301 9876543"
                          value={vehicle.guardianContact || ''}
                          onChange={(e) =>
                            handleVehicleChange(idx, 'guardianContact', e.target.value)
                          }
                          className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-black/[0.12] focus:border-[#5C3264] transition-colors outline-none focus:ring-2 focus:ring-[#5C3264]/20"
                        />
                      </div>
                      <p className="text-[10px] text-[#8A8A8A] mt-1">
                        Emergency backup number alerted if vehicle is in an urgent situation.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: DELIVERY ADDRESS + CITY (INLINE, NOT A SEPARATE STEP) */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-black/[0.06] shadow-sm">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#EAD9EC] flex items-center justify-center text-[#5C3264]">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">
              Delivery Address & City
            </h2>
            <p className="text-xs sm:text-sm text-[#8A8A8A]">
              Free doorstep express delivery anywhere in Pakistan.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3.5">
          {/* Street Address */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Delivery Address (Street / House / Area) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. House 42, Street 7, Sector F-8/1"
              value={formData.delivery.addressLine}
              onChange={(e) => handleDeliveryChange('addressLine', e.target.value)}
              className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border transition-colors outline-none focus:ring-2 focus:ring-[#5C3264]/20 ${
                errors.del_addressLine
                  ? 'border-red-500 bg-red-50/20'
                  : 'border-black/[0.12] focus:border-[#5C3264]'
              }`}
            />
            {errors.del_addressLine && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.del_addressLine}</span>
              </p>
            )}
          </div>

          {/* City Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your city name"
              value={formData.delivery.city}
              onChange={(e) => handleDeliveryChange('city', e.target.value)}
              className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border transition-colors outline-none focus:ring-2 focus:ring-[#5C3264]/20 ${
                errors.del_city
                  ? 'border-red-500 bg-red-50/20'
                  : 'border-black/[0.12] focus:border-[#5C3264]'
              }`}
            />
            {errors.del_city && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.del_city}</span>
              </p>
            )}

            {/* Quick City Chips */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-[11px] text-[#8A8A8A] self-center mr-1">Popular:</span>
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleDeliveryChange('city', city)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    formData.delivery.city.toLowerCase() === city.toLowerCase()
                      ? 'border-[#5C3264] bg-[#5C3264] text-white font-semibold'
                      : 'border-black/[0.08] bg-[#F8FAFC] text-[#1A1A1A] hover:bg-[#EAD9EC]/40'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: PAYMENT METHOD (INLINE ON PAGE 1) */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-black/[0.06] shadow-sm">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#EAD9EC] flex items-center justify-center text-[#5C3264]">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">
              Payment Method
            </h2>
            <p className="text-xs sm:text-sm text-[#8A8A8A]">
              Choose payment preference. Cash on Delivery is pre-selected for fastest checkout.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PAYMENT_METHODS.map((method) => {
            const isSelected = formData.paymentMethod === method.id;
            return (
              <div
                key={method.id}
                onClick={() => updateFormData({ paymentMethod: method.id })}
                className={`cursor-pointer rounded-xl sm:rounded-2xl p-4 border-2 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#5C3264] bg-[#5C3264]/[0.03] ring-1 ring-[#5C3264]/20 shadow-xs'
                    : 'border-black/[0.08] hover:border-[#5C3264]/40 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {method.id === 'cod' && <Truck className="w-4 h-4 text-[#5C3264]" />}
                      {method.id === 'bank_transfer' && <Landmark className="w-4 h-4 text-[#5C3264]" />}
                      {method.id === 'card' && <CreditCard className="w-4 h-4 text-[#5C3264]" />}
                      <span className="font-bold text-xs sm:text-sm text-[#1A1A1A]">
                        {method.name.split('(')[0]}
                      </span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-[#5C3264] bg-[#5C3264] text-white'
                          : 'border-[#8A8A8A]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8A8A8A] leading-tight">
                    {method.description}
                  </p>
                </div>
                {method.badge && (
                  <span className="mt-3 inline-block text-[10px] font-semibold text-[#5C3264] bg-[#EAD9EC]/60 px-2 py-0.5 rounded-md w-fit">
                    {method.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Automatic Card Fill Details Form (Shows when Credit / Debit Card is selected) */}
        {formData.paymentMethod === 'card' && (
          <div className="mt-5 pt-5 border-t border-black/[0.08] animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#5C3264]" />
                  <span>Card Payment Details</span>
                </h3>
                <p className="text-[11px] text-[#8A8A8A]">
                  Pre-filled with demo card for quick testing. You can edit any field.
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() =>
                    setCardDetails({
                      cardNumber: '4532 8920 1842 4242',
                      cardHolder: formData.vehicles[0]?.ownerName || 'Muhammad Ali',
                      cardExpiry: '08/28',
                      cardCvc: '892',
                    })
                  }
                  className="text-[11px] font-semibold text-[#5C3264] bg-[#EAD9EC]/60 hover:bg-[#EAD9EC] px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <CreditCard className="w-3 h-3 text-[#5C3264]" />
                  <span>Auto-Fill Demo Card</span>
                </button>
              </div>
            </div>

            {/* Virtual Card & Inputs Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* 3D Glass Credit Card Preview (Website Colour Theme & Interactive Tilt) */}
              <div className="md:col-span-5 w-full">
                <Glass3DCardPreview
                  cardNumber={cardDetails.cardNumber}
                  cardHolder={cardDetails.cardHolder}
                  cardExpiry={cardDetails.cardExpiry}
                />
              </div>

              {/* Card Inputs */}
              <div className="md:col-span-7 space-y-3">
                {/* Card Number Input */}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="4532 8920 1842 4242"
                      value={cardDetails.cardNumber}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                        const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
                        setCardDetails({ ...cardDetails, cardNumber: formatted });
                      }}
                      maxLength={19}
                      className="w-full text-xs sm:text-sm pl-9 pr-24 py-2.5 rounded-xl border border-black/[0.12] font-mono tracking-wider focus:border-[#5C3264] transition-colors outline-none focus:ring-2 focus:ring-[#5C3264]/20 bg-white"
                    />
                    <div className="absolute right-3 top-2.5 flex items-center gap-1 text-[10px] font-bold text-[#5C3264] bg-[#EAD9EC]/60 px-2 py-0.5 rounded-md">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>256-Bit</span>
                    </div>
                  </div>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Cardholder Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Muhammad Ali"
                      value={cardDetails.cardHolder}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cardHolder: e.target.value })
                      }
                      className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-black/[0.12] focus:border-[#5C3264] transition-colors outline-none focus:ring-2 focus:ring-[#5C3264]/20 bg-white"
                    />
                  </div>
                </div>

                {/* Expiry & CVC */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      placeholder="08/28"
                      value={cardDetails.cardExpiry}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                        const formatted = digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
                        setCardDetails({ ...cardDetails, cardExpiry: formatted });
                      }}
                      maxLength={5}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-black/[0.12] font-mono text-center focus:border-[#5C3264] transition-colors outline-none focus:ring-2 focus:ring-[#5C3264]/20 bg-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-[#1A1A1A]">CVC / CVV</label>
                      <span className="text-[10px] text-[#8A8A8A]">3 digits</span>
                    </div>
                    <input
                      type="password"
                      placeholder="892"
                      value={cardDetails.cardCvc}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setCardDetails({ ...cardDetails, cardCvc: digits });
                      }}
                      maxLength={4}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-black/[0.12] font-mono text-center tracking-widest focus:border-[#5C3264] transition-colors outline-none focus:ring-2 focus:ring-[#5C3264]/20 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bank Transfer / Raast Details */}
        {formData.paymentMethod === 'bank_transfer' && (
          <div className="mt-5 pt-5 border-t border-black/[0.08] animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
            <div className="p-4 rounded-2xl bg-[#EAD9EC]/30 border border-[#EAD9EC] text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#5C3264] flex items-center gap-1.5 text-xs sm:text-sm">
                  <Landmark className="w-4 h-4" /> Direct Raast / Bank Account Details
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Zero Transfer Fees
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-black/[0.06]">
                <div className="bg-white p-2.5 rounded-xl border border-black/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#8A8A8A] block">Raast ID (Instant Transfer):</span>
                    <span className="font-mono font-bold text-[#5C3264] text-xs">tagtique@mcb</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('tagtique@mcb');
                      setCopiedRaast(true);
                      setTimeout(() => setCopiedRaast(false), 2000);
                    }}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#EAD9EC] text-[#5C3264] transition-colors cursor-pointer"
                    title="Copy Raast ID"
                  >
                    {copiedRaast ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-black/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#8A8A8A] block">IBAN (Meezan Bank Ltd):</span>
                    <span className="font-mono font-bold text-[#1A1A1A] text-xs">PK36MEZN0001234567890123</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('PK36MEZN0001234567890123');
                      setCopiedIban(true);
                      setTimeout(() => setCopiedIban(false), 2000);
                    }}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#EAD9EC] text-[#5C3264] transition-colors cursor-pointer"
                    title="Copy IBAN"
                  >
                    {copiedIban ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-[#8A8A8A] pt-1">
                Account Title: <strong>Tagtique Technologies (Pvt) Ltd</strong> • Please use your vehicle plate or Order ID as reference.
              </p>
            </div>
          </div>
        )}

        {/* Informational callout based on selected method */}
        <div className="mt-4 p-3 rounded-xl bg-[#F8FAFC] border border-black/[0.06] text-xs text-[#8A8A8A] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          {formData.paymentMethod === 'cod' && (
            <span>
              <strong>Zero Prepayment Required:</strong> Pay PKR {pricing.grandTotal.toLocaleString()} in cash to the courier rider upon delivery.
            </span>
          )}
          {formData.paymentMethod === 'bank_transfer' && (
            <span>
              <strong>Direct Raast / IBAN:</strong> Transfer PKR {pricing.grandTotal.toLocaleString()} via Raast or banking app.
            </span>
          )}
          {formData.paymentMethod === 'card' && (
            <span>
              <strong>256-Bit SSL Encrypted:</strong> Secure checkout supported across all Visa, Mastercard, and PayPak cards.
            </span>
          )}
        </div>
      </section>
    </div>
  );
};
