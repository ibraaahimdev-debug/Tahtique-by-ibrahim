import React, { useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { StreamlinedOrderForm } from './components/StreamlinedOrderForm';
import { OrderSuccessCard } from './components/OrderSuccessCard';
import { LiveSummaryPanel } from './components/LiveSummaryPanel';
import { INITIAL_ORDER_STATE, calculateOrderPricing } from '../../data/orderData';
import { PRICING_PACKAGES } from '../../data/mockData';
import {
  ArrowLeft,
  Home,
  ShieldCheck,
  Truck,
  Lock,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import type { OrderFormData } from '../../types/order';
import { Glass3DCardPreview } from './components/Glass3DCardPreview';
import { orderBackendService } from '../../services/orderBackendService';

interface OrderCustomisePageProps {
  initialPackageId?: string;
  onSubmitOrder: (formData: OrderFormData) => void;
  onOrderSuccess?: (newOrderId: string, confirmedData: OrderFormData) => void;
  onNavigateHome: () => void;
  onLoginClick?: () => void;
  onNavigateTracking?: (code: string) => void;
  onNavigateSupport?: () => void;
}

export const OrderCustomisePage: React.FC<OrderCustomisePageProps> = ({
  initialPackageId = 'pack-of-two',
  onSubmitOrder,
  onOrderSuccess,
  onNavigateHome,
  onLoginClick,
  onNavigateTracking,
  onNavigateSupport,
}) => {
  // Initialize state with default package (pack of two as default popular choice)
  const [formData, setFormData] = useState<OrderFormData>(() => {
    const pkg = PRICING_PACKAGES.find((p) => p.id === initialPackageId) || PRICING_PACKAGES[1];
    const count = pkg.tagCount;
    const initialVehicles = Array.from({ length: count }, () => ({
      ownerName: '',
      contactNumber: '',
      guardianContact: '',
      vehiclePlate: '',
      vehicleModel: '',
      vehicleType: 'Car',
    }));

    return {
      ...INITIAL_ORDER_STATE,
      packageId: pkg.id,
      quantity: count,
      vehicles: initialVehicles,
      paymentMethod: 'cod',
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');
  const [activePage, setActivePage] = useState<1 | 2>(1);

  // Card details state for auto-fill
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4532 8920 1842 4242',
    cardHolder: formData.vehicles[0]?.ownerName || 'Muhammad Ali',
    cardExpiry: '08/28',
    cardCvc: '892',
  });

  const pricing = calculateOrderPricing(
    formData.packageId,
    formData.materialId,
    formData.quantity
  );

  const updateFormData = (updates: Partial<OrderFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Inline validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    formData.vehicles.forEach((v, idx) => {
      if (!v.vehiclePlate.trim()) {
        newErrors[`veh_${idx}_vehiclePlate`] = 'License plate number is required';
      }
      if (!v.ownerName.trim()) {
        newErrors[`veh_${idx}_ownerName`] = 'Owner name is required';
      }
      if (!v.contactNumber.trim()) {
        newErrors[`veh_${idx}_contactNumber`] = 'Phone number is required';
      } else if (v.contactNumber.replace(/\D/g, '').length < 7) {
        newErrors[`veh_${idx}_contactNumber`] = 'Please enter a valid phone number';
      }
    });

    if (!formData.delivery.addressLine.trim()) {
      newErrors['del_addressLine'] = 'Street address is required';
    }
    if (!formData.delivery.city.trim()) {
      newErrors['del_city'] = 'City is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstKey = Object.keys(newErrors)[0];
      if (firstKey.startsWith('veh_')) {
        const parts = firstKey.split('_');
        const idx = parts[1];
        const el = document.getElementById(`vehicle-card-${idx}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        window.scrollTo({ top: 350, behavior: 'smooth' });
      }
      return false;
    }

    return true;
  };

  // Main order placement handler
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const randomId = `TGT-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // Store in Supabase + local backend service and generate QR tokens
      await orderBackendService.createOrderWithTags(formData, randomId);
    } catch (err) {
      console.warn('Backend order submission warning:', err);
    }

    setTimeout(() => {
      setConfirmedOrderId(randomId);
      setIsSubmitting(false);
      setIsOrderPlaced(true);

      // Notify parent app
      if (onOrderSuccess) {
        onOrderSuccess(randomId, formData);
      } else if (onSubmitOrder) {
        onSubmitOrder(formData);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FDFBFD] text-[#1A1A1A] flex flex-col selection:bg-[#EAD9EC] selection:text-[#5C3264] relative">
      {/* Top Navbar */}
      <Navbar
        isLanding={false}
        onLogin={onLoginClick}
        onHomeClick={onNavigateHome}
        onOrderClick={() => {
          setIsOrderPlaced(false);
          setActivePage(1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onTrackClick={() => window.open('https://wa.me/923292082080', '_blank')}
        onSupportClick={onNavigateSupport}
      />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 w-full pb-32 lg:pb-16">
        {/* Navigation & Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#8A8A8A] hover:text-[#5C3264] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#8A8A8A]">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#5C3264] flex items-center gap-1 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-[#1A1A1A] font-semibold">
              {isOrderPlaced ? 'Order Confirmed' : 'Order E-Tag'}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW A: SUCCESS STATE ON SAME PAGE (NO SEPARATE REDIRECT) */}
        {/* ========================================================================= */}
        {isOrderPlaced ? (
          <OrderSuccessCard
            orderId={confirmedOrderId}
            orderData={formData}
            onNavigateHome={onNavigateHome}
            onTrackOrder={onNavigateTracking}
            onNavigateSupport={onNavigateSupport}
          />
        ) : (
          /* ========================================================================= */
          /* VIEW B: STREAMLINED ORDER FLOW (PAGE 1 / PAGE 2) */
          /* ========================================================================= */
          <div>
            {/* Header banner */}
            <div className="mb-6 sm:mb-8 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
                Order Your Smart E-Tag
              </h1>
              <p className="text-xs sm:text-sm text-[#8A8A8A] mt-1.5 max-w-xl">
                Protect your privacy and stay reachable. Configured in under 90 seconds with 100% phone number masking.
              </p>

              {/* Trust Badges Bar */}
              <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] text-[#5C3264] font-semibold">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  Free Nationwide Courier
                </span>
                <span className="text-black/20 hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5C3264]" />
                  Zero Monthly Fees
                </span>
                <span className="text-black/20 hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  Cash on Delivery Available
                </span>
              </div>
            </div>

            {/* Layout: Single column mobile-first with sticky summary */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Main Form (Single column) */}
              <div className="flex-1 w-full min-w-0">
                {activePage === 1 ? (
                  <>
                    <StreamlinedOrderForm
                      formData={formData}
                      updateFormData={updateFormData}
                      errors={errors}
                      setErrors={setErrors}
                    />

                    {/* Secondary option to review & pay on Page 2 if user prefers */}
                    <div className="mt-6 pt-4 text-center sm:text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (validateForm()) {
                            setActivePage(2);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className="text-xs text-[#5C3264] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Prefer to review order details on Page 2 first?</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                ) : (
                  /* ========================================================================= */
                  /* PAGE 2: PAYMENT METHOD & PAYMENT ACTION */
                  /* ========================================================================= */
                  <div className="space-y-6">
                    {/* Page 2 Header */}
                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
                      <div>
                        <h2 className="text-xl font-bold text-[#1A1A1A]">
                          Review & Complete Payment
                        </h2>
                        <p className="text-xs text-[#8A8A8A]">
                          Confirm your details and submit your order.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActivePage(1)}
                        className="text-xs font-semibold text-[#5C3264] hover:underline cursor-pointer"
                      >
                        ← Edit Details (Page 1)
                      </button>
                    </div>

                    {/* Quick Recap */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-black/[0.06] shadow-xs space-y-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#8A8A8A]">Selected Plan:</span>
                        <span className="font-bold text-[#1A1A1A]">{pricing.basePackageName} ({formData.quantity} tags)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8A8A8A]">Vehicles:</span>
                        <span className="font-mono uppercase font-bold text-[#5C3264]">
                          {formData.vehicles.map((v) => v.vehiclePlate || 'Pending').join(', ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8A8A8A]">Shipping to:</span>
                        <span className="font-bold text-[#1A1A1A]">
                          {formData.delivery.addressLine}, {formData.delivery.city}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-black/[0.06] flex justify-between text-sm">
                        <span className="font-bold text-[#1A1A1A]">Total Due:</span>
                        <span className="font-extrabold text-[#5C3264]">PKR {pricing.grandTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Streamlined Payment Section */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-black/[0.06] shadow-sm">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#EAD9EC] flex items-center justify-center text-[#5C3264]">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A]">
                            Confirm Payment Method
                          </h3>
                          <p className="text-xs text-[#8A8A8A]">
                            Select how you'd like to pay for your tags.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mt-4">
                        {[
                          {
                            id: 'cod',
                            name: 'Cash on Delivery (COD)',
                            desc: 'Pay cash to the courier rider upon delivery anywhere in Pakistan.',
                            badge: 'Most Popular',
                          },
                          {
                            id: 'bank_transfer',
                            name: 'Direct Bank Transfer / Raast',
                            desc: 'Instant zero-fee transfer via Raast ID or Pakistani bank account.',
                            badge: 'Instant',
                          },
                          {
                            id: 'card',
                            name: 'Credit or Debit Card',
                            desc: 'Visa, Mastercard, or PayPak 256-bit encrypted checkout.',
                            badge: 'Secure',
                          },
                        ].map((method) => {
                          const isSelected = formData.paymentMethod === method.id;
                          return (
                            <div
                              key={method.id}
                              onClick={() => updateFormData({ paymentMethod: method.id as any })}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'border-[#5C3264] bg-[#5C3264]/[0.03] ring-1 ring-[#5C3264]/20'
                                  : 'border-black/[0.08] hover:border-black/30'
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs sm:text-sm text-[#1A1A1A]">
                                    {method.name}
                                  </span>
                                  <span className="text-[10px] font-semibold text-[#5C3264] bg-[#EAD9EC]/60 px-2 py-0.5 rounded-md">
                                    {method.badge}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#8A8A8A] mt-0.5">
                                  {method.desc}
                                </p>
                              </div>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                                  isSelected ? 'border-[#5C3264] bg-[#5C3264] text-white' : 'border-gray-400'
                                }`}
                              >
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Card Details Form on Page 2 */}
                      {formData.paymentMethod === 'card' && (
                        <div className="mt-5 pt-5 border-t border-black/[0.08] animate-in fade-in duration-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                              <CreditCard className="w-3.5 h-3.5 text-[#5C3264]" /> Card Details (Auto-filled Demo)
                            </span>
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
                              className="text-[10px] font-semibold text-[#5C3264] bg-[#EAD9EC]/60 hover:bg-[#EAD9EC] px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <CreditCard className="w-2.5 h-2.5" /> Auto-fill
                            </button>
                          </div>

                          {/* 3D Glass Card Preview */}
                          <div className="mb-4 max-w-sm mx-auto">
                            <Glass3DCardPreview
                              cardNumber={cardDetails.cardNumber}
                              cardHolder={cardDetails.cardHolder}
                              cardExpiry={cardDetails.cardExpiry}
                            />
                          </div>

                          <div className="space-y-2.5">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#1A1A1A] mb-1">
                                Card Number
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={cardDetails.cardNumber}
                                  onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                                    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
                                    setCardDetails({ ...cardDetails, cardNumber: formatted });
                                  }}
                                  className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-black/10 focus:border-[#5C3264] outline-none"
                                />
                                <div className="absolute right-2.5 top-2 text-[10px] font-bold text-[#5C3264] bg-[#EAD9EC]/60 px-1.5 py-0.5 rounded">
                                  VISA / MC
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] font-semibold text-[#1A1A1A] mb-1">
                                  Expiry
                                </label>
                                <input
                                  type="text"
                                  value={cardDetails.cardExpiry}
                                  onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                                    const formatted = digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
                                    setCardDetails({ ...cardDetails, cardExpiry: formatted });
                                  }}
                                  className="w-full text-xs font-mono text-center px-3 py-2 rounded-xl border border-black/10 focus:border-[#5C3264] outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-[#1A1A1A] mb-1">
                                  CVC
                                </label>
                                <input
                                  type="password"
                                  value={cardDetails.cardCvc}
                                  onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                                    setCardDetails({ ...cardDetails, cardCvc: digits });
                                  }}
                                  className="w-full text-xs font-mono text-center px-3 py-2 rounded-xl border border-black/10 focus:border-[#5C3264] outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Payment Action Button */}
                      <button
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={isSubmitting}
                        className="mt-6 w-full py-3.5 px-6 rounded-2xl bg-[#5C3264] text-white font-extrabold text-sm sm:text-base hover:bg-[#4A2851] active:scale-[0.99] transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? 'Confirming Order...' : `Place Order • PKR ${pricing.grandTotal.toLocaleString()}`}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Persistent Live Order Summary Panel (Desktop sticky + Mobile sticky) */}
              <LiveSummaryPanel
                formData={formData}
                onNext={handlePlaceOrder}
                ctaLabel={`Place Order • PKR ${pricing.grandTotal.toLocaleString()}`}
                isSubmitting={isSubmitting}
              />
            </div>
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
