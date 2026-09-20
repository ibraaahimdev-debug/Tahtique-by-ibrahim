import React from 'react';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import {
  CheckCircle2,
  ShieldCheck,
  Home,
  Shield,
  MessageSquare,
} from 'lucide-react';
import type { OrderFormData } from '../../../types/order';

interface OrderSuccessViewProps {
  orderId: string;
  orderData: OrderFormData;
  totalPaid: number;
  onNavigateHome: () => void;
  onTrackOrder?: (code: string) => void;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({
  orderId,
  orderData,
  totalPaid,
  onNavigateHome,
  onTrackOrder: _onTrackOrder,
}) => {
  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 animate-in zoom-in-95 duration-300">
      {/* Success Card */}
      <Card className="!p-8 sm:!p-12 text-center border border-[#EAD9EC] shadow-2xl relative overflow-hidden bg-white">
        {/* Background celebration flair */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#EAD9EC]/40 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#FFD4E9]/60 blur-2xl pointer-events-none" />

        {/* Big Check Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] flex items-center justify-center shadow-[0_10px_30px_rgba(234,217,236,0.7)] mb-6 border border-white/80">
          <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#5C3264] text-white flex items-center justify-center border border-white/60">
            <Shield className="w-3 h-3" />
          </div>
        </div>

        <span className="inline-block text-xs font-semibold text-[#5C3264] uppercase tracking-wider bg-[#EAD9EC]/60 px-3.5 py-1 rounded-full mb-3 border border-[#EAD9EC]">
          Payment Confirmed
        </span>

        <h2 className="text-2xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight mb-2">
          Your Tagtique Order Is Placed!
        </h2>
        <p className="text-sm sm:text-base text-[#8A8A8A] max-w-lg mx-auto mb-8">
          Thank you for choosing Tagtique. We've queued your custom QR tags for precision printing and UV lamination.
        </p>

        {/* Order Reference Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F7EBEF]/70 border border-[#EAD9EC] max-w-md mx-auto mb-8 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[11px] text-[#8A8A8A] uppercase font-semibold tracking-wider">
              Order Reference ID
            </span>
            <p className="text-lg font-bold text-[#1A1A1A] tracking-wider font-mono">
              #{orderId}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#8A8A8A] uppercase font-semibold tracking-wider">
              Total Amount
            </span>
            <p className="text-lg font-bold text-[#5C3264]">
              PKR {totalPaid.toLocaleString()}
            </p>
          </div>
        </div>

        {/* 3-Step Production Timeline */}
        <div className="border-t border-b border-black/[0.06] py-6 my-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EAD9EC]/60 text-[#5C3264] border border-[#EAD9EC] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              1
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1A1A1A]">Encoding & Print</p>
              <p className="text-[11px] text-[#8A8A8A] mt-0.5">
                UV-curing adhesive vinyl and generating unique relay proxies.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EAD9EC]/60 text-[#5C3264] border border-[#EAD9EC] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              2
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1A1A1A]">Courier Dispatch</p>
              <p className="text-[11px] text-[#8A8A8A] mt-0.5">
                Handed to express mailer within 24 hours.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EAD9EC]/60 text-[#5C3264] border border-[#EAD9EC] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              3
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1A1A1A]">Doorstep Arrival</p>
              <p className="text-[11px] text-[#8A8A8A] mt-0.5">
                Ready to stick onto your windshield in seconds.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Details */}
        <div className="p-5 rounded-2xl bg-gray-50 border border-black/[0.04] text-left text-xs space-y-2 mb-8">
          <div className="flex justify-between">
            <span className="text-[#8A8A8A]">Recipient:</span>
            <span className="font-semibold text-[#1A1A1A]">
              {orderData.delivery.fullName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8A8A8A]">Ship To:</span>
            <span className="font-semibold text-[#1A1A1A]">
              {orderData.delivery.addressLine}, {orderData.delivery.city}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8A8A8A]">Vehicles Registered:</span>
            <span className="font-semibold text-[#5C3264] uppercase">
              {orderData.vehicles.map((v) => v.vehiclePlate).filter(Boolean).join(', ') || 'Pending'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8A8A8A]">Privacy Routing:</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Active on delivery
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={onNavigateHome}
            icon={<Home className="w-4 h-4" />}
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Back to Home
          </Button>
          <a
            href={`https://wa.me/923292082080?text=${encodeURIComponent(
              `Hello Tagtique! I placed Order #${orderId}. Please update me on my order.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer active:scale-98"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Contact on WhatsApp: 0329-2082080</span>
          </a>
        </div>
      </Card>
    </div>
  );
};
