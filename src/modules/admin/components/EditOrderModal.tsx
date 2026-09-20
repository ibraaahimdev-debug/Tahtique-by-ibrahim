import React, { useState } from 'react';
import { X, Save, ShieldAlert, Check, RefreshCw } from 'lucide-react';
import type { AdminOrderRow } from '../../../services/orderBackendService';

interface EditOrderModalProps {
  orderRow: AdminOrderRow;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: {
    tag_id: string;
    customer_id?: string;
    vehicle_id?: string;
    order_id?: string;
    customer_name: string;
    phone_number: string;
    guardian_number: string;
    vehicle_number: string;
    vehicle_type: string;
    status: 'pending' | 'printed' | 'shipped' | 'active' | 'inactive';
    tag_material: string;
    payment_status: string;
    delivery_status: string;
  }) => Promise<void>;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({
  orderRow,
  isOpen,
  onClose,
  onSave,
}) => {
  const [customerName, setCustomerName] = useState(orderRow.customer_name);
  const [phoneNumber, setPhoneNumber] = useState(orderRow.phone_number);
  const [guardianNumber, setGuardianNumber] = useState(orderRow.guardian_number || '');
  const [vehicleNumber, setVehicleNumber] = useState(orderRow.vehicle_number);
  const [vehicleType, setVehicleType] = useState(orderRow.vehicle_type || 'Car');
  const [tagStatus, setTagStatus] = useState<'pending' | 'printed' | 'shipped' | 'active' | 'inactive'>(orderRow.status);
  const [tagMaterial, setTagMaterial] = useState(orderRow.tag_material || 'vinyl');
  const [paymentStatus, setPaymentStatus] = useState(orderRow.payment_status || 'paid');
  const [deliveryStatus, setDeliveryStatus] = useState(orderRow.delivery_status || 'processing');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        tag_id: orderRow.tag_id,
        customer_id: orderRow.customer_id,
        vehicle_id: orderRow.vehicle_id,
        order_id: orderRow.order_id,
        customer_name: customerName,
        phone_number: phoneNumber,
        guardian_number: guardianNumber,
        vehicle_number: vehicleNumber,
        vehicle_type: vehicleType,
        status: tagStatus,
        tag_material: tagMaterial,
        payment_status: paymentStatus,
        delivery_status: deliveryStatus,
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error('Failed to update record:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-white rounded-3xl w-full max-w-xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#5C3264] bg-[#5C3264]/10 px-2 py-0.5 rounded">
                #{orderRow.order_number}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Tag ID: {orderRow.tag_id.slice(0, 8)}...
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mt-1">
              Edit Order & QR Tag Record
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Banner */}
        <div className="px-6 py-2.5 bg-[#EAD9EC]/30 border-b border-[#EAD9EC]/60 flex items-center gap-2.5 text-xs text-[#5C3264]">
          <ShieldAlert className="w-4 h-4 shrink-0 text-[#5C3264]" />
          <span>
            <strong>Instant Token Relay:</strong> Changes write directly to Supabase. Physical QR stickers stay permanently valid without reprinting!
          </span>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Customer Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider border-b border-gray-100 pb-1">
              Customer Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Full Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#5C3264] focus:ring-1 focus:ring-[#5C3264] text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Primary Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#5C3264] focus:ring-1 focus:ring-[#5C3264] text-xs bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">
                Guardian / Emergency Number (Optional Fallback)
              </label>
              <input
                type="text"
                placeholder="e.g. 0321-0000000"
                value={guardianNumber}
                onChange={(e) => setGuardianNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#5C3264] focus:ring-1 focus:ring-[#5C3264] text-xs bg-white"
              />
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider border-b border-gray-100 pb-1">
              Vehicle & Plate Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Vehicle Plate / Number *
                </label>
                <input
                  type="text"
                  required
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl font-mono uppercase font-bold text-gray-900 focus:outline-none focus:border-[#5C3264] focus:ring-1 focus:ring-[#5C3264] text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Vehicle Type / Model
                </label>
                <input
                  type="text"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  placeholder="e.g. Sedan (Civic)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#5C3264] focus:ring-1 focus:ring-[#5C3264] text-xs bg-white"
                />
              </div>
            </div>
          </div>

          {/* Tag & Order Status */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider border-b border-gray-100 pb-1">
              Tag Status & Fulfillment
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Tag Status
                </label>
                <select
                  value={tagStatus}
                  onChange={(e) => setTagStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#5C3264] text-xs bg-white font-medium text-gray-800"
                >
                  <option value="pending">Pending</option>
                  <option value="printed">Printed</option>
                  <option value="shipped">Shipped</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Tag Material
                </label>
                <select
                  value={tagMaterial}
                  onChange={(e) => setTagMaterial(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#5C3264] text-xs bg-white font-medium text-gray-800"
                >
                  <option value="vinyl">Weatherproof Vinyl</option>
                  <option value="acrylic">UV Acrylic Badge</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#5C3264] text-xs bg-white font-medium text-gray-800"
                >
                  <option value="paid">Paid</option>
                  <option value="cod">Cash on Delivery</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Delivery Status
                </label>
                <select
                  value={deliveryStatus}
                  onChange={(e) => setDeliveryStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#5C3264] text-xs bg-white font-medium text-gray-800"
                >
                  <option value="processing">Processing</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-semibold text-xs cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-[#5C3264] hover:bg-[#4a2850] text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving to Supabase...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
