import React from 'react';
import { Check, Clock } from 'lucide-react';
import type { TrackingStage } from '../../../data/trackingData';

interface StatusStepperProps {
  stages: TrackingStage[];
  currentStageIndex: number;
}

export const StatusStepper: React.FC<StatusStepperProps> = ({
  stages,
  currentStageIndex,
}) => {
  return (
    <div className="w-full">
      {/* DESKTOP HORIZONTAL STEPPER */}
      <div className="hidden md:block">
        <div className="relative flex items-start justify-between">
          {/* Connecting Background Line */}
          <div className="absolute top-5 left-8 right-8 h-1 bg-[#EAD9EC]/40 -z-0">
            {/* Progress Fill Line */}
            <div
              className="h-full bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] transition-all duration-500 ease-out"
              style={{
                width: `${(currentStageIndex / (stages.length - 1)) * 100}%`,
              }}
            />
          </div>

          {stages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={stage.step}
                className="flex flex-col items-center text-center relative z-10 max-w-[130px]"
              >
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] shadow-xs border border-white/80'
                      : isCurrent
                      ? 'bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] ring-4 ring-[#EAD9EC]/50 shadow-md scale-110 border border-white/80'
                      : 'bg-white text-[#8A8A8A] border-2 border-black/10'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : isCurrent ? (
                    <Clock className="w-5 h-5 animate-pulse" />
                  ) : (
                    stage.step
                  )}
                </div>

                {/* Stage Label */}
                <h4
                  className={`text-xs font-semibold mt-3 leading-tight ${
                    isCurrent
                      ? 'text-[#5C3264]'
                      : isCompleted
                      ? 'text-[#1A1A1A]'
                      : 'text-[#8A8A8A]'
                  }`}
                >
                  {stage.label}
                </h4>

                {/* Timestamp / Status subtitle */}
                <span className="text-[11px] text-[#8A8A8A] mt-1 leading-snug">
                  {stage.timestamp || (isCurrent ? 'Current' : 'Upcoming')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE VERTICAL STEPPER */}
      <div className="md:hidden space-y-6 relative pl-4">
        {/* Vertical Connecting Track */}
        <div className="absolute top-4 bottom-4 left-[27px] w-0.5 bg-[#EAD9EC]/40 -z-0" />

        {stages.map((stage, idx) => {
          const isCompleted = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;

          return (
            <div key={stage.step} className="flex items-start gap-4 relative z-10">
              {/* Step Circle */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                  isCompleted
                    ? 'bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] shadow-xs border border-white/80'
                    : isCurrent
                    ? 'bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] ring-4 ring-[#EAD9EC]/50 shadow-sm border border-white/80'
                    : 'bg-white text-[#8A8A8A] border-2 border-black/10'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4 animate-pulse" />
                ) : (
                  stage.step
                )}
              </div>

              {/* Text Block */}
              <div className="flex-1 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? 'text-[#5C3264]'
                        : isCompleted
                        ? 'text-[#1A1A1A]'
                        : 'text-[#8A8A8A]'
                    }`}
                  >
                    {stage.label}
                  </h4>
                  <span className="text-[10px] text-[#8A8A8A] shrink-0 font-medium">
                    {stage.timestamp}
                  </span>
                </div>
                <p className="text-xs text-[#8A8A8A] mt-0.5 leading-relaxed">
                  {stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
