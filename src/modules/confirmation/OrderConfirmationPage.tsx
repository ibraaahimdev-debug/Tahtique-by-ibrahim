import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { PRICING_PACKAGES } from '../../data/mockData';
import { TAG_MATERIALS } from '../../data/orderData';
import {
  CheckCircle2,
  ShieldCheck,
  Package,
  Truck,
  Car,
  MapPin,
  Clock,
  Printer,
  Shield,
  Home,
  Check,
  MessageSquare,
  Download,
} from 'lucide-react';
import type { OrderFormData } from '../../types/order';
import { orderBackendService } from '../../services/orderBackendService';

interface OrderConfirmationPageProps {
  orderId?: string;
  orderData: OrderFormData;
  onNavigateTracking?: (orderId?: string) => void;
  onNavigateHome: () => void;
  onLoginClick?: () => void;
  onNavigateSupport?: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  orderId = 'TGT-000482',
  orderData,
  onNavigateTracking: _onNavigateTracking,
  onNavigateHome,
  onLoginClick,
  onNavigateSupport: _onNavigateSupport,
}) => {
  const selectedPackage =
    PRICING_PACKAGES.find((p) => p.id === orderData.packageId) || PRICING_PACKAGES[1];
  const selectedMaterial =
    TAG_MATERIALS.find((m) => m.id === orderData.materialId) || TAG_MATERIALS[0];

  const basePrice = selectedPackage.price;
  const materialUpgradeCost = selectedMaterial.extraPrice * orderData.quantity;
  const grandTotal = basePrice + materialUpgradeCost;

  const [downloadingIndex, setDownloadingIndex] = React.useState<number | null>(null);

  const handleOpenWhatsApp = () => {
    window.open('https://wa.me/923292082080', '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTag = async (idx: number, plate: string, type: string) => {
    setDownloadingIndex(idx);
    try {
      const token = `token-${orderId.toLowerCase()}-${idx + 1}-${plate.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      await orderBackendService.downloadTagQRPng(token, plate, type);
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setDownloadingIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col selection:bg-[#EAD9EC] selection:text-[#5C3264] relative overflow-hidden">
      {/* Top Navbar */}
      <Navbar
        isLanding={false}
        onLogin={onLoginClick}
        onHomeClick={onNavigateHome}
        onTrackClick={handleOpenWhatsApp}
        onSupportClick={handleOpenWhatsApp}
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full relative z-10">
        {/* Success Hero Badge & Checkmark Illustration */}
        <div className="text-center space-y-4 mb-10">
          <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] flex items-center justify-center shadow-[0_15px_35px_rgba(234,217,236,0.7)] animate-float border border-white/80">
            <CheckCircle2 className="w-12 h-12 stroke-[2.2]" />
            <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#5C3264] text-white flex items-center justify-center shadow-sm border border-white/60">
              <Shield className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 border border-[#EAD9EC] text-xs font-semibold text-[#5C3264] uppercase tracking-wider backdrop-blur-xs">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Order Confirmed & Queued</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1A1A1A] tracking-tight">
            Thank You for Your Order!
          </h1>
          <p className="text-base sm:text-lg text-[#8A8A8A] max-w-xl mx-auto leading-relaxed">
            Your Tagtique physical QR stickers are being queued for precision printing and automotive-grade UV coating.
          </p>
        </div>

        {/* Order Identifier Banner */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-[#EAD9EC] shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs text-[#8A8A8A] font-semibold uppercase tracking-wider">
              Order Reference Number
            </span>
            <div className="flex items-center gap-2 mt-0.5 justify-center sm:justify-start">
              <span className="text-2xl font-mono font-bold text-[#1A1A1A]">
                #{orderId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAD9EC]/60 text-[#5C3264] border border-[#EAD9EC]">
                Paid & Active
              </span>
            </div>
          </div>

          {/* Primary Track Action */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              onClick={handlePrint}
              icon={<Printer className="w-4 h-4" />}
              className="flex-1 sm:flex-initial"
            >
              Print Receipt
            </Button>
            <a
              href={`https://wa.me/923292082080?text=${encodeURIComponent(
                `Hello Tagtique! I placed Order #${orderId}. Please confirm my order dispatch.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-5 py-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp: 0329-2082080</span>
            </a>
          </div>
        </div>

        {/* Estimated Delivery & Timeline Text */}
        <Card className="!p-6 border border-black/[0.04] mb-8 bg-white/95">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAD9EC]/60 text-[#5C3264] flex items-center justify-center shrink-0 mt-0.5 border border-[#EAD9EC]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1A1A1A]">
                Estimated Delivery: 3–5 Business Days
              </h3>
              <p className="text-xs sm:text-sm text-[#8A8A8A] mt-1 leading-relaxed">
                Your order is scheduled for dispatch within <strong className="text-[#1A1A1A]">24 hours</strong> via Express Courier. You will receive an automated SMS & email dispatch notification as soon as the package is handed to the mailer.
              </p>
            </div>
          </div>
        </Card>

        {/* Summary of What Was Ordered & Details Submitted */}
        <Card className="!p-6 sm:!p-8 border border-black/[0.04] shadow-md bg-white space-y-6 mb-8">
          <div className="flex items-center justify-between border-b border-black/[0.05] pb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#5C3264]" />
              <h3 className="font-semibold text-lg text-[#1A1A1A]">
                Order & Configuration Summary
              </h3>
            </div>
            <span className="text-sm font-semibold text-[#5C3264]">
              Total: PKR {grandTotal.toLocaleString()}
            </span>
          </div>

          {/* Product Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pb-4 border-b border-black/[0.05]">
            <div>
              <span className="text-[#8A8A8A] block mb-0.5 text-xs">Package Plan:</span>
              <span className="font-semibold text-[#1A1A1A]">{selectedPackage.name}</span>
            </div>
            <div>
              <span className="text-[#8A8A8A] block mb-0.5 text-xs">Sticker Material:</span>
              <span className="font-semibold text-[#1A1A1A]">{selectedMaterial.name}</span>
            </div>
            <div>
              <span className="text-[#8A8A8A] block mb-0.5 text-xs">Total Quantity:</span>
              <span className="font-semibold text-[#1A1A1A]">{orderData.quantity} Physical QR Tag(s)</span>
            </div>
            <div>
              <span className="text-[#8A8A8A] block mb-0.5 text-xs">Shipping Method:</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <Truck className="w-4 h-4" />
                Complimentary Express Courier (FREE)
              </span>
            </div>
          </div>

          {/* Configured Vehicle Profiles */}
          <div className="space-y-3 pb-4 border-b border-black/[0.05]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">
              <Car className="w-4 h-4 text-[#5C3264]" />
              <span>Vehicles Encoded in QR ({orderData.vehicles.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {orderData.vehicles.map((v, i) => {
                const isDownloading = downloadingIndex === i;
                const plateText = v.vehiclePlate || 'Plate set';
                return (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-[#EAD9EC]/20 border border-[#EAD9EC]/50 text-xs flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#5C3264]">#{i + 1}</span>
                        <span className="font-bold text-[#1A1A1A] uppercase tracking-wider">
                          {plateText}
                        </span>
                      </div>
                      <p className="text-[#8A8A8A] mt-0.5">
                        Owner: <span className="text-[#1A1A1A]">{v.ownerName || 'Customer'}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        disabled={isDownloading}
                        onClick={() => handleDownloadTag(i, plateText, v.vehicleType || 'Car')}
                        className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-gray-50 border border-[#5C3264]/20 text-[#5C3264] font-bold text-[11px] transition-all flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                        title="Download print-ready QR PNG"
                      >
                        <Download className={`w-3 h-3 ${isDownloading ? 'animate-bounce' : ''}`} />
                        <span>{isDownloading ? '...' : 'Download QR'}</span>
                      </button>

                      <div className="flex items-center gap-1 text-[11px] text-[#5C3264] bg-white px-2 py-1 rounded-lg border border-[#EAD9EC] shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Destination */}
          <div className="text-xs sm:text-sm space-y-1">
            <div className="flex items-center gap-1 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4 text-[#5C3264]" />
              <span>Delivery Address</span>
            </div>
            <p className="font-semibold text-[#1A1A1A]">
              {orderData.delivery.fullName}
            </p>
            <p className="text-[#8A8A8A]">
              {orderData.delivery.addressLine}, {orderData.delivery.city} {orderData.delivery.postalCode}
            </p>
            <p className="text-[#8A8A8A]">
              Courier Updates Phone: <span className="text-[#1A1A1A] font-medium">{orderData.delivery.deliveryPhone}</span>
            </p>
          </div>
        </Card>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="outline"
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
              `Hello Tagtique! I placed Order #${orderId}. Please confirm my order dispatch.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer active:scale-98"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Contact on WhatsApp: 0329-2082080</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <Footer
        onTrackOrder={handleOpenWhatsApp}
        onAdminClick={onLoginClick}
        onContactClick={handleOpenWhatsApp}
        onHomeClick={onNavigateHome}
      />
    </div>
  );
};
