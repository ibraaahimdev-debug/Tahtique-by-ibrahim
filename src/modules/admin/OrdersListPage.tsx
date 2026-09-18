import React, { useState, useMemo } from 'react';
import { AdminStatusBadge } from './components/AdminStatusBadge';
import { Search, Filter, RotateCcw, ChevronRight } from 'lucide-react';
import type { AdminOrder, AdminOrderStatus } from '../../types/admin';

interface OrdersListPageProps {
  orders: AdminOrder[];
  initialStatusFilter?: string;
  onSelectOrder: (orderId: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: AdminOrderStatus) => void;
}

export const OrdersListPage: React.FC<OrdersListPageProps> = ({
  orders,
  initialStatusFilter = 'all',
  onSelectOrder,
  onUpdateOrderStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [packageFilter, setPackageFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Filter & search logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Search term (Order #, Customer Name, Plate)
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q) ||
        order.vehicles.some((v) => v.plate.toLowerCase().includes(q));

      // 2. Status filter
      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;

      // 3. Package filter
      const matchesPackage =
        packageFilter === 'all' || order.packageName === packageFilter;

      // 4. Date filter
      let matchesDate = true;
      const todayStr = new Date().toISOString().split('T')[0];
      if (dateFilter === 'today') {
        matchesDate = order.orderDate === todayStr || order.orderDate === '2026-09-16';
      } else if (dateFilter === 'week') {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        const sevenDaysAgo = d.toISOString().split('T')[0];
        matchesDate = order.orderDate >= sevenDaysAgo || order.orderDate >= '2026-09-10';
      }

      return matchesSearch && matchesStatus && matchesPackage && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, packageFilter, dateFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPackageFilter('all');
    setDateFilter('all');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Orders Management
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage physical tag production queue, tracking waybills, and delivery statuses
          </p>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Showing <span className="font-semibold text-gray-900">{filteredOrders.length}</span> of {orders.length} total orders
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by Order #, Customer, or License Plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#B89BBF] focus:ring-1 focus:ring-[#EAD9EC] bg-white"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#B89BBF] bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="new">New (Unprocessed)</option>
              <option value="printing">In Printing & UV</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Package Type Filter */}
          <div className="md:col-span-2">
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#B89BBF] bg-white"
            >
              <option value="all">All Packages</option>
              <option value="Single Tag">Single Tag</option>
              <option value="Pack of 2">Pack of 2</option>
              <option value="Family Pack">Family Pack</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="md:col-span-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#B89BBF] bg-white"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Past 7 Days</option>
            </select>
          </div>
        </div>

        {/* Active Filters Indicator */}
        {(searchTerm || statusFilter !== 'all' || packageFilter !== 'all' || dateFilter !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters applied</span>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-[#5C3264] hover:text-[#7A2840] hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Orders Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Order #</th>
                <th className="px-5 py-3">Customer Name</th>
                <th className="px-5 py-3">Vehicle / Plate</th>
                <th className="px-5 py-3">Package & Type</th>
                <th className="px-5 py-3">Order Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-center">Change Status (Inline)</th>
                <th className="px-5 py-3 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    {/* Order # */}
                    <td
                      onClick={() => onSelectOrder(order.id)}
                      className="px-5 py-3.5 font-mono font-bold text-[#5C3264] hover:text-[#7A2840] hover:underline cursor-pointer"
                    >
                      #{order.orderNumber}
                    </td>

                    {/* Customer */}
                    <td
                      onClick={() => onSelectOrder(order.id)}
                      className="px-5 py-3.5 cursor-pointer"
                    >
                      <span className="font-semibold text-gray-900 block">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {order.customerPhone}
                      </span>
                    </td>

                    {/* Vehicle Plate */}
                    <td
                      onClick={() => onSelectOrder(order.id)}
                      className="px-5 py-3.5 cursor-pointer"
                    >
                      <div className="flex flex-wrap gap-1">
                        {order.vehicles.map((v, i) => (
                          <span
                            key={i}
                            className="font-mono text-[11px] font-semibold bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 uppercase"
                          >
                            {v.plate}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Package */}
                    <td
                      onClick={() => onSelectOrder(order.id)}
                      className="px-5 py-3.5 cursor-pointer"
                    >
                      <span className="font-medium text-gray-800 block">
                        {order.packageName}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {order.materialName.split(' ')[0]} ({order.quantity} tags)
                      </span>
                    </td>

                    {/* Date */}
                    <td
                      onClick={() => onSelectOrder(order.id)}
                      className="px-5 py-3.5 text-gray-500 whitespace-nowrap cursor-pointer"
                    >
                      {order.orderDate}
                    </td>

                    {/* Status Badge */}
                    <td
                      onClick={() => onSelectOrder(order.id)}
                      className="px-5 py-3.5 cursor-pointer"
                    >
                      <AdminStatusBadge status={order.status} />
                    </td>

                    {/* Amount */}
                    <td
                      onClick={() => onSelectOrder(order.id)}
                      className="px-5 py-3.5 text-right font-semibold text-gray-900 cursor-pointer"
                    >
                      PKR {order.totalAmount.toLocaleString()}
                    </td>

                    {/* Inline Status Changer Dropdown */}
                    <td className="px-5 py-3.5 text-center">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          onUpdateOrderStatus(order.id, e.target.value as AdminOrderStatus)
                        }
                        className="text-xs px-2 py-1 rounded border border-gray-300 bg-white font-medium text-gray-700 focus:outline-none focus:border-[#B89BBF]"
                      >
                        <option value="new">New</option>
                        <option value="printing">Printing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Click Through Link */}
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectOrder(order.id)}
                        className="p-1 text-gray-400 hover:text-[#5C3264] transition-colors"
                        title="View Order Details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-400 text-xs">
                    No orders match your filter criteria. Try clearing filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
