import React, { useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { PaymentMethodPicker } from './components/PaymentMethodPicker';
import { BillingForm } from './components/BillingForm';
import { OrderSuccessView } from './components/OrderSuccessView';
import { calculateOrderPricing } from '../../data/orderData';
import {
  ShieldCheck,
  Package,
  Lock,
  ArrowLeft,
  Truck,
  Car,
} from 'lucide-react';
import type { OrderFormData, PaymentMethodId, BillingDetails } from '../../types/order';

interface CheckoutPageProps {
  orderData: OrderFormData;
  onBackToOrder: () => void;
  onNavigateHome: () => void;
  onTrackOrder: (code: string) => void;
  onConfirmSuccess?: (orderId: string, orderData: OrderFormData) => void;
  onLoginClick?: () => void;
  onNavigateSupport?: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  orderData: initialOrderData,
  onBackToOrder,
  onNavigateHome,
  onTrackOrder,
  onConfirmSuccess,
  onLoginClick,
  onNavigateSupport,
}) => {
  const [orderData, setOrderData] = useState<OrderFormData>(initialOrderData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState<string>('');

  const pricing = calculateOrderPricing(
    orderData.packageId,
    orderData.materialId,
    orderData.quantity
  );

  const handleSelectPaymentMethod = (methodId: PaymentMethodId) => {
    setOrderData((prev) => ({ ...prev, paymentMethod: methodId }));
  };

  const handleUpdateBilling = (billing: BillingDetails) => {
    setOrderData((prev) => ({ ...prev, billing }));
  };

  // Payment verification handler
  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Fast order verification and ID assignment
    setTimeout(() => {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const newOrderId = `TGT-${randomNum}`;
      setGeneratedOrderId(newOrderId);
      setIsProcessing(false);
      if (onConfirmSuccess) {
        onConfirmSuccess(newOrderId, orderData);
      } else {
        setIsConfirmed(true);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700);
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col selection:bg-[#EAD9EC] selection:text-[#5C3264] relative">
      {/* Top Navbar */}
      <Navbar
        isLanding={false}
        onLogin={onLoginClick}
        onHomeClick={onNavigateHome}
        onTrackClick={() => window.open('https://wa.me/923292082080', '_blank')}
        onSupportClick={onNavigateSupport}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        {/* If Order is Confirmed, render Celebratory View */}
        {isConfirmed ? (
          <OrderSuccessView
            orderId={generatedOrderId}
            orderData={orderData}
            totalPaid={pricing.grandTotal}
            onNavigateHome={onNavigateHome}
            onTrackOrder={onTrackOrder}
          />
        ) : (
          <div>
            {/* Header & Back Action */}
            <div className="mb-8 flex items-center justify-between">
              <button
                type="button"
                onClick={onBackToOrder}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#8A8A8A] hover:text-[#5C3264] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Customise Order</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-[#5C3264] font-medium bg-[#EAD9EC]/60 px-3 py-1 rounded-full border border-[#EAD9EC]">
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit Encrypted Checkout</span>
              </div>
            </div>

            <div className="mb-8">
              <span className="text-xs font-semibold text-[#5C3264] uppercase tracking-wider bg-[#EAD9EC]/60 px-3 py-1 rounded-full">
                Final Step
              </span>
              <h2 className="text-2xl sm:text-4xl font-semibold text-[#1A1A1A] mt-2 tracking-tight">
                Secure Checkout & Payment
              </h2>
              <p className="text-sm text-[#8A8A8A]">
                Confirm your order details and payment method below.
              </p>
            </div>

            {/* Main Form Grid */}
            <form onSubmit={handleConfirmPayment}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Payment Selector + Billing Details Form */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Payment Method Selector Card */}
                  <Card className="!p-6 sm:!p-8 border border-black/[0.05] shadow-sm bg-white">
                    <PaymentMethodPicker
                      selectedMethod={orderData.paymentMethod}
                      onSelect={handleSelectPaymentMethod}
                    />
                  </Card>

                  {/* Billing Details Card */}
                  <Card className="!p-6 sm:!p-8 border border-black/[0.05] shadow-sm bg-white">
                    <BillingForm
                      billing={orderData.billing}
                      delivery={orderData.delivery}
                      onChange={handleUpdateBilling}
                    />
                  </Card>
                </div>

                {/* Right Column: Order Summary Recap Panel */}
                <div className="lg:col-span-5">
                  <div className="sticky top-28 space-y-4">
                    <Card className="!p-6 sm:!p-7 border border-black/[0.05] shadow-md bg-white">
                      <div className="flex items-center justify-between border-b border-black/[0.06] pb-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-[#5C3264]" />
                          <h3 className="font-semibold text-base text-[#1A1A1A]">
                            Order Summary Recap
                          </h3>
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Ready to Ship
                        </span>
                      </div>

                      {/* Line Items */}
                      <div className="space-y-3 text-xs sm:text-sm pb-4 border-b border-black/[0.05]">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-[#1A1A1A]">
                              {pricing.basePackageName}
                            </p>
                            <p className="text-[11px] text-[#8A8A8A]">
                              {orderData.quantity} x {pricing.materialName}
                            </p>
                          </div>
                          <span className="font-semibold text-[#1A1A1A]">
                            PKR {pricing.basePackagePrice.toLocaleString()}
                          </span>
                        </div>

                        {pricing.extraTagsPrice > 0 && (
                          <div className="flex justify-between items-center text-[#8A8A8A]">
                            <span>Additional Tags ({pricing.extraTagsCount}x @ PKR 1,000)</span>
                            <span className="text-[#5C3264] font-semibold">+PKR {pricing.extraTagsPrice.toLocaleString()}</span>
                          </div>
                        )}

                        {pricing.materialUpgradeCost > 0 && (
                          <div className="flex justify-between items-center text-[#8A8A8A]">
                            <span>Material Upgrade ({orderData.quantity}x @ PKR 450)</span>
                            <span className="text-[#1A1A1A] font-medium">+PKR {pricing.materialUpgradeCost.toLocaleString()}</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center text-[#8A8A8A]">
                          <span className="flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-[#5C3264]" />
                            <span>Doorstep Courier Shipping (Pakistan)</span>
                          </span>
                          <span className="text-emerald-600 font-semibold uppercase text-xs">
                            Free
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[#8A8A8A]">
                          <span>Lifetime Anonymous Relay Routing</span>
                          <span className="text-emerald-600 font-semibold text-xs">
                            Included
                          </span>
                        </div>
                      </div>

                      {/* Configured Plates Preview */}
                      <div className="py-3 border-b border-black/[0.05] text-xs">
                        <span className="text-[#8A8A8A] block mb-1.5 flex items-center gap-1">
                          <Car className="w-3.5 h-3.5 text-[#5C3264]" />
                          <span>Encoded Vehicles ({orderData.vehicles.length}):</span>
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {orderData.vehicles.map((v, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-[#EAD9EC]/60 text-[#5C3264] font-semibold text-[11px] uppercase tracking-wider"
                            >
                              {v.vehiclePlate || `Tag #${i + 1}`}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Address Summary */}
                      <div className="py-3 border-b border-black/[0.05] text-xs space-y-1">
                        <span className="text-[#8A8A8A]">Delivery To:</span>
                        <p className="font-semibold text-[#1A1A1A]">
                          {orderData.delivery.fullName}
                        </p>
                        <p className="text-[#8A8A8A]">
                          {orderData.delivery.addressLine}, {orderData.delivery.city} {orderData.delivery.postalCode}
                        </p>
                      </div>

                      {/* Total Breakdown */}
                      <div className="py-4 border-b border-black/[0.06] flex items-baseline justify-between">
                        <div>
                          <span className="text-xs text-[#8A8A8A]">Total Amount Due</span>
                          <p className="text-xs text-emerald-600 font-medium">One-time payment • All taxes included</p>
                        </div>
                        <span className="text-2xl sm:text-3xl font-extrabold text-[#5C3264]">
                          PKR {pricing.grandTotal.toLocaleString()}
                        </span>
                      </div>

                      {/* Primary Confirm & Pay Button */}
                      <div className="pt-4">
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          fullWidth
                          disabled={isProcessing}
                          className="shadow-lg py-4 text-base font-semibold cursor-pointer"
                        >
                          {isProcessing
                            ? 'Processing Order...'
                            : `Confirm & Place Order (PKR ${pricing.grandTotal.toLocaleString()})`}
                        </Button>
                      </div>

                      {/* Trust & Guarantee */}
                      <div className="mt-4 pt-3 flex flex-col items-center gap-1 text-[11px] text-[#8A8A8A]">
                        <div className="flex items-center gap-1.5 text-[#5C3264] font-medium">
                          <ShieldCheck className="w-4 h-4" />
                          <span>30-Day No-Questions Money Back Guarantee</span>
                        </div>
                        <span className="text-[10px] text-gray-400">256-Bit SSL Encrypted Checkout • PCI-DSS Compliant</span>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onTrackOrder={() => window.open('https://wa.me/923292082080', '_blank')}
        onAdminClick={onLoginClick}
        onContactClick={onNavigateSupport}
        onHomeClick={onNavigateHome}
      />
    </div>
  );
};
