import React, { useState, useEffect } from 'react';
import { AdminStatusBadge } from './components/AdminStatusBadge';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  QrCode,
  Clock,
  Printer,
  Truck,
  CheckCircle,
  Save,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import type { AdminOrder, AdminOrderStatus, AdminStaffNote } from '../../types/admin';
import { vehicleService, buildPublicScanUrl } from '../../services/vehicleService';
import type { VehicleRecord } from '../../types/vehicle';
import { VehicleQRTag } from '../../components/common/VehicleQRTag';

interface OrderDetailPageProps {
  order: AdminOrder;
  onBack: () => void;
  onUpdateStatus: (orderId: string, status: AdminOrderStatus) => void;
  onAddNote: (orderId: string, note: AdminStaffNote) => void;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({
  order,
  onBack,
  onUpdateStatus,
  onAddNote,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [vehicles, setVehicles] = useState<VehicleRecord[]>(() => vehicleService.getAllVehicles());
  const [showRegenModal, setShowRegenModal] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    return vehicleService.subscribe(setVehicles);
  }, []);

  const firstPlate = order.vehicles[0]?.plate || '7XYZ890';
  const parts = firstPlate.split('•').map((s) => s.trim());
  const stateCode = parts.length > 1 ? parts[0] : 'CA';
  const rawPlate = parts.length > 1 ? parts[1] : parts[0];

  const matchedVehicle =
    vehicles.find(
      (v) =>
        v.plate_number.toUpperCase() === rawPlate.toUpperCase() ||
        firstPlate.toUpperCase().includes(v.plate_number.toUpperCase())
    ) ||
    vehicleService.saveVehicle({
      plate_number: rawPlate,
      state: stateCode,
      vehicle_model: order.vehicles[0]?.model,
      owner_name: order.customerName,
      owner_phone: order.customerPhone,
      owner_email: order.customerEmail,
    });

  const stages: Array<{ id: AdminOrderStatus; label: string; icon: React.ReactNode }> = [
    { id: 'new', label: 'Order Received', icon: <Clock className="w-4 h-4" /> },
    { id: 'printing', label: 'Printing & UV', icon: <Printer className="w-4 h-4" /> },
    { id: 'shipped', label: 'Dispatched', icon: <Truck className="w-4 h-4" /> },
    { id: 'delivered', label: 'Delivered', icon: <CheckCircle className="w-4 h-4" /> },
  ];

  const currentStageIndex = stages.findIndex((s) => s.id === order.status);

  const handleStageClick = (status: AdminOrderStatus) => {
    onUpdateStatus(order.id, status);
  };

  // Stub function: onSaveNotes()
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote: AdminStaffNote = {
      id: `note-${Date.now()}`,
      author: 'Operations Staff',
      content: newNoteText.trim(),
      createdAt: 'Just now',
    };

    onAddNote(order.id, newNote);
    setNewNoteText('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back button & Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
            title="Back to Orders"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 font-mono">
                Order #{order.orderNumber}
              </h2>
              <AdminStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Placed on {order.orderDate} • Paid (PKR {order.totalAmount.toLocaleString()})
            </p>
          </div>
        </div>

        {/* Status Action Controls */}
        <div className="flex items-center gap-2">
          {order.status === 'new' && (
            <button
              type="button"
              onClick={() => handleStageClick('printing')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Send to Printing Queue</span>
            </button>
          )}

          {order.status === 'printing' && (
            <button
              type="button"
              onClick={() => handleStageClick('shipped')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] hover:opacity-90 transition-opacity shadow-xs flex items-center gap-1.5 border border-white/80"
            >
              <Truck className="w-3.5 h-3.5 text-[#5C3264]" />
              <span>Mark as Dispatched</span>
            </button>
          )}

          {order.status === 'shipped' && (
            <button
              type="button"
              onClick={() => handleStageClick('delivered')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Confirm Delivered</span>
            </button>
          )}
        </div>
      </div>

      {/* Stage Progression Timeline Banner */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-4">
          Fulfillment Stage Control
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stages.map((stage, idx) => {
            const isCompleted = currentStageIndex >= idx;
            const isCurrent = order.status === stage.id;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => handleStageClick(stage.id)}
                className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'border-[#EAD9EC] bg-[#EAD9EC]/30 ring-1 ring-[#EAD9EC]'
                    : isCompleted
                    ? 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`p-1.5 rounded-md ${isCurrent ? 'bg-gradient-to-br from-[#D6E0F5] to-[#EAD9EC] text-[#5C3264]' : 'bg-gray-100 text-gray-600'}`}>
                    {stage.icon}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-gray-400">
                    Step 0{idx + 1}
                  </span>
                </div>
                <div>
                  <span className={`font-semibold text-xs block ${isCurrent ? 'text-[#5C3264]' : 'text-gray-900'}`}>
                    {stage.label}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {isCurrent ? 'Current Active Stage' : isCompleted ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Information Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer & QR Encoding Data */}
        <div className="lg:col-span-8 space-y-6">
          {/* QR Data to Encode Card */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#5C3264]" />
                <h3 className="font-semibold text-sm text-gray-900">
                  QR Data to Encode in Physical Sticker ({order.vehicles.length} Tag{order.vehicles.length > 1 ? 's' : ''})
                </h3>
              </div>
              <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                100% Relayed Format
              </span>
            </div>

            <div className="space-y-3">
              {order.vehicles.map((v, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#5C3264]">Tag #{i + 1}</span>
                      <span className="font-mono font-bold text-sm text-gray-900 uppercase">
                        {v.plate}
                      </span>
                      {v.model && (
                        <span className="text-gray-500">({v.model})</span>
                      )}
                    </div>
                    <p className="text-gray-500 mt-1">
                      Registered Owner: <strong className="text-gray-800">{v.ownerName}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded border border-gray-200 shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[#5C3264]" />
                    <div>
                      <span className="text-[10px] text-gray-400 block leading-tight">Raw Phone to Mask:</span>
                      <span className="font-mono font-medium text-gray-800">{v.contactNumber}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Details & Delivery Card */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
            <h3 className="font-semibold text-sm text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#5C3264]" />
              <span>Customer Information & Shipping Destination</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block mb-0.5">Customer Name:</span>
                <p className="font-semibold text-gray-900">{order.customerName}</p>
              </div>

              <div>
                <span className="text-gray-400 block mb-0.5">Email Address:</span>
                <p className="font-mono text-gray-800 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{order.customerEmail}</span>
                </p>
              </div>

              <div>
                <span className="text-gray-400 block mb-0.5">Contact Number:</span>
                <p className="font-mono text-gray-800 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{order.customerPhone}</span>
                </p>
              </div>

              <div>
                <span className="text-gray-400 block mb-0.5">Shipping Destination:</span>
                <p className="font-medium text-gray-800 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span>
                    {order.deliveryAddress.street}, {order.deliveryAddress.city}{' '}
                    {order.deliveryAddress.postalCode}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Internal Staff Notes Card */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
            <h3 className="font-semibold text-sm text-gray-900 border-b border-gray-100 pb-3 mb-4">
              Internal Staff Notes
            </h3>

            {/* Existing Notes List */}
            {order.notes && order.notes.length > 0 ? (
              <div className="space-y-2 mb-4">
                {order.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                      <span className="font-semibold text-gray-700">{note.author}</span>
                      <span>{note.createdAt}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{note.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic mb-4">
                No internal staff notes recorded yet.
              </p>
            )}

            {/* Add New Note Textarea */}
            <form onSubmit={handleSaveNote} className="space-y-3">
              <textarea
                rows={3}
                placeholder="Add an internal fulfillment or support note for this order..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="w-full p-3 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#B89BBF] bg-white text-gray-900"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="px-3.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-900 text-white text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Staff Note</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: QR Code Preview & Package Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* QR Code Physical Print Asset Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs text-center flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3.5">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                Physical Windshield QR Tag
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Asset Ready
              </span>
            </div>

            {/* User-Styled 3x3 Physical Windshield Tag with Daylight (Reflective) vs Night (Glow) Mode Switcher */}
            <VehicleQRTag
              qrValue={matchedVehicle?.qr_token ? buildPublicScanUrl(matchedVehicle.qr_token) : '89640001017048964000101704'}
              plateNumber={matchedVehicle?.plate_number}
              state={matchedVehicle?.state}
              showModeSwitcher={true}
              showDownload={true}
            />

            {/* Token ID & Admin Actions */}
            <div className="w-full max-w-72 mt-3.5 pt-3 border-t border-gray-100 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 px-1">
                <span>Cryptographic Token:</span>
                <span className="text-gray-700 font-semibold">{matchedVehicle?.qr_token?.slice(0, 14)}...</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Admin Regenerate Tag Button */}
                <button
                  type="button"
                  onClick={() => setShowRegenModal(true)}
                  className="py-1.5 px-2.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/60 text-amber-800 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                  title="Lost sticker replacement (revokes old QR)"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Regenerate Tag</span>
                </button>

                {/* Test Public Scan Page */}
                {matchedVehicle?.qr_token && (
                  <a
                    href={`/v/${matchedVehicle.qr_token}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-2.5 rounded-xl border border-[#EAD9EC] bg-[#F7EBEF]/40 hover:bg-[#EAD9EC]/60 text-[#5C3264] text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                    title="Preview masked driver scan view"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Test Scan Page</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Package & Billing Breakdown */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-3 text-xs">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 font-semibold text-gray-900">
              <Package className="w-4 h-4 text-[#5C3264]" />
              <span>Package & Billing</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Package Tier:</span>
              <span className="font-semibold text-gray-900">{order.packageName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Sticker Material:</span>
              <span className="font-semibold text-gray-900">{order.materialName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Quantity Printed:</span>
              <span className="font-semibold text-gray-900">{order.quantity} units</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Courier Tracking:</span>
              <span className="font-mono text-[#5C3264] font-semibold">
                {order.courierTrackingCode || 'Assigned on dispatch'}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between text-sm font-bold text-gray-900">
              <span>Total Paid:</span>
              <span className="text-[#5C3264]">PKR {order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin QR Invalidation & Regeneration Confirmation Modal */}
      {showRegenModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-gray-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Invalidate & Regenerate QR Tag?
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                This will <strong className="text-amber-700">invalidate the old physical sticker</strong>. The existing QR token ({matchedVehicle.qr_token.slice(0, 8)}...) will be permanently marked as revoked, and any previous prints will display a decommissioned notice when scanned.
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Vehicle:</span>
                <span className="font-mono font-bold text-gray-900">{matchedVehicle.state} · {matchedVehicle.plate_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Action:</span>
                <span className="text-emerald-700 font-semibold">Generate new cryptographic token</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowRegenModal(false)}
                disabled={isRegenerating}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isRegenerating}
                onClick={() => {
                  setIsRegenerating(true);
                  setTimeout(() => {
                    vehicleService.regenerateQR(matchedVehicle.id, 'admin_replacement');
                    setIsRegenerating(false);
                    setShowRegenModal(false);
                  }, 400);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                {isRegenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Yes, Invalidate & Issue New Tag</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
