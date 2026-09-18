import React, { useState, useMemo } from 'react';
import { AdminStatusBadge } from './components/AdminStatusBadge';
import { Search, Phone, Mail, X, ArrowRight } from 'lucide-react';
import type { AdminCustomer, AdminOrder } from '../../types/admin';

interface CustomersListPageProps {
  customers: AdminCustomer[];
  orders: AdminOrder[];
  onSelectOrder: (orderId: string) => void;
}

export const CustomersListPage: React.FC<CustomersListPageProps> = ({
  customers,
  orders,
  onSelectOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }, [customers, searchTerm]);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Find orders belonging to the selected customer
  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter(
      (o) =>
        o.customerEmail.toLowerCase() === selectedCustomer.email.toLowerCase() ||
        o.customerName.toLowerCase() === selectedCustomer.name.toLowerCase()
    );
  }, [orders, selectedCustomer]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Registered Customers
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Directory of vehicle owners with active Tagtique contact relays
          </p>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Total Customers: <strong className="text-gray-900">{customers.length}</strong>
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
            placeholder="Search customers by name, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#B89BBF] bg-white"
          />
        </div>
      </div>

      {/* Main Customers Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3">Customer Name</th>
                <th className="px-6 py-3">Contact Email & Phone</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3 text-center">Total Orders</th>
                <th className="px-6 py-3">Last Order Date</th>
                <th className="px-6 py-3 text-right">Lifetime Spend</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${
                    selectedCustomerId === cust.id ? 'bg-[#EAD9EC]/20' : ''
                  }`}
                >
                  <td className="px-6 py-3.5 font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D6E0F5] to-[#EAD9EC] text-[#5C3264] flex items-center justify-center font-bold text-xs shadow-xs">
                      {cust.name.charAt(0)}
                    </div>
                    <span>{cust.name}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-gray-700 block">{cust.email}</span>
                    <span className="text-[11px] text-gray-400">{cust.phone}</span>
                  </td>
                  <td className="px-6 py-3.5 text-gray-600">
                    {cust.city}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 font-semibold text-gray-800 text-[11px]">
                      {cust.totalOrders} order{cust.totalOrders > 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-gray-500">
                    {cust.lastOrderDate}
                  </td>
                  <td className="px-6 py-3.5 text-right font-semibold text-gray-900">
                    PKR {cust.lifetimeSpend.toLocaleString()}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <span className="text-xs text-[#5C3264] font-medium hover:text-[#7A2840] hover:underline">
                      View History →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail & Order History Slideout Drawer */}
      {selectedCustomer && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D6E0F5] to-[#EAD9EC] text-[#5C3264] flex items-center justify-center font-bold text-base shadow-xs">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  {selectedCustomer.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedCustomer.email}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedCustomer.phone}</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCustomerId(null)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-3">
              Order History ({customerOrders.length} order{customerOrders.length > 1 ? 's' : ''})
            </h4>

            {customerOrders.length > 0 ? (
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                {customerOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => onSelectOrder(ord.id)}
                    className="p-3.5 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-[#5C3264]">
                        #{ord.orderNumber}
                      </span>
                      <div>
                        <span className="font-semibold text-gray-900 block">
                          {ord.packageName} ({ord.quantity} tags)
                        </span>
                        <span className="text-[11px] text-gray-500 font-mono">
                          Plates: {ord.vehicles.map((v) => v.plate).join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-gray-500">{ord.orderDate}</span>
                      <AdminStatusBadge status={ord.status} />
                      <span className="font-semibold text-gray-900">PKR {ord.totalAmount.toLocaleString()}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">
                No orders registered under this email in the current session.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
