import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  Download,
  Edit,
  Database,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import {
  orderBackendService,
  type AdminOrderRow,
} from '../../services/orderBackendService';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { EditOrderModal } from './components/EditOrderModal';
import type { AdminOrder, AdminOrderStatus } from '../../types/admin';

interface OrdersListPageProps {
  orders?: AdminOrder[];
  initialStatusFilter?: string;
  onSelectOrder?: (orderId: string) => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: AdminOrderStatus) => void;
}

export const OrdersListPage: React.FC<OrdersListPageProps> = ({
  initialStatusFilter = 'all',
  onSelectOrder: _onSelectOrder,
}) => {
  const [orderRows, setOrderRows] = useState<AdminOrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [packageFilter, setPackageFilter] = useState<string>('all');
  const [editingRow, setEditingRow] = useState<AdminOrderRow | null>(null);
  const [downloadingTagId, setDownloadingTagId] = useState<string | null>(null);
  const supabaseActive = isSupabaseConfigured();

  // Load orders from backend service
  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderBackendService.fetchAdminOrders();
      setOrderRows(data);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    // Subscribe to real-time changes
    const unsubscribe = orderBackendService.subscribeToChanges(() => {
      loadOrders();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Filter & search logic (Search by Customer Name, Phone, or Vehicle Number)
  const filteredRows = useMemo(() => {
    return orderRows.filter((row) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        row.customer_name.toLowerCase().includes(q) ||
        row.phone_number.toLowerCase().includes(q) ||
        row.guardian_number.toLowerCase().includes(q) ||
        row.vehicle_number.toLowerCase().includes(q) ||
        row.order_number.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' || row.status === statusFilter;

      const matchesPackage =
        packageFilter === 'all' ||
        row.package_type.toLowerCase().includes(packageFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesPackage;
    });
  }, [orderRows, searchTerm, statusFilter, packageFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPackageFilter('all');
  };

  // Row Action 1: Download QR PNG
  const handleDownloadQR = async (row: AdminOrderRow) => {
    setDownloadingTagId(row.tag_id);
    try {
      await orderBackendService.downloadTagQRPng(
        row.qr_code_value,
        row.vehicle_number,
        row.vehicle_type
      );
    } catch (err) {
      console.error('Failed to download QR:', err);
    } finally {
      setTimeout(() => setDownloadingTagId(null), 800);
    }
  };

  // Row Action 2: Save edits from EditOrderModal
  const handleSaveRecord = async (updatedData: {
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
  }) => {
    await orderBackendService.updateAdminRecord(updatedData);
    await loadOrders();
  };

  // Inline Status change helper
  const handleInlineStatusChange = async (
    row: AdminOrderRow,
    newStatus: 'pending' | 'printed' | 'shipped' | 'active' | 'inactive'
  ) => {
    await orderBackendService.updateAdminRecord({
      tag_id: row.tag_id,
      status: newStatus,
    });
    setOrderRows((prev) =>
      prev.map((r) => (r.tag_id === row.tag_id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Connection Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              E-Tag Orders & QR Registry
            </h2>

            {/* Supabase Connection Status Pill */}
            {supabaseActive ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Supabase Realtime Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-[#5C3264] border border-purple-200">
                <Database className="w-3 h-3 text-[#5C3264]" />
                Local Cache & Offline Ready
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Real-time management for vehicle tags, masked phone relays, and print-ready QR codes
          </p>
        </div>

        {/* Sync & Stats */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadOrders}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95"
            title="Refresh records from Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#5C3264]' : ''}`} />
            <span>Sync</span>
          </button>

          <div className="text-xs text-gray-500 font-medium">
            Showing <strong className="text-gray-900">{filteredRows.length}</strong> of {orderRows.length}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input: Name, Phone, Plate */}
          <div className="md:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by customer name, phone, or vehicle number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#5C3264] focus:ring-1 focus:ring-[#5C3264] bg-white text-gray-900"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#5C3264] bg-white font-medium text-gray-800"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="printed">Printed</option>
              <option value="shipped">Shipped</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Package Type Filter */}
          <div className="md:col-span-3">
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#5C3264] bg-white font-medium text-gray-800"
            >
              <option value="all">All Packages</option>
              <option value="Single">Single Tag</option>
              <option value="Pack of 2">Pack of 2</option>
              <option value="Family">Family Pack</option>
            </select>
          </div>
        </div>

        {/* Active Filters Indicator */}
        {(searchTerm || statusFilter !== 'all' || packageFilter !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters active</span>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-[#5C3264] hover:text-[#7A2840] hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Orders & Tags Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 border-b border-gray-200 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Customer Name</th>
                <th className="px-5 py-3.5">Vehicle Number</th>
                <th className="px-5 py-3.5">Phone Number</th>
                <th className="px-5 py-3.5">Guardian Number</th>
                <th className="px-5 py-3.5">Package</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-center">Change Status</th>
                <th className="px-5 py-3.5 text-right">Row Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRows.length > 0 ? (
                filteredRows.map((row) => {
                  const isDownloading = downloadingTagId === row.tag_id;
                  return (
                    <tr
                      key={row.tag_id}
                      className="hover:bg-purple-50/20 transition-colors"
                    >
                      {/* Customer Name */}
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-gray-900">
                          {row.customer_name}
                        </div>
                        <span className="text-[10px] font-mono text-gray-400">
                          #{row.order_number}
                        </span>
                      </td>

                      {/* Vehicle Number (Plate) */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs bg-gray-100 border border-gray-200 text-gray-900 px-2 py-0.5 rounded-md uppercase">
                            {row.vehicle_number}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 mt-0.5 block truncate max-w-[130px]">
                          {row.vehicle_type}
                        </span>
                      </td>

                      {/* Phone Number */}
                      <td className="px-5 py-3.5 font-medium text-gray-800">
                        <a
                          href={`tel:${row.phone_number}`}
                          className="hover:text-[#5C3264] hover:underline"
                        >
                          {row.phone_number || '—'}
                        </a>
                      </td>

                      {/* Guardian Number */}
                      <td className="px-5 py-3.5 text-gray-600">
                        {row.guardian_number ? (
                          <a
                            href={`tel:${row.guardian_number}`}
                            className="hover:text-[#5C3264] hover:underline text-purple-900 font-medium"
                          >
                            {row.guardian_number}
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">None</span>
                        )}
                      </td>

                      {/* Package */}
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-gray-800 block">
                          {row.package_type}
                        </span>
                        <span className="text-[10px] text-gray-400 capitalize">
                          {row.tag_material} tag
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        {row.status === 'active' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        )}
                        {row.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Pending
                          </span>
                        )}
                        {row.status === 'printed' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Printed
                          </span>
                        )}
                        {row.status === 'shipped' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            Shipped
                          </span>
                        )}
                        {row.status === 'inactive' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Change Status Dropdown */}
                      <td className="px-5 py-3.5 text-center">
                        <select
                          value={row.status}
                          onChange={(e) =>
                            handleInlineStatusChange(row, e.target.value as any)
                          }
                          className="text-xs px-2 py-1 rounded-lg border border-gray-300 bg-white font-medium text-gray-700 focus:outline-none focus:border-[#5C3264] cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="printed">Printed</option>
                          <option value="shipped">Shipped</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>

                      {/* Row Actions: Download QR & Edit */}
                      <td className="px-5 py-3.5 text-right space-x-2 whitespace-nowrap">
                        {/* Download QR button */}
                        <button
                          type="button"
                          disabled={isDownloading}
                          onClick={() => handleDownloadQR(row)}
                          className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-[#5C3264] transition-all inline-flex items-center gap-1 font-semibold cursor-pointer active:scale-95 shadow-2xs"
                          title="Download high-resolution QR PNG for this tag"
                        >
                          <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce text-[#5C3264]' : ''}`} />
                          <span>{isDownloading ? '...' : 'Download QR'}</span>
                        </button>

                        {/* Edit Row button */}
                        <button
                          type="button"
                          onClick={() => setEditingRow(row)}
                          className="px-2.5 py-1 rounded-lg bg-[#5C3264] hover:bg-[#4a2850] text-white transition-all inline-flex items-center gap-1 font-semibold cursor-pointer active:scale-95 shadow-2xs"
                          title="Edit customer, vehicle, and tag fields in Supabase"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Test Scan Page Link */}
                        <a
                          href={`/tag/${row.qr_code_value}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-[#5C3264] hover:border-[#5C3264] transition-colors inline-flex items-center"
                          title="Preview public bystander scan relay page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400 text-xs">
                    {isLoading
                      ? 'Loading records from Supabase...'
                      : 'No records match your filter criteria. Try clearing filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info note */}
        <div className="p-3.5 bg-gray-50/60 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              All QR codes encode non-guessable tokens only. Edits update live without physical re-tagging.
            </span>
          </div>
          <span className="text-gray-400">
            Total registered tags in Supabase: {orderRows.length}
          </span>
        </div>
      </div>

      {/* Edit Order Modal */}
      {editingRow && (
        <EditOrderModal
          orderRow={editingRow}
          isOpen={Boolean(editingRow)}
          onClose={() => setEditingRow(null)}
          onSave={handleSaveRecord}
        />
      )}
    </div>
  );
};
