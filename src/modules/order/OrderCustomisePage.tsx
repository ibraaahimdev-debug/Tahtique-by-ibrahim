import React, { useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { StepIndicator } from './components/StepIndicator';
import { StepChooseProduct } from './components/StepChooseProduct';
import { StepVehicleDetails } from './components/StepVehicleDetails';
import { StepDeliveryDetails } from './components/StepDeliveryDetails';
import { StepOrderConfirm } from './components/StepOrderConfirm';
import { LiveSummaryPanel } from './components/LiveSummaryPanel';
import { INITIAL_ORDER_STATE } from '../../data/orderData';
import { PRICING_PACKAGES } from '../../data/mockData';
import { ArrowLeft, Home } from 'lucide-react';
import type { OrderFormData } from '../../types/order';

interface OrderCustomisePageProps {
  initialPackageId?: string;
  onSubmitOrder: (formData: OrderFormData) => void;
  onNavigateHome: () => void;
  onLoginClick?: () => void;
  onNavigateTracking?: (code: string) => void;
  onNavigateSupport?: () => void;
}

export const OrderCustomisePage: React.FC<OrderCustomisePageProps> = ({
  initialPackageId = 'pack-of-two',
  onSubmitOrder,
  onNavigateHome,
  onLoginClick,
  onNavigateTracking,
  onNavigateSupport,
}) => {
  // Initialize state with initial package if provided
  const [formData, setFormData] = useState<OrderFormData>(() => {
    const pkg = PRICING_PACKAGES.find((p) => p.id === initialPackageId);
    const count = pkg ? pkg.tagCount : 2;
    const initialVehicles = Array.from({ length: count }, () => ({
      ownerName: '',
      contactNumber: '',
      vehiclePlate: '',
      vehicleModel: '',
    }));

    return {
      ...INITIAL_ORDER_STATE,
      packageId: initialPackageId,
      quantity: count,
      vehicles: initialVehicles,
    };
  });

  const [currentStep, setCurrentStep] = useState<number>(1);

  const updateFormData = (updates: Partial<OrderFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onSubmitOrder(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigateHome();
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col selection:bg-[#EAD9EC] selection:text-[#5C3264] relative">
      {/* Top Navbar */}
      <Navbar
        isLanding={false}
        onLogin={onLoginClick}
        onHomeClick={onNavigateHome}
        onOrderClick={() => setCurrentStep(1)}
        onTrackClick={() => onNavigateTracking ? onNavigateTracking('TGT-000482') : undefined}
        onSupportClick={onNavigateSupport}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full pb-28 lg:pb-12">
        {/* Back navigation & breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#8A8A8A] hover:text-[#5C3264] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? 'Back to Home' : 'Previous Step'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#8A8A8A]">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#5C3264] flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-[#1A1A1A] font-medium">Customise Tag</span>
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          onStepClick={(step) => setCurrentStep(step)}
        />

        {/* Two-Column Layout: Step Form Content (Left) + Persistent Live Summary (Right) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Form Content */}
          <div className="flex-1 w-full min-w-0">
            {currentStep === 1 && (
              <StepChooseProduct
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
              />
            )}

            {currentStep === 2 && (
              <StepVehicleDetails
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 3 && (
              <StepDeliveryDetails
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {currentStep === 4 && (
              <StepOrderConfirm
                formData={formData}
                onSubmitOrder={onSubmitOrder}
                onBack={handleBack}
                onJumpToStep={(step) => setCurrentStep(step)}
              />
            )}
          </div>

          {/* Persistent Live Order Summary Panel */}
          <LiveSummaryPanel
            formData={formData}
            currentStep={currentStep}
            onNext={handleNext}
            isLastStep={currentStep === 4}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer
        onTrackOrder={() => onNavigateTracking ? onNavigateTracking('TGT-000482') : undefined}
        onAdminClick={onLoginClick}
        onContactClick={onNavigateSupport}
        onHomeClick={onNavigateHome}
      />
    </div>
  );
};
