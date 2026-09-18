import React, { useState } from 'react';
import { UserPlus, Shield, Trash2, Mail, Check, X } from 'lucide-react';

interface AdminStaffUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Fulfillment Ops' | 'Customer Support' | 'Warehouse Staff';
  status: 'active' | 'invited';
  lastActive: string;
}

export const SettingsUsersTab: React.FC = () => {
  const [users, setUsers] = useState<AdminStaffUser[]>([
    {
      id: 'u-1',
      name: 'Alex Henderson',
      email: 'alex.admin@tagtique.internal',
      role: 'Super Admin',
      status: 'active',
      lastActive: 'Active now',
    },
    {
      id: 'u-2',
      name: 'Sarah Connor',
      email: 'sarah.c@tagtique.internal',
      role: 'Fulfillment Ops',
      status: 'active',
      lastActive: '24 mins ago',
    },
    {
      id: 'u-3',
      name: 'Marcus Vance',
      email: 'marcus.v@tagtique.internal',
      role: 'Customer Support',
      status: 'active',
      lastActive: '2 hours ago',
    },
    {
      id: 'u-4',
      name: 'David Chen',
      email: 'david.chen@tagtique.internal',
      role: 'Warehouse Staff',
      status: 'invited',
      lastActive: 'Invitation pending',
    },
  ]);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminStaffUser['role']>('Fulfillment Ops');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newUser: AdminStaffUser = {
      id: `u-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'invited',
      lastActive: 'Invited just now',
    };

    setUsers((prev) => [...prev, newUser]);
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    showToast(`Invitation sent to ${newUser.email}`);
  };

  const handleRemoveUser = (id: string, name: string) => {
    if (confirm(`Revoke admin privileges for ${name}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast(`User ${name} removed from admin access.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Invite Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Internal Operators & Role Management
          </h3>
          <p className="text-xs text-gray-500">
            Manage who has access to customer vehicle data, QR generation, and order dispatch
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsInviteModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] text-xs font-bold shadow-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity w-fit border border-white/80"
        >
          <UserPlus className="w-4 h-4 text-[#5C3264]" />
          <span>Invite Admin User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3">Team Member</th>
                <th className="px-6 py-3">Email Address</th>
                <th className="px-6 py-3">Assigned Role</th>
                <th className="px-6 py-3">Access Status</th>
                <th className="px-6 py-3">Last Active</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                  {/* Name & Avatar */}
                  <td className="px-6 py-3.5 font-semibold text-gray-900 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs">
                      {u.name.charAt(0)}
                    </div>
                    <span>{u.name}</span>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-3.5 font-mono text-gray-600">
                    {u.email}
                  </td>

                  {/* Role */}
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAD9EC]/50 text-[#5C3264] border border-[#EAD9EC]">
                      <Shield className="w-3 h-3 text-[#5C3264]" />
                      {u.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-3.5">
                    {u.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Invited (Pending)
                      </span>
                    )}
                  </td>

                  {/* Last Active */}
                  <td className="px-6 py-3.5 text-gray-500">
                    {u.lastActive}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-3.5 text-right">
                    {u.role !== 'Super Admin' && (
                      <button
                        type="button"
                        onClick={() => handleRemoveUser(u.id, u.name)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium inline-flex items-center gap-1"
                        title="Revoke access"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Revoke</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite User Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#5C3264]" />
                <h4 className="font-bold text-base text-gray-900">
                  Invite New Staff Member
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rachel Adams"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:border-[#B89BBF]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Corporate Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="rachel.a@tagtique.internal"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:border-[#B89BBF]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Assigned Operational Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as AdminStaffUser['role'])}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:border-[#B89BBF]"
                >
                  <option value="Fulfillment Ops">Fulfillment Ops (Print Queue & Tracking)</option>
                  <option value="Customer Support">Customer Support (Order Details & Inquiries)</option>
                  <option value="Warehouse Staff">Warehouse Staff (Packaging & Courier Hand-off)</option>
                  <option value="Super Admin">Super Admin (Full Access & Settings)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] text-xs font-bold shadow-xs hover:opacity-90 transition-opacity border border-white/80"
                >
                  Send Access Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
