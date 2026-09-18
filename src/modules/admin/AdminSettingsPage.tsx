import React, { useState } from 'react';
import { SettingsPackagesTab } from './components/SettingsPackagesTab';
import { SettingsUsersTab } from './components/SettingsUsersTab';
import { SettingsGeneralTab } from './components/SettingsGeneralTab';
import { Package, Users, Globe } from 'lucide-react';

export type SettingsSubTab = 'packages' | 'users' | 'general';

export const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsSubTab>('packages');

  const tabs = [
    {
      id: 'packages' as SettingsSubTab,
      label: 'Packages & Pricing',
      icon: <Package className="w-4 h-4" />,
      description: 'Customer package pricing & feature lists',
    },
    {
      id: 'users' as SettingsSubTab,
      label: 'Admin Users & Roles',
      icon: <Users className="w-4 h-4" />,
      description: 'Staff member permissions & invites',
    },
    {
      id: 'general' as SettingsSubTab,
      label: 'General Site Settings',
      icon: <Globe className="w-4 h-4" />,
      description: 'Brand identity, support email, & WhatsApp',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Admin Settings & Configuration
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage product catalog, operational staff permissions, and customer contact parameters
        </p>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] shadow-xs border border-white/80'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className={isActive ? 'text-[#5C3264]' : 'text-gray-400'}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Canvas */}
      <div className="pt-2">
        {activeTab === 'packages' && <SettingsPackagesTab />}
        {activeTab === 'users' && <SettingsUsersTab />}
        {activeTab === 'general' && <SettingsGeneralTab />}
      </div>
    </div>
  );
};
