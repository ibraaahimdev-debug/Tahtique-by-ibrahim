import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Package,
  Car,
  MapPin,
  ShieldCheck,
  MessageSquare,
  Home,
  QrCode,
} from 'lucide-react';
import type { OrderFormData } from '../../../types/order';
import { calculateOrderPricing } from '../../../data/orderData';

interface OrderSuccessCardProps {
  orderId: string;
  orderData: OrderFormData;
  onNavigateHome: () => void;
  onTrackOrder?: (code: string) => void;
  onNavigateSupport?: () => void;
}

export const OrderSuccessCard: React.FC<OrderSuccessCardProps> = ({
  orderId,
  orderData,
  onNavigateHome,
  onTrackOrder: _onTrackOrder,
  onNavigateSupport: _onNavigateSupport,
}) => {
  const [copied, setCopied] = useState(false);

  const pricing = calculateOrderPricing(
    orderData.packageId,
    orderData.materialId,
    orderData.quantity
  );

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in-50 duration-300">
      {/* Celebration Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.06] shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>

        <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full mb-2">
          Order Successfully Placed
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">
          Thank You! Your Tag is Being Encoded
        </h1>
        <p className="text-sm text-[#8A8A8A] mt-2 max-w-md mx-auto">
          We have received your order. Your weatherproof smart QR tags will be printed and dispatched within 24 hours.
        </p>

        {/* Order ID Ribbon */}
        <div className="mt-5 p-3.5 rounded-2xl bg-[#F8FAFC] border border-black/[0.08] inline-flex items-center gap-3">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-[#8A8A8A] block">
              Order Reference ID
            </span>
            <span className="font-mono text-base font-extrabold text-[#5C3264]">
              {orderId}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyOrderId}
            className="p-2 rounded-xl bg-white hover:bg-gray-100 border border-black/[0.08] text-[#5C3264] transition-colors cursor-pointer"
            title="Copy Order ID"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Order Details Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.06] shadow-sm space-y-5">
        <h2 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2 border-b border-black/[0.06] pb-3">
          <Package className="w-4 h-4 text-[#5C3264]" />
          <span>Order Summary</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[#8A8A8A] block">Plan Selected:</span>
            <span className="font-bold text-[#1A1A1A] text-sm">
              {pricing.basePackageName} ({orderData.quantity} {orderData.quantity === 1 ? 'Tag' : 'Tags'})
            </span>
          </div>

          <div>
            <span className="text-[#8A8A8A] block">Badge Material:</span>
            <span className="font-bold text-[#1A1A1A] text-sm">
              {pricing.materialName}
            </span>
          </div>

          <div>
            <span className="text-[#8A8A8A] block">Payment Method:</span>
            <span className="font-bold text-[#1A1A1A] text-sm capitalize">
              {orderData.paymentMethod === 'cod'
                ? 'Cash on Delivery (COD)'
                : orderData.paymentMethod === 'bank_transfer'
                ? 'Raast / Bank Transfer'
                : 'Credit / Debit Card'}
            </span>
          </div>

          <div>
            <span className="text-[#8A8A8A] block">Total Amount Due:</span>
            <span className="font-extrabold text-base text-[#5C3264]">
              PKR {pricing.grandTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Vehicles Encoded List */}
        <div className="pt-3 border-t border-black/[0.06] space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-[#1A1A1A]">
            <span className="flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-[#5C3264]" />
              <span>Configured Vehicles ({orderData.vehicles.length})</span>
            </span>
            <span className="text-emerald-600 flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3 h-3" /> Anonymous Relay Ready
            </span>
          </div>

          <div className="space-y-2">
            {orderData.vehicles.map((v, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#F8FAFC] border border-black/[0.05] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-[#5C3264] uppercase text-xs sm:text-sm">
                    {v.vehiclePlate || `Vehicle ${i + 1}`}
                  </span>
                  <span className="text-[#8A8A8A] ml-2">
                    ({v.vehicleType || 'Car'})
                  </span>
                  <p className="text-[11px] text-[#8A8A8A] mt-0.5">
                    {v.ownerName || 'Owner'} • {v.contactNumber || 'Contact linked'}
                    {v.guardianContact && ` • Guardian: ${v.guardianContact}`}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white border border-black/[0.08] flex items-center justify-center text-[#5C3264]">
                  <QrCode className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="pt-3 border-t border-black/[0.06] flex items-start gap-2.5 text-xs">
          <MapPin className="w-4 h-4 text-[#5C3264] shrink-0 mt-0.5" />
          <div>
            <span className="text-[#8A8A8A] block">Delivering to:</span>
            <span className="font-bold text-[#1A1A1A]">
              {orderData.delivery.addressLine}, {orderData.delivery.city}
            </span>
            <span className="text-emerald-600 block text-[11px] font-medium mt-0.5">
              Free Express Courier Delivery (2-3 business days)
            </span>
          </div>
        </div>
      </div>

      {/* Next Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={`https://wa.me/923292082080?text=${encodeURIComponent(
            `Hello Tagtique! I just placed Order #${orderId} (${orderData.quantity} tag(s)). Please confirm my order dispatch.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer active:scale-98"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          <span>Contact on WhatsApp: 0329-2082080</span>
        </a>

        <button
          type="button"
          onClick={onNavigateHome}
          className="flex-1 py-3.5 px-5 rounded-2xl bg-white border border-black/[0.12] text-[#1A1A1A] font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4 text-[#8A8A8A]" />
          <span>Return to Homepage</span>
        </button>
      </div>

      {/* WhatsApp Support Callout */}
      <div className="text-center pt-2">
        <p className="text-xs text-[#8A8A8A]">
          Need instant updates or have questions?{' '}
          <a
            href="https://wa.me/923292082080"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
            Direct WhatsApp Support: 0329-2082080
          </a>
        </p>
      </div>
    </div>
  );
};
