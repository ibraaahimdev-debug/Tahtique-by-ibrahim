import { useState, useEffect } from 'react';
import { LandingPage } from './modules/landing/LandingPage';
import { OrderCustomisePage } from './modules/order/OrderCustomisePage';
import { CheckoutPage } from './modules/checkout/CheckoutPage';
import { OrderConfirmationPage } from './modules/confirmation/OrderConfirmationPage';
import { ContactSupportPage } from './modules/contact/ContactSupportPage';
import { AdminPortal } from './modules/admin/AdminPortal';
import { PublicScanPage } from './modules/scan/PublicScanPage';
import { INITIAL_ORDER_STATE, calculateOrderPricing } from './data/orderData';
import { MOCK_TRACKED_ORDERS } from './data/trackingData';
import {
  INITIAL_ADMIN_QR_CODES,
  getStoredAdminOrders,
  registerNewAdminOrder,
} from './data/adminMockData';
import { vehicleService } from './services/vehicleService';
import type { AdminOrder, AdminOrderStatus, AdminStaffNote } from './types/admin';
import { Shield, ExternalLink, MessageSquare } from 'lucide-react';
import type { OrderFormData } from './types/order';
import { FloatingWhatsAppButton } from './components/common/FloatingWhatsAppButton';

export type AppView =
  | 'landing'
  | 'order'
  | 'checkout'
  | 'confirmation'
  | 'tracking'
  | 'contact'
  | 'public_scan';

function getInitialScanToken(): string | null {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname;
  if (path.startsWith('/v/')) {
    const token = path.replace('/v/', '').trim();
    if (token) return token;
  }
  const hash = window.location.hash;
  if (hash.startsWith('#/v/')) {
    const token = hash.replace('#/v/', '').trim();
    if (token) return token;
  }
  if (hash.startsWith('#v/')) {
    const token = hash.replace('#v/', '').trim();
    if (token) return token;
  }
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get('v')) {
    return searchParams.get('v');
  }
  return null;
}

export function App() {
  const initialToken = getInitialScanToken();
  const [currentPortal, setCurrentPortal] = useState<'customer' | 'admin'>('customer');
  const [currentView, setCurrentView] = useState<AppView>(initialToken ? 'public_scan' : 'landing');
  const [scanToken, setScanToken] = useState<string>(initialToken || '');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pack-of-two');
  const [orderData, setOrderData] = useState<OrderFormData>(INITIAL_ORDER_STATE);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('TGT-000482');
  const [activeTrackingCode, setActiveTrackingCode] = useState<string>('TGT-000482');
  const [adminOrders, setAdminOrders] = useState<AdminOrder[]>(() => getStoredAdminOrders());

  // Listen for browser navigation changes (/v/:token)
  useEffect(() => {
    const handleUrlCheck = () => {
      const token = getInitialScanToken();
      if (token) {
        setScanToken(token);
        setCurrentView('public_scan');
      }
    };
    window.addEventListener('popstate', handleUrlCheck);
    window.addEventListener('hashchange', handleUrlCheck);
    return () => {
      window.removeEventListener('popstate', handleUrlCheck);
      window.removeEventListener('hashchange', handleUrlCheck);
    };
  }, []);

  // Navigate to Order wizard (Module 2)
  const handleStartOrder = (packageId: string) => {
    setSelectedPackageId(packageId);
    setCurrentView('order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Order from Wizard -> Go to Checkout (Module 3)
  const handleSubmitOrderToCheckout = (data: OrderFormData) => {
    setOrderData(data);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Confirm Payment in Checkout -> Go to Confirmation (Module 4)
  const handlePaymentSuccess = (newOrderId: string, confirmedData: OrderFormData) => {
    setConfirmedOrderId(newOrderId);
    setActiveTrackingCode(newOrderId);
    setOrderData(confirmedData);

    // Dynamically calculate exact pricing
    const pricing = calculateOrderPricing(
      confirmedData.packageId,
      confirmedData.materialId,
      confirmedData.quantity
    );

    const customerName =
      confirmedData.billing.billingName ||
      confirmedData.delivery.fullName ||
      confirmedData.vehicles[0]?.ownerName ||
      'Valued Customer';
    const customerEmail =
      confirmedData.billing.billingEmail || 'customer@example.com';
    const customerPhone =
      confirmedData.delivery.deliveryPhone ||
      confirmedData.vehicles[0]?.contactNumber ||
      '+92 300 0000000';

    // 1. Create and register the order into the Admin Portal
    const newAdminOrder: AdminOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderId,
      customerName,
      customerEmail,
      customerPhone,
      packageName: pricing.basePackageName,
      materialName: pricing.materialName,
      quantity: confirmedData.quantity,
      totalAmount: pricing.grandTotal,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'new',
      vehicles: confirmedData.vehicles.map((v) => ({
        plate: `${v.state || 'CA'} • ${v.vehiclePlate || '7XYZ890'}`,
        model: v.vehicleModel || 'Vehicle',
        ownerName: v.ownerName || customerName,
        contactNumber: v.contactNumber || customerPhone,
      })),
      deliveryAddress: {
        street: confirmedData.delivery.addressLine || 'Main Delivery Address',
        city: confirmedData.delivery.city || 'Islamabad',
        postalCode: confirmedData.delivery.postalCode || '44000',
      },
      courierName: 'FedEx Priority Express',
      courierTrackingCode: `FX-${Math.floor(100000000 + Math.random() * 900000000)}-PK`,
      notes: [
        {
          id: `n-${Date.now()}`,
          author: 'System (Online Store)',
          content: `Order placed online via ${confirmedData.paymentMethod ? confirmedData.paymentMethod.toUpperCase() : 'ONLINE'}. Cryptographic QR tag proxy generated.`,
          createdAt: 'Just now',
        },
      ],
    };

    // Save to admin state and storage
    registerNewAdminOrder(newAdminOrder);
    setAdminOrders((prev) => [newAdminOrder, ...prev.filter((o) => o.orderNumber !== newOrderId)]);

    // Auto-register vehicle records in vehicleService
    const registeredVehicles = confirmedData.vehicles.map((v) => {
      const parts = (v.vehiclePlate || '7XYZ890').split('•').map((s) => s.trim());
      const st = v.state || (parts.length > 1 ? parts[0] : 'CA');
      const pl = parts.length > 1 ? parts[1] : parts[0];
      return vehicleService.saveVehicle({
        id: v.id,
        plate_number: pl,
        state: st,
        vehicle_model: v.vehicleModel,
        owner_name: v.ownerName || customerName,
        owner_phone: v.contactNumber || customerPhone,
        owner_email: customerEmail,
      });
    });

    // Register QR codes for the new vehicle tags
    registeredVehicles.forEach((vRec, idx) => {
      INITIAL_ADMIN_QR_CODES.unshift({
        id: `qr-${Date.now()}-${idx}`,
        qrId: `QR-${newOrderId.replace('TGT-', '')}-${idx + 1}`,
        orderNumber: newOrderId,
        customerName,
        plateNumber: `${vRec.state} • ${vRec.plate_number}`,
        generatedDate: new Date().toISOString().split('T')[0],
        scanCount: 0,
        status: 'pending',
      });
    });

    // 2. Register into MOCK_TRACKED_ORDERS for instant live tracking
    MOCK_TRACKED_ORDERS[newOrderId.toUpperCase()] = {
      orderNumber: newOrderId,
      customerEmail,
      customerPhone,
      packageName: pricing.basePackageName,
      materialName: pricing.materialName,
      quantity: confirmedData.quantity,
      totalPaid: pricing.grandTotal,
      vehicles: confirmedData.vehicles.map((v) => ({
        plate: v.vehiclePlate || 'ICT • 492',
        model: v.vehicleModel || 'Vehicle',
        owner: v.ownerName || customerName,
      })),
      deliveryAddress: `${confirmedData.delivery.addressLine}, ${confirmedData.delivery.city} ${confirmedData.delivery.postalCode}`,
      courierName: 'FedEx Priority Express',
      courierTrackingCode: `FX-${Math.floor(100000000 + Math.random() * 900000000)}-PK`,
      estimatedDelivery: 'In 3 Business Days (Express Courier)',
      currentStageIndex: 1, // Details confirmed & Queued for printing
      stages: [
        {
          step: 1,
          label: 'Order received',
          description: 'Payment authorized & order confirmed in Tagtique system.',
          timestamp: 'Just now',
          status: 'completed',
        },
        {
          step: 2,
          label: 'Details confirmed',
          description: 'Vehicle license plate & encrypted relay proxies configured.',
          timestamp: 'In progress',
          status: 'current',
        },
        {
          step: 3,
          label: 'Printing & UV curing',
          description: 'Automotive vinyl precision cut & high-durability UV lamination.',
          timestamp: 'Queued',
          status: 'upcoming',
        },
        {
          step: 4,
          label: 'Shipped with courier',
          description: 'Handed over to express courier.',
          timestamp: 'Tomorrow',
          status: 'upcoming',
        },
        {
          step: 5,
          label: 'Delivered',
          description: 'Doorstep arrival.',
          timestamp: 'In 3 days',
          status: 'upcoming',
        },
      ],
    };

    setCurrentView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateAdminOrderStatus = (orderId: string, newStatus: AdminOrderStatus) => {
    setAdminOrders((prev) => {
      const updated = prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord));
      try {
        localStorage.setItem('tagtique_admin_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleAddAdminStaffNote = (orderId: string, note: AdminStaffNote) => {
    setAdminOrders((prev) => {
      const updated = prev.map((ord) =>
        ord.id === orderId ? { ...ord, notes: [note, ...(ord.notes || [])] } : ord
      );
      try {
        localStorage.setItem('tagtique_admin_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Direct WhatsApp contact (replaces tracking section)
  const handleNavigateToTracking = (code?: string) => {
    const text = code
      ? `Hello Tagtique! I would like an update on order ${code}.`
      : 'Hello Tagtique! I have an inquiry about my order.';
    window.open(`https://wa.me/923292082080?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Navigate to Contact Support page (Module 6)
  const handleNavigateToContact = () => {
    setCurrentView('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to Landing Page
  const handleNavigateHome = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* PORTAL 1: ADMIN PANEL (MODULES 7 - 12) */}
      {currentPortal === 'admin' ? (
        <AdminPortal
          orders={adminOrders}
          onUpdateOrderStatus={handleUpdateAdminOrderStatus}
          onAddStaffNote={handleAddAdminStaffNote}
          onSwitchToCustomerView={() => {
            setCurrentPortal('customer');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        /* PORTAL 2: CUSTOMER MARKETING & ORDERING SITE (MODULES 1 - 6) */
        <>
          {currentView === 'landing' && (
            <LandingPage
              onNavigateToOrder={handleStartOrder}
              onLoginClick={() => setCurrentPortal('admin')}
              onNavigateToTracking={handleNavigateToTracking}
              onNavigateToContact={handleNavigateToContact}
            />
          )}

          {currentView === 'order' && (
            <OrderCustomisePage
              initialPackageId={selectedPackageId}
              onSubmitOrder={handleSubmitOrderToCheckout}
              onOrderSuccess={(orderId, data) => handlePaymentSuccess(orderId, data)}
              onNavigateHome={handleNavigateHome}
              onLoginClick={() => setCurrentPortal('admin')}
              onNavigateTracking={handleNavigateToTracking}
              onNavigateSupport={handleNavigateToContact}
            />
          )}

          {currentView === 'checkout' && (
            <CheckoutPage
              orderData={orderData}
              onBackToOrder={() => {
                setCurrentView('order');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateHome={handleNavigateHome}
              onTrackOrder={handleNavigateToTracking}
              onConfirmSuccess={handlePaymentSuccess}
              onLoginClick={() => setCurrentPortal('admin')}
              onNavigateSupport={handleNavigateToContact}
            />
          )}

          {currentView === 'confirmation' && (
            <OrderConfirmationPage
              orderId={confirmedOrderId}
              orderData={orderData}
              onNavigateTracking={handleNavigateToTracking}
              onNavigateHome={handleNavigateHome}
              onLoginClick={() => setCurrentPortal('admin')}
              onNavigateSupport={handleNavigateToContact}
            />
          )}

          {currentView === 'tracking' && (
            <div className="min-h-screen bg-[#FDFBFD] flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 ring-8 ring-emerald-50/50 shadow-sm">
                <MessageSquare className="w-8 h-8 fill-current" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full mb-2">
                Direct WhatsApp Contact
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                Instant Order Support via WhatsApp
              </h1>
              <p className="text-sm text-gray-500 mt-2 max-w-md">
                Order tracking and status updates are provided directly by our dispatch team on WhatsApp for immediate 1-on-1 assistance.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/923292082080?text=${encodeURIComponent(
                    activeTrackingCode ? `Hello Tagtique! I'd like an update on order #${activeTrackingCode}.` : 'Hello Tagtique! I have an order inquiry.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Chat on WhatsApp: 0329-2082080</span>
                </a>
                <button
                  type="button"
                  onClick={handleNavigateHome}
                  className="px-6 py-3.5 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 cursor-pointer"
                >
                  Return to Homepage
                </button>
              </div>
            </div>
          )}

          {currentView === 'contact' && (
            <ContactSupportPage
              onNavigateHome={handleNavigateHome}
              onNavigateTracking={handleNavigateToTracking}
              onLoginClick={() => setCurrentPortal('admin')}
            />
          )}

          {currentView === 'public_scan' && (
            <PublicScanPage
              qrToken={scanToken}
              onNavigateHome={handleNavigateHome}
            />
          )}

          {/* Floating WhatsApp Contact Button (Always accessible for customer) */}
          <FloatingWhatsAppButton />
        </>
      )}

      {/* FLOATING QUICK SWITCHER PILL (DEVELOPMENT / DEMO HELPER) */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          type="button"
          onClick={() => {
            setCurrentPortal(currentPortal === 'customer' ? 'admin' : 'customer');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-3.5 py-2 rounded-full text-xs font-semibold shadow-xl border flex items-center gap-2 backdrop-blur-md transition-all ${
            currentPortal === 'customer'
              ? 'bg-gray-900 text-white border-gray-700 hover:bg-black'
              : 'bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] border-white/80 hover:brightness-95'
          }`}
          title="Toggle between Public Site & Internal Admin Panel"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>
            {currentPortal === 'customer'
              ? 'Switch to Admin Panel ➔'
              : 'Switch to Customer Site ➔'}
          </span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </button>
      </div>
    </>
  );
}

export default App;
