import React, { useState, useMemo, useEffect } from 'react';
import { Search, QrCode, RefreshCw, Download, Check, ExternalLink } from 'lucide-react';
import { INITIAL_ADMIN_QR_CODES } from '../../data/adminMockData';
import type { AdminQRCodeItem } from '../../types/admin';
import { vehicleService } from '../../services/vehicleService';
import { orderBackendService } from '../../services/orderBackendService';
import type { VehicleRecord } from '../../types/vehicle';

interface QRCodeManagementPageProps {
  onSelectOrderNumber: (orderNumber: string) => void;
}

export const QRCodeManagementPage: React.FC<QRCodeManagementPageProps> = ({
  onSelectOrderNumber,
}) => {
  const [qrItems, setQrItems] = useState<AdminQRCodeItem[]>(INITIAL_ADMIN_QR_CODES);
  const [vehicles, setVehicles] = useState<VehicleRecord[]>(() => vehicleService.getAllVehicles());
  const [searchTerm, setSearchTerm] = useState('');
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  useEffect(() => {
    return vehicleService.subscribe(setVehicles);
  }, []);

  const filteredQRs = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return qrItems;
    return qrItems.filter(
      (item) =>
        item.qrId.toLowerCase().includes(q) ||
        item.orderNumber.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.plateNumber.toLowerCase().includes(q)
    );
  }, [qrItems, searchTerm]);

  // Admin tag regeneration: invalidates old QR & generates new cryptographic token
  const handleRegenerate = (id: string, plateNumber: string) => {
    setRegeneratingId(id);
    const foundVeh = vehicles.find(
      (v) =>
        v.plate_number.toUpperCase() === plateNumber.replace(/[^A-Za-z0-9]/g, '').toUpperCase() ||
        plateNumber.toUpperCase().includes(v.plate_number.toUpperCase())
    );

    if (foundVeh) {
      vehicleService.regenerateQR(foundVeh.id, 'admin_manual_regeneration');
    }

    setTimeout(() => {
      setQrItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: 'active', generatedDate: 'Just now' }
            : item
        )
      );
      setRegeneratingId(null);
    }, 600);
  };

  // Download real vector SVG or PNG badge
  const handleDownload = async (item: AdminQRCodeItem) => {
    setDownloadedId(item.id);
    const foundVeh = vehicles.find(
      (v) =>
        v.plate_number.toUpperCase() === item.plateNumber.replace(/[^A-Za-z0-9]/g, '').toUpperCase() ||
        item.plateNumber.toUpperCase().includes(v.plate_number.toUpperCase())
    );

    if (foundVeh?.qr_svg_url && foundVeh.qr_svg_url.startsWith('http')) {
      const a = document.createElement('a');
      a.href = foundVeh.qr_svg_url;
      a.download = `TAHTIQUE-${foundVeh.state}-${foundVeh.plate_number}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      await orderBackendService.downloadTagQRPng(
        foundVeh?.qr_token || `token-${item.qrId.toLowerCase()}`,
        item.plateNumber
      );
    }

    setTimeout(() => {
      setDownloadedId(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            QR Code Asset Inventory
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Cryptographic proxy tokens generated and etched onto physical vehicle stickers
          </p>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Active Assets: <strong className="text-gray-900">{qrItems.length}</strong>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-xs max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by QR ID, Order #, Customer, or Plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#B89BBF] bg-white"
          />
        </div>
      </div>

      {/* QR Code Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3">Asset Preview</th>
                <th className="px-6 py-3">QR Identifier</th>
                <th className="px-6 py-3">Linked Order #</th>
                <th className="px-6 py-3">Vehicle Plate</th>
                <th className="px-6 py-3">Linked Customer</th>
                <th className="px-6 py-3">Total Scans</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredQRs.map((item) => {
                const isRegenerating = regeneratingId === item.id;
                const isDownloaded = downloadedId === item.id;

                const matchedVeh = vehicles.find(
                  (v) =>
                    v.plate_number.toUpperCase() === item.plateNumber.replace(/[^A-Za-z0-9]/g, '').toUpperCase() ||
                    item.plateNumber.toUpperCase().includes(v.plate_number.toUpperCase())
                );

                return (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Thumbnail QR Graphic */}
                    <td className="px-6 py-3.5">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 p-1 flex items-center justify-center text-gray-800 relative shadow-xs overflow-hidden">
                        {matchedVeh?.qr_svg_url ? (
                          <img
                            src={matchedVeh.qr_svg_url}
                            alt="QR thumbnail"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <QrCode className="w-6 h-6 text-gray-900" />
                        )}
                        <span className="w-2 h-2 rounded-full bg-[#5C3264] absolute bottom-1 right-1" />
                      </div>
                    </td>

                    {/* QR Identifier */}
                    <td className="px-6 py-3.5 font-mono font-semibold text-gray-900">
                      {item.qrId}
                    </td>

                    {/* Linked Order */}
                    <td className="px-6 py-3.5">
                      <button
                        type="button"
                        onClick={() => onSelectOrderNumber(item.orderNumber)}
                        className="font-mono text-[#5C3264] font-semibold hover:text-[#7A2840] hover:underline"
                      >
                        #{item.orderNumber}
                      </button>
                    </td>

                    {/* Plate */}
                    <td className="px-6 py-3.5">
                      <span className="font-mono font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-800 uppercase">
                        {item.plateNumber}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-3.5 text-gray-700">
                      {item.customerName}
                    </td>

                    {/* Scan Count */}
                    <td className="px-6 py-3.5">
                      <span className="font-medium text-gray-800">
                        {item.scanCount} scans
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-3.5">
                      {item.status === 'active' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      )}
                      {item.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Pending Print
                        </span>
                      )}
                      {item.status === 'revoked' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          Revoked
                        </span>
                      )}
                    </td>

                    {/* Row Actions */}
                    <td className="px-6 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {/* Scan Preview Link */}
                      {matchedVeh?.qr_token && (
                        <a
                          href={`/v/${matchedVeh.qr_token}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 rounded text-xs font-medium border border-[#EAD9EC] hover:bg-[#EAD9EC]/40 text-[#5C3264] transition-colors inline-flex items-center gap-1"
                          title="Preview public bystander scan page"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Scan</span>
                        </a>
                      )}

                      {/* Regenerate Button */}
                      <button
                        type="button"
                        onClick={() => handleRegenerate(item.id, item.plateNumber)}
                        disabled={isRegenerating}
                        className="px-2.5 py-1 rounded text-xs font-medium border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors inline-flex items-center gap-1"
                        title="Regenerate cryptographic key"
                      >
                        <RefreshCw
                          className={`w-3 h-3 ${isRegenerating ? 'animate-spin text-[#5C3264]' : ''}`}
                        />
                        <span>{isRegenerating ? 'Regenerating...' : 'Regen'}</span>
                      </button>

                      {/* Download / Export Button */}
                      <button
                        type="button"
                        onClick={() => handleDownload(item)}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors inline-flex items-center gap-1 ${
                          isDownloaded
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                        title="Export vector print files"
                      >
                        {isDownloaded ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3 h-3 text-gray-500" />
                            <span>Export SVG</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
