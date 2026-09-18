import React, { useState } from 'react';
import { AdminShell, type AdminTab } from './AdminShell';
import { AdminLoginPage } from './AdminLoginPage';
import { DashboardOverview } from './DashboardOverview';
import { OrdersListPage } from './OrdersListPage';
import { OrderDetailPage } from './OrderDetailPage';
import { CustomersListPage } from './CustomersListPage';
import { QRCodeManagementPage } from './QRCodeManagementPage';
import { AdminSettingsPage } from './AdminSettingsPage';
import {
  INITIAL_ADMIN_CUSTOMERS,
  getStoredAdminOrders,
} from '../../data/adminMockData';
import type { AdminOrder, AdminOrderStatus, AdminStaffNote } from '../../types/admin';

interface AdminPortalProps {
  onSwitchToCustomerView: () => void;
  orders?: AdminOrder[];
  onUpdateOrderStatus?: (orderId: string, newStatus: AdminOrderStatus) => void;
  onAddStaffNote?: (orderId: string, note: AdminStaffNote) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onSwitchToCustomerView,
  orders: propOrders,
  onUpdateOrderStatus: propUpdateOrderStatus,
  onAddStaffNote: propAddStaffNote,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default authenticated for testing convenience
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [localOrders, setLocalOrders] = useState<AdminOrder[]>(() => propOrders ?? getStoredAdminOrders());
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [ordersFilterStatus, setOrdersFilterStatus] = useState<string>('all');

  const orders = propOrders ?? localOrders;

  // Handle order status update
  const handleUpdateOrderStatus = (orderId: string, newStatus: AdminOrderStatus) => {
    if (propUpdateOrderStatus) {
      propUpdateOrderStatus(orderId, newStatus);
    }
    setLocalOrders((prev) => {
      const updated = prev.map((ord) =>
        ord.id === orderId ? { ...ord, status: newStatus } : ord
      );
      try {
        localStorage.setItem('tagtique_admin_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Handle adding staff note
  const handleAddStaffNote = (orderId: string, note: AdminStaffNote) => {
    if (propAddStaffNote) {
      propAddStaffNote(orderId, note);
    }
    setLocalOrders((prev) => {
      const updated = prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, notes: [note, ...(ord.notes || [])] }
          : ord
      );
      try {
        localStorage.setItem('tagtique_admin_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Jump to Orders List with a pre-filtered status from Dashboard
  const handleNavigateOrders = (statusFilter?: string) => {
    setOrdersFilterStatus(statusFilter || 'all');
    setSelectedOrderId(null);
    setCurrentTab('orders');
  };

  // Jump into an Order Detail
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentTab('orders');
  };

  // Jump into Order Detail by Order Number
  const handleSelectByOrderNumber = (orderNumber: string) => {
    const found = orders.find(
      (o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase()
    );
    if (found) {
      setSelectedOrderId(found.id);
      setCurrentTab('orders');
    }
  };

  // If unauthenticated, show Module 7: Admin Login
  if (!isAuthenticated) {
    return (
      <AdminLoginPage
        onLoginSuccess={() => setIsAuthenticated(true)}
        onNavigateCustomerSite={onSwitchToCustomerView}
      />
    );
  }

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;

  return (
    <AdminShell
      currentTab={currentTab}
      onSelectTab={(tab) => {
        setCurrentTab(tab);
        if (tab !== 'orders') setSelectedOrderId(null);
      }}
      onLogout={() => setIsAuthenticated(false)}
      onSwitchToCustomerView={onSwitchToCustomerView}
      newOrdersCount={newOrdersCount}
    >
      {/* Module 8: Dashboard Overview */}
      {currentTab === 'dashboard' && (
        <DashboardOverview
          orders={orders}
          onNavigateOrders={handleNavigateOrders}
          onSelectOrder={handleSelectOrder}
        />
      )}

      {/* Module 9 & 10: Orders List & Order Detail */}
      {currentTab === 'orders' && (
        selectedOrder ? (
          <OrderDetailPage
            order={selectedOrder}
            onBack={() => setSelectedOrderId(null)}
            onUpdateStatus={handleUpdateOrderStatus}
            onAddNote={handleAddStaffNote}
          />
        ) : (
          <OrdersListPage
            orders={orders}
            initialStatusFilter={ordersFilterStatus}
            onSelectOrder={handleSelectOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )
      )}

      {/* Module 11: Customers Directory */}
      {currentTab === 'customers' && (
        <CustomersListPage
          customers={INITIAL_ADMIN_CUSTOMERS}
          orders={orders}
          onSelectOrder={handleSelectOrder}
        />
      )}

      {/* Module 12: QR Code Management */}
      {currentTab === 'qr-codes' && (
        <QRCodeManagementPage
          onSelectOrderNumber={handleSelectByOrderNumber}
        />
      )}

      {/* Settings */}
      {currentTab === 'settings' && <AdminSettingsPage />}
    </AdminShell>
  );
};
