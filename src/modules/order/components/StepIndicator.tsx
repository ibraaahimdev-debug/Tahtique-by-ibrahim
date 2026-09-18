import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps = 4,
  onStepClick,
}) => {
  const steps = [
    { number: 1, title: 'Product', subtitle: 'Type & Package' },
    { number: 2, title: 'Vehicle Info', subtitle: 'QR Data & Relay' },
    { number: 3, title: 'Delivery', subtitle: 'Shipping Address' },
    { number: 4, title: 'Review', subtitle: 'Confirm Order' },
  ];

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-black/[0.04] mb-8">
      {/* Mobile Step Header */}
      <div className="flex items-center justify-between sm:hidden mb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] text-xs font-bold flex items-center justify-center border border-white/80">
            {currentStep}
          </span>
          <span className="text-sm font-semibold text-[#1A1A1A]">
            {steps[currentStep - 1]?.title}
          </span>
        </div>
        <span className="text-xs text-[#8A8A8A]">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Progress Bar Track (Mobile & Desktop) */}
      <div className="w-full bg-[#EAD9EC]/40 h-1.5 rounded-full mb-4 sm:hidden overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Desktop Stepper */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Connecting Background Line */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-[#EAD9EC]/50 -z-0" />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const isClickable = onStepClick && step.number < currentStep;

          return (
            <div
              key={step.number}
              onClick={() => isClickable && onStepClick(step.number)}
              className={`flex items-center gap-3 relative z-10 bg-white px-2 py-1 rounded-2xl transition-all ${
                isClickable ? 'cursor-pointer hover:opacity-80' : ''
              }`}
            >
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shrink-0 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] shadow-xs border border-white/80'
                    : isActive
                    ? 'bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] ring-4 ring-[#EAD9EC]/40 shadow-sm border border-white/80'
                    : 'bg-[#F7EBEF] text-[#8A8A8A]'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : step.number}
              </div>

              {/* Step Labels */}
              <div className="flex flex-col text-left">
                <span
                  className={`text-xs font-semibold leading-tight ${
                    isActive ? 'text-[#1A1A1A]' : isCompleted ? 'text-[#1A1A1A]' : 'text-[#8A8A8A]'
                  }`}
                >
                  {step.title}
                </span>
                <span className="text-[11px] text-[#8A8A8A] leading-tight">
                  {step.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
