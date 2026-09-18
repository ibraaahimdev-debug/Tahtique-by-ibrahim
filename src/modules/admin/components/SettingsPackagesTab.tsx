import React, { useState } from 'react';
import { PRICING_PACKAGES } from '../../../data/mockData';
import { Plus, Edit2, Trash2, Check, X, Sparkles } from 'lucide-react';
import type { PricingPackage } from '../../../types';

export const SettingsPackagesTab: React.FC = () => {
  const [packages, setPackages] = useState<PricingPackage[]>(PRICING_PACKAGES);
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null);
  const [isNewPackage, setIsNewPackage] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state for Modal
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState(19);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(25);
  const [formTagCount, setFormTagCount] = useState(1);
  const [formTagline, setFormTagline] = useState('');
  const [formPopular, setFormPopular] = useState(false);
  const [formFeatures, setFormFeatures] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddModal = () => {
    setIsNewPackage(true);
    setFormName('');
    setFormPrice(29);
    setFormOriginalPrice(39);
    setFormTagCount(2);
    setFormTagline('Custom package plan for drivers');
    setFormPopular(false);
    setFormFeatures('100% Masked Calls\nLifetime Relay\nWeatherproof Vinyl\nNo App Required');
    setEditingPackage({
      id: `custom-pkg-${Date.now()}`,
      name: '',
      tagline: '',
      price: 29,
      tagCount: 2,
      features: [],
      ctaText: 'Order Package',
    });
  };

  const openEditModal = (pkg: PricingPackage) => {
    setIsNewPackage(false);
    setEditingPackage(pkg);
    setFormName(pkg.name);
    setFormPrice(pkg.price);
    setFormOriginalPrice(pkg.originalPrice);
    setFormTagCount(pkg.tagCount);
    setFormTagline(pkg.tagline);
    setFormPopular(!!pkg.popular);
    setFormFeatures(pkg.features.join('\n'));
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !editingPackage) return;

    const featureList = formFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const updated: PricingPackage = {
      ...editingPackage,
      name: formName.trim(),
      price: formPrice,
      originalPrice: formOriginalPrice || undefined,
      tagCount: formTagCount,
      tagline: formTagline.trim(),
      popular: formPopular,
      badge: formPopular ? 'Most Popular' : undefined,
      features: featureList,
      ctaText: `Order ${formName.trim()}`,
    };

    if (isNewPackage) {
      setPackages((prev) => [...prev, updated]);
      showToast(`Package "${updated.name}" created successfully.`);
    } else {
      setPackages((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      showToast(`Package "${updated.name}" updated successfully.`);
    }

    setEditingPackage(null);
  };

  const handleDeletePackage = (id: string, name: string) => {
    if (packages.length <= 1) {
      alert('You must retain at least one package in the active catalog.');
      return;
    }
    if (confirm(`Are you sure you want to remove the "${name}" package?`)) {
      setPackages((prev) => prev.filter((p) => p.id !== id));
      showToast(`Package "${name}" removed.`);
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

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Active Packages & Pricing Tiers
          </h3>
          <p className="text-xs text-gray-500">
            Control the packages displayed on the public landing page and order customizer
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] text-xs font-bold shadow-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity w-fit border border-white/80"
        >
          <Plus className="w-4 h-4 text-[#5C3264]" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white rounded-xl p-5 border flex flex-col justify-between transition-all relative ${
              pkg.popular
                ? 'border-[#EAD9EC] ring-1 ring-[#EAD9EC]/60 shadow-sm'
                : 'border-gray-200 shadow-xs'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs border border-white/80">
                <Sparkles className="w-3 h-3 text-[#5C3264]" />
                <span>Most Popular</span>
              </div>
            )}

            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-bold text-base text-gray-900">{pkg.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-1">{pkg.tagline}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xl font-bold text-gray-900">
                    PKR {pkg.price.toLocaleString()}
                  </span>
                  {pkg.originalPrice && (
                    <span className="text-xs text-gray-400 line-through block">
                      PKR {pkg.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs font-medium text-[#5C3264] mb-4 bg-[#EAD9EC]/50 px-2 py-1 rounded w-fit border border-[#EAD9EC]/60">
                {pkg.tagCount} Physical QR Sticker{pkg.tagCount > 1 ? 's' : ''} Included
              </div>

              {/* Feature List */}
              <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-3 mb-6">
                <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-1">
                  Features ({pkg.features.length})
                </span>
                {pkg.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => openEditModal(pkg)}
                className="text-xs font-medium text-[#5C3264] hover:text-[#7A2840] hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                className="text-xs font-medium text-red-500 hover:text-red-700 flex items-center gap-1"
                title="Remove Package"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Package Modal */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h4 className="font-bold text-base text-gray-900">
                {isNewPackage ? 'Add New Pricing Package' : `Edit Package: ${editingPackage.name}`}
              </h4>
              <button
                type="button"
                onClick={() => setEditingPackage(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Couples Duo Pack"
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:border-[#B89BBF]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:border-[#B89BBF]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Original Strike Price (PKR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formOriginalPrice || ''}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    placeholder="e.g. 3499"
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:border-[#B89BBF]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Physical QR Tags Included *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formTagCount}
                    onChange={(e) => setFormTagCount(Number(e.target.value))}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:border-[#B89BBF]"
                    required
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formPopular}
                      onChange={(e) => setFormPopular(e.target.checked)}
                      className="w-4 h-4 rounded text-[#5C3264] accent-[#5C3264] focus:ring-[#EAD9EC]"
                    />
                    <span className="font-semibold text-gray-800">
                      Mark as "Most Popular"
                    </span>
                  </label>
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">
                    Tagline Subtitle
                  </label>
                  <input
                    type="text"
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    placeholder="e.g. Best for multi-car families"
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:border-[#B89BBF]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">
                    Features Included (One feature per line)
                  </label>
                  <textarea
                    rows={4}
                    value={formFeatures}
                    onChange={(e) => setFormFeatures(e.target.value)}
                    placeholder="100% Phone Number Masking&#10;Lifetime Relay&#10;No App Required"
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 font-mono focus:outline-none focus:border-[#B89BBF]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] text-xs font-bold shadow-xs hover:opacity-90 transition-opacity border border-white/80"
                >
                  {isNewPackage ? 'Create Package' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
