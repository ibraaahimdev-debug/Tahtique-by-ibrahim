import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  QrCode,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Shield,
  Bell,
  Search,
} from 'lucide-react';

export type AdminTab = 'dashboard' | 'orders' | 'customers' | 'qr-codes' | 'settings';

interface AdminShellProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onSwitchToCustomerView: () => void;
  children: React.ReactNode;
  newOrdersCount?: number;
}

export const AdminShell: React.FC<AdminShellProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  onSwitchToCustomerView,
  children,
  newOrdersCount = 2,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'orders' as AdminTab,
      label: 'Orders',
      icon: <Package className="w-4 h-4" />,
      badge: newOrdersCount > 0 ? `${newOrdersCount} New` : undefined,
    },
    {
      id: 'customers' as AdminTab,
      label: 'Customers',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'qr-codes' as AdminTab,
      label: 'QR Codes',
      icon: <QrCode className="w-4 h-4" />,
    },
    {
      id: 'settings' as AdminTab,
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const handleTabClick = (tab: AdminTab) => {
    onSelectTab(tab);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-900 font-sans antialiased">
      {/* 1. DESKTOP PERSISTENT LEFT SIDEBAR */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-200 shrink-0">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-gray-200 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D6E0F5] to-[#EAD9EC] text-[#5C3264] flex items-center justify-center shadow-xs">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-gray-900 block leading-tight">
              TAGTIQUE
            </span>
            <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">
              Operations
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] shadow-xs font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-[#5C3264]' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/60 text-[#1E293B]'
                        : 'bg-[#EAD9EC]/60 text-[#5C3264] border border-[#EAD9EC]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-gray-200 space-y-1.5">
          <button
            type="button"
            onClick={onSwitchToCustomerView}
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
          >
            <span>Customer View</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE TOP BAR & DRAWER */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Toggle admin navigation"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-sm text-gray-900">
            TAGTIQUE Admin
          </span>
        </div>

        <button
          type="button"
          onClick={onSwitchToCustomerView}
          className="text-xs font-medium text-[#5C3264] hover:text-[#7A2840] flex items-center gap-1"
        >
          <span>Store</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 space-y-1 z-30 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentTab === item.id
                  ? 'bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAD9EC] text-[#5C3264]">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          <div className="pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Operational Bar */}
        <header className="h-14 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px]">Ctrl+K</kbd> to quick search orders</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => alert('No unread operational alerts.')}
              className="p-1.5 text-gray-400 hover:text-gray-600 relative focus:outline-none"
              aria-label="Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#5C3264] absolute top-1 right-1" />
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-gray-200 text-xs">
              <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 font-semibold flex items-center justify-center text-xs">
                OA
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="font-semibold text-gray-900 block text-xs">Ops Admin</span>
                <span className="text-[10px] text-gray-500">Fulfillment Hub</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Children Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
