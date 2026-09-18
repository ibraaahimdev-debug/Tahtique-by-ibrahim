import React from 'react';
import { AdminStatusBadge } from './components/AdminStatusBadge';
import {
  Package,
  Clock,
  Printer,
  Truck,
  DollarSign,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import type { AdminOrder } from '../../types/admin';

interface DashboardOverviewProps {
  orders: AdminOrder[];
  onNavigateOrders: (filterStatus?: string) => void;
  onSelectOrder: (orderId: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  orders,
  onNavigateOrders,
  onSelectOrder,
}) => {
  // Compute KPI numbers from orders
  const totalOrdersCount = orders.length;
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const inPrintingCount = orders.filter((o) => o.status === 'printing').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const recentOrders = [...orders].slice(0, 7);

  const statCards = [
    {
      title: 'Total Orders',
      value: totalOrdersCount,
      subtext: '+12% from last week',
      icon: <Package className="w-5 h-5 text-gray-700" />,
      action: () => onNavigateOrders(),
      highlight: false,
    },
    {
      title: 'New / Unprocessed',
      value: newOrdersCount,
      subtext: 'Requires QR verification',
      icon: <Clock className="w-5 h-5 text-[#5C3264]" />,
      action: () => onNavigateOrders('new'),
      highlight: newOrdersCount > 0,
      badgeColor: 'bg-[#EAD9EC]/60 text-[#5C3264]',
    },
    {
      title: 'In Printing & UV',
      value: inPrintingCount,
      subtext: 'Sent to production queue',
      icon: <Printer className="w-5 h-5 text-amber-600" />,
      action: () => onNavigateOrders('printing'),
      highlight: false,
    },
    {
      title: 'Dispatched / Shipped',
      value: shippedCount,
      subtext: 'In transit with courier',
      icon: <Truck className="w-5 h-5 text-[#2C4875]" />,
      action: () => onNavigateOrders('shipped'),
      highlight: false,
    },
    {
      title: 'Gross Revenue',
      value: `PKR ${totalRevenue.toLocaleString()}`,
      subtext: 'Completed sales',
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      action: () => onNavigateOrders(),
      highlight: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Fulfillment Overview
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Operational status and physical tag queue metrics
          </p>
        </div>

        {/* Quick Operational Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateOrders('new')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-200 text-[#5C3264] hover:bg-[#EAD9EC]/30 hover:border-[#EAD9EC] transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-[#5C3264]" />
            <span>Process New ({newOrdersCount})</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateOrders('printing')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-200 text-amber-700 hover:bg-amber-50 hover:border-amber-200 transition-colors shadow-xs"
          >
            Printing Queue ({inPrintingCount})
          </button>
          <button
            type="button"
            onClick={() => onNavigateOrders()}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] hover:opacity-90 transition-opacity shadow-xs flex items-center gap-1 border border-white/80"
          >
            <span>All Orders</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#5C3264]" />
          </button>
        </div>
      </div>

      {/* Row of 5 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            onClick={card.action}
            className={`cursor-pointer rounded-xl p-4 bg-white border transition-all hover:shadow-sm ${
              card.highlight
                ? 'border-[#EAD9EC] ring-1 ring-[#EAD9EC]/60 shadow-xs'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                {card.icon}
              </div>
            </div>

            <div className="text-2xl font-bold text-gray-900 mb-1">
              {card.value}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-gray-500">
              <TrendingUp className="w-3 h-3 text-emerald-500 shrink-0" />
              <span className="truncate">{card.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-gray-900">
              Recent Customer Orders
            </h3>
            <p className="text-xs text-gray-500">
              Latest incoming tag orders requiring fulfillment
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateOrders()}
            className="text-xs font-medium text-[#5C3264] hover:text-[#7A2840] hover:underline flex items-center gap-1"
          >
            <span>View Full Orders List</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3">Order #</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Package / Plate</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder(order.id)}
                  className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-3.5 font-mono font-semibold text-gray-900">
                    #{order.orderNumber}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="font-medium text-gray-900 block">{order.customerName}</span>
                    <span className="text-[11px] text-gray-400">{order.customerEmail}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="font-medium text-gray-800">{order.packageName}</span>
                    <span className="text-[11px] text-gray-500 block uppercase font-mono">
                      {order.vehicles[0]?.plate || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-gray-500">
                    {order.orderDate}
                  </td>
                  <td className="px-6 py-3.5">
                    <AdminStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-3.5 text-right font-semibold text-gray-900">
                    PKR {order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <span className="text-[#5C3264] font-medium hover:text-[#7A2840] hover:underline text-xs">
                      View Detail →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
