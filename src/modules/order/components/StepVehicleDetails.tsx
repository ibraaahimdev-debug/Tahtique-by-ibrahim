import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/common/Button';
import {
  ShieldCheck,
  Phone,
  User,
  Car,
  Tag,
  ArrowRight,
  ArrowLeft,
  Copy,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import type { OrderFormData, VehicleDetails } from '../../../types/order';
import { vehicleService, buildPublicScanUrl } from '../../../services/vehicleService';
import type { VehicleRecord } from '../../../types/vehicle';
import { VehicleQRTag } from '../../../components/common/VehicleQRTag';

interface StepVehicleDetailsProps {
  formData: OrderFormData;
  updateFormData: (updates: Partial<OrderFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepVehicleDetails: React.FC<StepVehicleDetailsProps> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}) => {
  const [activeVehicleIndex, setActiveVehicleIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [allVehicles, setAllVehicles] = useState<VehicleRecord[]>(() => vehicleService.getAllVehicles());

  // Subscribe to reactive updates from vehicleService
  useEffect(() => {
    const unsubscribe = vehicleService.subscribe((vehicles) => {
      setAllVehicles(vehicles);
    });
    return unsubscribe;
  }, []);

  const currentVehicle: VehicleDetails = formData.vehicles[activeVehicleIndex] || {
    ownerName: '',
    contactNumber: '',
    vehiclePlate: '',
    state: 'CA',
    vehicleModel: '',
  };

  // Find corresponding reactive vehicle record in vehicleService
  const activeRecord = allVehicles.find(
    (v) =>
      v.plate_number.toUpperCase() === (currentVehicle.vehiclePlate || '').trim().toUpperCase() &&
      v.state.toUpperCase() === (currentVehicle.state || 'CA').trim().toUpperCase()
  );

  // Debounced/blur auto-save trigger: fires on blur or submit, NOT on every keystroke
  const handleTriggerAutoSave = (vehicle: VehicleDetails) => {
    if (!vehicle.vehiclePlate.trim()) return;

    const saved = vehicleService.saveVehicle({
      id: vehicle.id,
      plate_number: vehicle.vehiclePlate,
      state: vehicle.state || 'CA',
      vehicle_model: vehicle.vehicleModel,
      owner_name: vehicle.ownerName,
      owner_phone: vehicle.contactNumber,
    });

    const updated = [...formData.vehicles];
    updated[activeVehicleIndex] = {
      ...vehicle,
      id: saved.id,
      qrToken: saved.qr_token,
      qrSvgUrl: saved.qr_svg_url,
      qrGeneratedAt: saved.qr_generated_at,
      revokedAt: saved.revoked_at,
      qrStatus: saved.qr_svg_url ? 'ready' : 'generating',
    };
    updateFormData({ vehicles: updated });
  };

  const handleFieldChange = (field: keyof VehicleDetails, value: string) => {
    const updatedVehicles = [...formData.vehicles];
    const updatedCurrent = {
      ...currentVehicle,
      [field]: value,
    };
    updatedVehicles[activeVehicleIndex] = updatedCurrent;
    updateFormData({ vehicles: updatedVehicles });

    // Clear error on edit
    const errorKey = `${activeVehicleIndex}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  const copyToAllVehicles = () => {
    const template = currentVehicle;
    const updated = formData.vehicles.map((v, i) =>
      i === activeVehicleIndex
        ? v
        : {
            ...v,
            ownerName: template.ownerName,
            contactNumber: template.contactNumber,
          }
    );
    updateFormData({ vehicles: updated });
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

    formData.vehicles.forEach((v, idx) => {
      if (!v.ownerName.trim()) {
        newErrors[`${idx}_ownerName`] = 'Owner name is required';
      }
      if (!v.contactNumber.trim()) {
        newErrors[`${idx}_contactNumber`] = 'Contact number is required';
      } else if (!phoneRegex.test(v.contactNumber.replace(/\s+/g, '')) && v.contactNumber.replace(/\D/g, '').length < 7) {
        newErrors[`${idx}_contactNumber`] = 'Please enter a valid phone number (min 7-10 digits)';
      }
      if (!v.vehiclePlate.trim()) {
        newErrors[`${idx}_vehiclePlate`] = 'Vehicle license plate / registration is required';
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Find the first vehicle with an error and switch tab
      const firstErrorKey = Object.keys(newErrors)[0];
      const errorIdx = parseInt(firstErrorKey.split('_')[0], 10);
      if (!isNaN(errorIdx)) {
        setActiveVehicleIndex(errorIdx);
      }
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (validateAll()) {
      // Auto-save and register all vehicles in vehicleService
      const updatedVehicles = formData.vehicles.map((v) => {
        const saved = vehicleService.saveVehicle({
          id: v.id,
          plate_number: v.vehiclePlate,
          state: v.state || 'CA',
          vehicle_model: v.vehicleModel,
          owner_name: v.ownerName,
          owner_phone: v.contactNumber,
        });
        return {
          ...v,
          id: saved.id,
          state: v.state || 'CA',
          qrToken: saved.qr_token,
          qrSvgUrl: saved.qr_svg_url,
          qrGeneratedAt: saved.qr_generated_at,
          revokedAt: saved.revoked_at,
          qrStatus: (saved.qr_svg_url ? 'ready' : 'generating') as 'ready' | 'generating',
        };
      });
      updateFormData({ vehicles: updatedVehicles });
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-[#5C3264] uppercase tracking-wider bg-[#EAD9EC]/60 px-3 py-1 rounded-full">
          Step 02
        </span>
        <h3 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A] mt-2">
          Vehicle & Contact QR Encoding
        </h3>
        <p className="text-sm text-[#8A8A8A]">
          Enter vehicle details. A unique, non-guessable cryptographic QR code is automatically generated upon submission.
        </p>
      </div>

      {/* Multi-vehicle Tab Selector if quantity > 1 */}
      {formData.vehicles.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#F7EBEF] border border-[#EAD9EC] rounded-2xl">
          <div className="flex flex-wrap gap-1.5">
            {formData.vehicles.map((_, idx) => {
              const hasError = Object.keys(errors).some((key) => key.startsWith(`${idx}_`));
              const isFilled =
                formData.vehicles[idx]?.ownerName &&
                formData.vehicles[idx]?.vehiclePlate;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveVehicleIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeVehicleIndex === idx
                      ? 'bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] font-bold shadow-xs border border-white/80'
                      : 'bg-white text-[#1A1A1A] hover:bg-white/80'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Tag #{idx + 1}</span>
                  {hasError && (
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                  )}
                  {isFilled && !hasError && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={copyToAllVehicles}
            className="text-xs font-semibold text-[#5C3264] hover:underline flex items-center gap-1 px-2 py-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy name & phone to all tags</span>
          </button>
        </div>
      )}

      {/* Form Fields Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.05] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-black/[0.05] pb-4">
          <h4 className="font-semibold text-base text-[#1A1A1A] flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#5C3264]" />
            <span>Configuring QR Tag #{activeVehicleIndex + 1} of {formData.vehicles.length}</span>
          </h4>
          <span className="text-xs text-[#8A8A8A]">
            {currentVehicle.vehiclePlate ? `${currentVehicle.state || 'CA'} • ${currentVehicle.vehiclePlate}` : 'Unassigned Plate'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Owner Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">
              Owner Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Alex Henderson"
                value={currentVehicle.ownerName}
                onChange={(e) => handleFieldChange('ownerName', e.target.value)}
                onBlur={() => handleTriggerAutoSave(currentVehicle)}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm border bg-[#F7EBEF]/30 focus:bg-white transition-all focus:outline-none focus:ring-2 ${
                  errors[`${activeVehicleIndex}_ownerName`]
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-black/10 focus:border-[#B89BBF] focus:ring-[#EAD9EC]/60'
                }`}
              />
            </div>
            {errors[`${activeVehicleIndex}_ownerName`] && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors[`${activeVehicleIndex}_ownerName`]}
              </p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">
              Contact Phone Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                placeholder="e.g. +1 (555) 234-5678"
                value={currentVehicle.contactNumber}
                onChange={(e) => handleFieldChange('contactNumber', e.target.value)}
                onBlur={() => handleTriggerAutoSave(currentVehicle)}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm border bg-[#F7EBEF]/30 focus:bg-white transition-all focus:outline-none focus:ring-2 ${
                  errors[`${activeVehicleIndex}_contactNumber`]
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-black/10 focus:border-[#B89BBF] focus:ring-[#EAD9EC]/60'
                }`}
              />
            </div>
            {errors[`${activeVehicleIndex}_contactNumber`] ? (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors[`${activeVehicleIndex}_contactNumber`]}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-[#5C3264] flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>This number is relayed, never encoded in the QR</span>
              </p>
            )}
          </div>

          {/* State & Vehicle License Plate (Composite row) */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* State / Province */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">
                State / Province *
              </label>
              <input
                type="text"
                placeholder="e.g. CA"
                maxLength={8}
                value={currentVehicle.state || 'CA'}
                onChange={(e) => handleFieldChange('state', e.target.value.toUpperCase())}
                onBlur={() => handleTriggerAutoSave(currentVehicle)}
                className="w-full px-3.5 py-3 rounded-2xl text-sm uppercase font-bold text-center border border-black/10 bg-[#F7EBEF]/30 focus:bg-white transition-all focus:outline-none focus:border-[#B89BBF] focus:ring-2 focus:ring-[#EAD9EC]/60"
              />
            </div>

            {/* Vehicle License Plate */}
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">
                Vehicle Plate / Registration *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                  <Car className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. 7XYZ890"
                  value={currentVehicle.vehiclePlate}
                  onChange={(e) => handleFieldChange('vehiclePlate', e.target.value.toUpperCase())}
                  onBlur={() => handleTriggerAutoSave(currentVehicle)}
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm uppercase font-semibold tracking-wider border bg-[#F7EBEF]/30 focus:bg-white transition-all focus:outline-none focus:ring-2 ${
                    errors[`${activeVehicleIndex}_vehiclePlate`]
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-black/10 focus:border-[#B89BBF] focus:ring-[#EAD9EC]/60'
                  }`}
                />
              </div>
              {errors[`${activeVehicleIndex}_vehiclePlate`] && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors[`${activeVehicleIndex}_vehiclePlate`]}
                </p>
              )}
            </div>
          </div>

          {/* Optional Vehicle Model or Nickname */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">
              Vehicle Nickname / Make & Model (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
                <Car className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Tesla Model 3 / White Civic"
                value={currentVehicle.vehicleModel || ''}
                onChange={(e) => handleFieldChange('vehicleModel', e.target.value)}
                onBlur={() => handleTriggerAutoSave(currentVehicle)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm border border-black/10 bg-[#F7EBEF]/30 focus:bg-white transition-all focus:outline-none focus:border-[#B89BBF] focus:ring-2 focus:ring-[#EAD9EC]/60"
              />
            </div>
            <p className="mt-1.5 text-xs text-[#8A8A8A]">
              Helps bystanders confirm they are messaging the right car on the public scan page.
            </p>
          </div>
        </div>

        {/* Live Reactive QR Asset Preview Card */}
        <div className="mt-6 pt-6 border-t border-black/[0.06]">
          <div className="bg-[#FBF7FA] rounded-2xl p-5 sm:p-6 border border-[#EAD9EC]/80 flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* User-Styled 3x3 Physical Windshield Tag with Daylight vs Night Glow Switcher */}
            <div className="flex justify-center w-full lg:w-auto shrink-0">
              <VehicleQRTag
                qrValue={
                  activeRecord?.qr_token
                    ? buildPublicScanUrl(activeRecord.qr_token)
                    : currentVehicle.vehiclePlate
                    ? `https://tagtique.app/v/PREVIEW-${currentVehicle.vehiclePlate}`
                    : '89640001017048964000101704'
                }
                plateNumber={currentVehicle.vehiclePlate}
                state={currentVehicle.state}
                showModeSwitcher={true}
                showDownload={true}
              />
            </div>

            {/* Right Information & Security Assurance */}
            <div className="space-y-3 flex-1 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5C3264] bg-[#EAD9EC]/70 px-2.5 py-0.5 rounded-md">
                  <Sparkles className="w-3 h-3" />
                  Auto-Reactive QR Generator
                </span>
                {activeRecord?.qr_svg_url && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3" />
                    Vector SVG Ready
                  </span>
                )}
              </div>

              <h5 className="text-base font-bold text-gray-900">
                {currentVehicle.vehiclePlate
                  ? `${currentVehicle.state || 'CA'} · ${currentVehicle.vehiclePlate}`
                  : 'Physical Windshield QR Tag'}
              </h5>

              <p className="text-xs text-gray-600 leading-relaxed">
                {activeRecord?.qr_token ? (
                  <>
                    Encodes secure dynamic URL: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-[11px] text-[#5C3264]">https://tagtique.app/v/{activeRecord.qr_token.slice(0, 10)}...</code>. Your personal phone number & name are never printed on the sticker or stored in the QR pattern.
                  </>
                ) : (
                  'Fill in your plate & state above. Your vector print asset is generated automatically in real time.'
                )}
              </p>

              <div className="p-3 bg-white/90 rounded-xl border border-gray-200/80 text-[11px] text-gray-600 space-y-1">
                <div className="flex items-center justify-center lg:justify-start gap-1.5 font-semibold text-gray-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Dual Material Windshield Preview:</span>
                </div>
                <p className="leading-snug">
                  Toggle the mode button above to inspect how your sticker looks in <strong>Daylight (Reflective)</strong> vs <strong>Night (Fluorescent Glow)</strong>.
                </p>
              </div>
            </div>
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
          Continue to Delivery Details
        </Button>
      </div>
    </div>
  );
};
