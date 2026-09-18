import React from 'react';
import { Card } from '../../../components/common/Card';
import { Package, Truck, Car, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import type { TrackedOrder } from '../../../data/trackingData';

interface TrackingOrderRecapProps {
  order: TrackedOrder;
}

export const TrackingOrderRecap: React.FC<TrackingOrderRecapProps> = ({ order }) => {
  return (
    <Card className="!p-6 sm:!p-8 border border-black/[0.05] shadow-sm bg-white space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/[0.06] pb-4 gap-2">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-[#5C3264]" />
          <h3 className="font-semibold text-lg text-[#1A1A1A]">
            Shipment Contents & Specifications
          </h3>
        </div>
        <span className="text-xs font-semibold text-[#5C3264] bg-[#EAD9EC]/60 px-3 py-1 rounded-full w-fit border border-[#EAD9EC]">
          {order.packageName} • {order.quantity} QR Tag{order.quantity > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
        <div>
          <span className="text-[#8A8A8A] block mb-0.5 text-xs">Material Format:</span>
          <span className="font-semibold text-[#1A1A1A]">{order.materialName}</span>
        </div>
        <div>
          <span className="text-[#8A8A8A] block mb-0.5 text-xs">Courier Carrier:</span>
          <span className="font-semibold text-[#1A1A1A] flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-[#5C3264]" />
            {order.courierName}
          </span>
        </div>
        <div>
          <span className="text-[#8A8A8A] block mb-0.5 text-xs">Waybill / Airbill:</span>
          <span className="font-mono font-medium text-[#5C3264] flex items-center gap-1">
            {order.courierTrackingCode}
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
        <div>
          <span className="text-[#8A8A8A] block mb-0.5 text-xs">Target Arrival:</span>
          <span className="font-semibold text-emerald-600">{order.estimatedDelivery}</span>
        </div>
      </div>

      {/* Encoded Vehicle List */}
      <div className="pt-2 border-t border-black/[0.05]">
        <span className="text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider block mb-3 flex items-center gap-1.5">
          <Car className="w-4 h-4 text-[#5C3264]" />
          <span>Vehicle License Plates Linked ({order.vehicles.length})</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {order.vehicles.map((v, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl bg-[#EAD9EC]/20 border border-[#EAD9EC]/50 text-xs flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-xs text-[#1A1A1A] uppercase tracking-wider">
                  {v.plate}
                </span>
                {v.model && (
                  <p className="text-[11px] text-[#8A8A8A]">{v.model}</p>
                )}
                <p className="text-[11px] text-[#8A8A8A]">Owner: {v.owner}</p>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-[#5C3264] bg-white px-2 py-0.5 rounded-md border border-[#EAD9EC]">
                <ShieldCheck className="w-3 h-3" />
                <span>Masked</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Destination */}
      <div className="pt-2 border-t border-black/[0.05] text-xs space-y-1">
        <span className="text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider block mb-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#5C3264]" />
          <span>Destination Address</span>
        </span>
        <p className="font-medium text-[#1A1A1A]">{order.deliveryAddress}</p>
        <p className="text-[#8A8A8A]">Recipient: {order.customerEmail} • {order.customerPhone}</p>
      </div>
    </Card>
  );
};
