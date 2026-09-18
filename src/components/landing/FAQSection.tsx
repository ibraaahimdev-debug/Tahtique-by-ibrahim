import React, { useState } from 'react';
import { Card } from '../common/Card';
import { FAQ_ITEMS } from '../../data/mockData';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

interface FAQSectionProps {
  onContactClick?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onContactClick }) => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 md:py-28 relative overflow-hidden scroll-mt-6 bg-transparent">

      <span id="faqs" className="sr-only" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#D6E0F5]/80 via-[#EAD9EC]/80 to-[#F3D6DE]/80 text-[#5C3264] text-xs sm:text-sm font-semibold uppercase tracking-wider border border-white/60 shadow-xs">
            <HelpCircle className="w-4 h-4 text-[#5C3264]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1A1A1A] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-[#8A8A8A]">
            Everything you need to know about the Tagtique smart tag and privacy relay service.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className="transition-all duration-200"
              >
                <Card
                  className={`!p-5 sm:!p-6 border transition-all cursor-pointer backdrop-blur-sm ${
                    isOpen
                      ? 'border-[#EAD9EC] shadow-md ring-1 ring-[#EAD9EC]/60 bg-white/95'
                      : 'border-black/[0.04] hover:border-[#EAD9EC] bg-white/85 hover:bg-white/95'
                  }`}
                  onClick={() => toggleFAQ(item.id)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A] leading-snug">
                      {item.question}
                    </h3>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] text-[#1E293B] shadow-xs rotate-180 border border-white/80'
                          : 'bg-[#EAD9EC]/60 text-[#5C3264]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-black/[0.05] animate-in fade-in duration-200">
                      <p className="text-sm sm:text-base text-[#8A8A8A] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-12 text-center p-6 rounded-3xl bg-white border border-[#EAD9EC]/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D6E0F5] to-[#EAD9EC] flex items-center justify-center text-[#5C3264] shrink-0 shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1A1A1A]">
                Have a question not answered here?
              </h4>
              <p className="text-xs text-[#8A8A8A]">
                Our dedicated support team replies within 2 hours.
              </p>
            </div>
          </div>
          {onContactClick ? (
            <button
              type="button"
              onClick={onContactClick}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] hover:from-[#C8D6F2] hover:to-[#ECC7D2] text-[#1E293B] transition-all shadow-[0_4px_16px_rgba(234,217,236,0.7)] hover:shadow-[0_6px_22px_rgba(234,217,236,0.95)] shrink-0 focus:outline-none active:scale-95 border border-white/80"
            >
              Contact Support
            </button>
          ) : (
            <a
              href="mailto:ataitsolutions09@gmail.com"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-[#D6E0F5] via-[#EAD9EC] to-[#F3D6DE] hover:from-[#C8D6F2] hover:to-[#ECC7D2] text-[#1E293B] transition-all shadow-[0_4px_16px_rgba(234,217,236,0.7)] hover:shadow-[0_6px_22px_rgba(234,217,236,0.95)] shrink-0 border border-white/80"
            >
              Contact Support
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
