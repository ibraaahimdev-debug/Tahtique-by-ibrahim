import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { TrackingLookupForm } from './components/TrackingLookupForm';
import { StatusStepper } from './components/StatusStepper';
import { TrackingOrderRecap } from './components/TrackingOrderRecap';
import { MOCK_TRACKED_ORDERS, type TrackedOrder } from '../../data/trackingData';
import {
  PackageSearch,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  Home,
  CheckCircle,
} from 'lucide-react';

interface OrderTrackingPageProps {
  initialOrderId?: string;
  onNavigateHome: () => void;
  onNavigateSupport: () => void;
  onLoginClick?: () => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderId = 'TGT-000482',
  onNavigateHome,
  onNavigateSupport,
  onLoginClick,
}) => {
  const [currentQuery, setCurrentQuery] = useState(initialOrderId);
  const [activeOrder, setActiveOrder] = useState<TrackedOrder | null>(() => {
    return MOCK_TRACKED_ORDERS[initialOrderId.toUpperCase()] || null;
  });
  const [hasSearched, setHasSearched] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialOrderId) {
      setCurrentQuery(initialOrderId);
      setActiveOrder(MOCK_TRACKED_ORDERS[initialOrderId.toUpperCase()] || null);
      setHasSearched(true);
    }
  }, [initialOrderId]);

  const handleTrackQuery = (code: string) => {
    setIsLoading(true);
    setCurrentQuery(code);
    setHasSearched(true);

    setTimeout(() => {
      const match = MOCK_TRACKED_ORDERS[code.toUpperCase()];
      setActiveOrder(match || null);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col selection:bg-[#EAD9EC] selection:text-[#5C3264] relative">
      {/* Top Navbar */}
      <Navbar
        isLanding={false}
        onLogin={onLoginClick}
        onHomeClick={onNavigateHome}
        onTrackClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onSupportClick={onNavigateSupport}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#8A8A8A] hover:text-[#5C3264] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
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
            <span className="text-[#1A1A1A] font-medium">Order Tracking</span>
          </div>
        </div>

        {/* Section Title */}
        <div className="mb-8">
          <span className="text-xs font-semibold text-[#5C3264] uppercase tracking-wider bg-[#EAD9EC]/60 px-3 py-1 rounded-full">
            Real-Time Logistics
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#1A1A1A] mt-2 tracking-tight">
            Order Status & Fulfillment
          </h1>
          <p className="text-sm text-[#8A8A8A]">
            Follow the live status of your Tagtique vehicle QR stickers from print queue to doorstep.
          </p>
        </div>

        {/* 1. Lookup Form */}
        <TrackingLookupForm
          initialOrderNumber={currentQuery}
          onTrack={handleTrackQuery}
          isLoading={isLoading}
        />

        {/* 2. Results Area */}
        {activeOrder ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Status Tracker Card */}
            <Card className="!p-6 sm:!p-8 border border-black/[0.05] shadow-sm bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/[0.06] pb-6 mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#8A8A8A] uppercase font-semibold tracking-wider">
                      Tracking
                    </span>
                    <span className="text-xl font-bold font-mono text-[#1A1A1A]">
                      #{activeOrder.orderNumber}
                    </span>
                  </div>
                  <p className="text-xs text-[#8A8A8A] mt-0.5">
                    Target Courier Arrival: <strong className="text-emerald-600 font-semibold">{activeOrder.estimatedDelivery}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#EAD9EC]/60 text-[#5C3264] px-3.5 py-1.5 rounded-full text-xs font-semibold w-fit border border-[#EAD9EC]">
                  <CheckCircle className="w-4 h-4" />
                  <span>Stage: {activeOrder.stages[activeOrder.currentStageIndex]?.label}</span>
                </div>
              </div>

              {/* Status Stepper (Horizontal on desktop, Vertical on mobile) */}
              <StatusStepper
                stages={activeOrder.stages}
                currentStageIndex={activeOrder.currentStageIndex}
              />
            </Card>

            {/* Order Details Recap Card */}
            <TrackingOrderRecap order={activeOrder} />
          </div>
        ) : hasSearched ? (
          /* Empty / Not Found State */
          <Card className="!p-8 sm:!p-12 text-center border border-black/[0.05] shadow-sm bg-white max-w-lg mx-auto">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-[#EAD9EC]/40 text-[#5C3264] flex items-center justify-center mb-4 border border-[#EAD9EC]">
              <PackageSearch className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
              Order #{currentQuery || '—'} Not Found
            </h3>
            <p className="text-xs sm:text-sm text-[#8A8A8A] mb-6 leading-relaxed">
              We couldn't locate an active shipment matching this reference ID. Please check the spelling or enter the email associated with your order.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#EAD9EC]/40 border border-[#EAD9EC] text-xs text-[#5C3264] text-left mb-6 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Tip: If you just completed checkout, production assignment takes up to 2 minutes. You can also try demo IDs: <strong>TGT-000482</strong> or <strong>TGT-000109</strong>.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTrackQuery('TGT-000482')}
              >
                Load Sample Order
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onNavigateSupport}
                icon={<HelpCircle className="w-4 h-4" />}
              >
                Contact Support
              </Button>
            </div>
          </Card>
        ) : null}
      </main>

      {/* Footer */}
      <Footer
        onTrackOrder={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onAdminClick={onLoginClick}
        onContactClick={onNavigateSupport}
        onHomeClick={onNavigateHome}
      />
    </div>
  );
};
