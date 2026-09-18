import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { PRICING_PACKAGES } from '../../data/mockData';
import { Check, Sparkles, ShieldCheck, ArrowRight, Building2, X, Send, Calculator } from 'lucide-react';

interface PricingSectionProps {
  onSubmitOrder: (packageId: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSubmitOrder }) => {
  const [selectedId, setSelectedId] = useState<string>('pack-of-two');
  const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);
  const [fleetCount, setFleetCount] = useState<number>(25);
  const [fleetCompany, setFleetCompany] = useState('');
  const [fleetContact, setFleetContact] = useState('');
  const [fleetPhone, setFleetPhone] = useState('');
  const [fleetCity, setFleetCity] = useState('Lahore');
  const [fleetSubmitted, setFleetSubmitted] = useState(false);

  // Bulk pricing calculations
  const getFleetUnitPrice = (count: number) => {
    if (count >= 100) return 699;
    if (count >= 50) return 849;
    if (count >= 25) return 999;
    return 1199;
  };

  const unitPrice = getFleetUnitPrice(fleetCount);
  const totalFleetPrice = unitPrice * fleetCount;
  const standardPrice = 1499 * fleetCount;
  const savings = standardPrice - totalFleetPrice;

  const handleFleetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFleetSubmitted(true);
    setTimeout(() => {
      // Auto close after 3 seconds or allow manual close
    }, 3000);
  };

  return (
    <section id="pricing" className="py-20 md:py-28 relative overflow-hidden bg-transparent">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs sm:text-sm font-semibold text-[#5C3264] uppercase tracking-wider bg-gradient-to-r from-[#D6E0F5]/80 via-[#EAD9EC]/80 to-[#F3D6DE]/80 px-3.5 py-1.5 rounded-full inline-block border border-white/60 shadow-xs">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1A1A1A] tracking-tight">
            Choose Your Tagtique Package
          </h2>
          <p className="text-base sm:text-lg text-[#8A8A8A] font-normal leading-relaxed">
            One-time payment for lifetime protection. No monthly subscriptions, no unexpected renewals.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
          {PRICING_PACKAGES.map((pkg, pIdx) => {
            const isPopular = pkg.popular;
            const isSelected = selectedId === pkg.id;

            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col transition-all duration-300 ${
                  isPopular
                    ? 'lg:-translate-y-4 z-10'
                    : 'hover:-translate-y-1'
                }`}
                onClick={() => setSelectedId(pkg.id)}
              >
                {/* Most Popular Badge for Pack of 2 */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5 border border-white/80">
                      <Sparkles className="w-3.5 h-3.5 text-[#5C3264]" />
                      <span>{pkg.badge || 'Most Popular'}</span>
                    </div>
                  </div>
                )}

                {/* Best Value Badge for Family Pack */}
                {!isPopular && pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <div className="bg-[#EAD9EC]/80 text-[#5C3264] border border-[#EAD9EC] text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      <span>{pkg.badge}</span>
                    </div>
                  </div>
                )}

                <Card
                  elevated={isPopular}
                  className={`h-full flex flex-col justify-between border ${
                    isPopular
                      ? 'border-[#EAD9EC] ring-2 ring-[#EAD9EC]/40 shadow-[0_20px_50px_-10px_rgba(234,217,236,0.55)]'
                      : 'border-black/[0.04]'
                  } ${isSelected && !isPopular ? 'border-[#EAD9EC]' : ''}`}
                >
                  <div>
                    {/* Package Name & Tagline */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-1">
                        {pkg.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#8A8A8A]">
                        {pkg.tagline}
                      </p>
                    </div>

                    {/* Price Display */}
                    <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-black/[0.05]">
                      <span className="text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
                        PKR {pkg.price.toLocaleString()}
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-sm text-[#8A8A8A] line-through">
                          PKR {pkg.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-xs text-emerald-600 font-semibold ml-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                        One-time
                      </span>
                    </div>

                    {/* Feature List */}
                    <div className="space-y-3.5 mb-8">
                      <p className="text-xs uppercase font-semibold tracking-wider text-[#1A1A1A]">
                        Includes:
                      </p>
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-sm text-[#1A1A1A]">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                              pIdx === 0
                                ? 'bg-[#D6E0F5] text-[#2C4875]'
                                : pIdx === 1
                                ? 'bg-[#EAD9EC] text-[#5C3264]'
                                : 'bg-[#F3D6DE] text-[#7A2840]'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                          <span className="leading-snug">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4 mt-auto">
                    <Button
                      variant={isPopular ? 'primary' : 'secondary'}
                      size="lg"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        onSubmitOrder(pkg.id);
                      }}
                      icon={<ArrowRight className="w-4 h-4" />}
                      className="font-semibold active:scale-95"
                    >
                      {pkg.ctaText}
                    </Button>
                    <p className="text-[11px] text-center text-[#8A8A8A] mt-2.5 flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#5C3264]" />
                      30-Day Money Back Guarantee
                    </p>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Bulk Fleet Callout */}
        <div className="mt-12 text-center p-6 rounded-3xl bg-white border border-[#EAD9EC]/70 max-w-2xl mx-auto shadow-sm">
          <h4 className="text-base font-semibold text-[#1A1A1A] mb-1">
            Need 10+ tags for a corporate fleet or dealership?
          </h4>
          <p className="text-sm text-[#8A8A8A] mb-3">
            We offer custom branded tags with your company logo and enterprise fleet management portal.
          </p>
          <button
            type="button"
            onClick={() => {
              setIsFleetModalOpen(true);
              setFleetSubmitted(false);
            }}
            className="text-sm font-semibold text-[#5C3264] hover:text-[#7A2840] hover:underline inline-flex items-center gap-1.5 focus:outline-none transition-colors"
          >
            <Building2 className="w-4 h-4" />
            <span>Calculate Enterprise Fleet Quote & Order →</span>
          </button>
        </div>
      </div>

      {/* CORPORATE FLEET QUOTE MODAL */}
      {isFleetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#EAD9EC]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">
                    Enterprise Fleet & Dealership Portal
                  </h3>
                  <p className="text-xs text-gray-300">
                    Custom logo branding & bulk volume discounts across Pakistan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFleetModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
              {fleetSubmitted ? (
                <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <Check className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#1A1A1A]">
                    Fleet Request Submitted!
                  </h4>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Thank you, <strong>{fleetContact || 'Partner'}</strong>. We have generated your preliminary quote of <strong>PKR {totalFleetPrice.toLocaleString()}</strong> for <strong>{fleetCount} vehicles</strong>.
                  </p>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 max-w-sm mx-auto text-xs text-left space-y-1 text-gray-700">
                    <div>Company: <strong>{fleetCompany || 'Fleet Partner'}</strong></div>
                    <div>Phone: <strong>{fleetPhone || 'Provided'}</strong></div>
                    <div>Location: <strong>{fleetCity}</strong></div>
                    <div>Estimated Delivery: <strong>Within 3 to 4 Business Days</strong></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFleetModalOpen(false)}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] text-xs font-bold shadow-md transition-all border border-white/80"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFleetSubmit} className="space-y-6">
                  {/* Fleet Size Stepper & Live Calculation */}
                  <div className="p-4 rounded-2xl bg-[#EAD9EC]/20 border border-[#EAD9EC]/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#5C3264] uppercase tracking-wider flex items-center gap-1">
                        <Calculator className="w-3.5 h-3.5" />
                        Interactive Volume Estimator
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        Save PKR {savings.toLocaleString()}!
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-[#1A1A1A]">
                          Fleet Size: <span className="text-[#5C3264] font-bold text-base">{fleetCount} Vehicles</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Bulk rate: PKR {unitPrice} / tag (Regular PKR 1,499)
                        </div>
                      </div>

                      {/* Quick Count Selectors */}
                      <div className="flex items-center gap-1.5">
                        {[10, 25, 50, 100, 200].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setFleetCount(num)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              fleetCount === num
                                ? 'bg-gradient-to-r from-[#D6E0F5] to-[#EAD9EC] text-[#1E293B] font-bold shadow-xs border border-white/80'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Total Quote Box */}
                    <div className="pt-2 border-t border-[#EAD9EC]/40 flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-medium">Estimated One-Time Cost:</span>
                      <span className="text-xl font-extrabold text-[#1A1A1A]">
                        PKR {totalFleetPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Company or Dealership Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fleetCompany}
                        onChange={(e) => setFleetCompany(e.target.value)}
                        placeholder="e.g. Apex Logistics or Honda Point"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#D6E0F5] focus:ring-1 focus:ring-[#EAD9EC]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Contact Person Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fleetContact}
                        onChange={(e) => setFleetContact(e.target.value)}
                        placeholder="e.g. Imran Khan"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#D6E0F5] focus:ring-1 focus:ring-[#EAD9EC]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Direct Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        required
                        value={fleetPhone}
                        onChange={(e) => setFleetPhone(e.target.value)}
                        placeholder="0300 1234567"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#D6E0F5] focus:ring-1 focus:ring-[#EAD9EC]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        City
                      </label>
                      <select
                        value={fleetCity}
                        onChange={(e) => setFleetCity(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#D6E0F5] focus:ring-1 focus:ring-[#EAD9EC] bg-white"
                      >
                        <option value="Lahore">Lahore</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Islamabad / Rawalpindi">Islamabad / Rawalpindi</option>
                        <option value="Faisalabad">Faisalabad</option>
                        <option value="Multan">Multan</option>
                        <option value="Peshawar">Peshawar</option>
                        <option value="Other">Other City</option>
                      </select>
                    </div>
                  </div>

                  {/* Included Perks */}
                  <div className="space-y-1.5 text-[11px] text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#5C3264]" />
                      <span>Free custom corporate color branding & logo print</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#5C3264]" />
                      <span>Dedicated enterprise fleet dispatch dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#5C3264]" />
                      <span>Free courier delivery with payment on delivery or direct bank invoice</span>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] hover:from-[#C8D6F2] hover:to-[#ECC7D2] text-[#1E293B] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 border border-white/80"
                  >
                    <Send className="w-4 h-4 text-[#1E293B]" />
                    <span>Request Fleet Order & Instant Invoice</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
