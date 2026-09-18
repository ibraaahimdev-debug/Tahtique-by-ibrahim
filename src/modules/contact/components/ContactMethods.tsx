import React from 'react';
import { Card } from '../../../components/common/Card';
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const ContactMethods: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* WhatsApp Quick Chat */}
      <Card
        hoverable
        className="!p-6 border border-emerald-100 bg-white transition-all group"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-base text-[#1A1A1A]">
                WhatsApp Live Support
              </h4>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Instant
              </span>
            </div>
            <p className="text-xs text-[#8A8A8A] mt-1 leading-relaxed">
              Chat directly with our driver support dispatch. Average reply time: under 3 minutes.
            </p>
            <a
              href="https://wa.me/923292082080"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 mt-3"
            >
              <span>Chat on WhatsApp (0329-2082080)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </Card>

      {/* Priority Phone Line */}
      <Card
        hoverable
        className="!p-6 border border-black/[0.05] bg-white transition-all group"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EAD9EC]/60 text-[#5C3264] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-[#EAD9EC]">
            <Phone className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-base text-[#1A1A1A]">
                Phone Support
              </h4>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5C3264] bg-[#EAD9EC]/60 px-2 py-0.5 rounded-full border border-[#EAD9EC]">
                Direct Line
              </span>
            </div>
            <p className="text-xs text-[#8A8A8A] mt-1 leading-relaxed">
              Speak directly with our support team for urgent delivery or vehicle relay inquiries.
            </p>
            <a
              href="tel:03292082080"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C3264] hover:underline mt-3"
            >
              <span>0329-2082080</span>
            </a>
          </div>
        </div>
      </Card>

      {/* Email Support */}
      <Card
        hoverable
        className="!p-6 border border-black/[0.05] bg-white transition-all group"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD4E9]/50 text-[#5C3264] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-[#FFD4E9]">
            <Mail className="w-6 h-6 text-[#5C3264]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-base text-[#1A1A1A]">
                Email Helpdesk
              </h4>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5C3264] bg-[#EAD9EC]/60 px-2 py-0.5 rounded-full border border-[#EAD9EC]">
                Fast Response
              </span>
            </div>
            <p className="text-xs text-[#8A8A8A] mt-1 leading-relaxed">
              For order modifications, corporate fleet pricing, and custom sticker designs.
            </p>
            <a
              href="mailto:ataitsolutions09@gmail.com"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C3264] hover:underline mt-3"
            >
              <span>ataitsolutions09@gmail.com</span>
            </a>
          </div>
        </div>
      </Card>

      {/* Operating Hours & Guarantee */}
      <div className="p-4 rounded-2xl bg-[#EAD9EC]/40 border border-[#EAD9EC] text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-semibold text-[#1A1A1A]">
          <Clock className="w-4 h-4 text-[#5C3264]" />
          <span>Customer Service Hours:</span>
        </div>
        <p className="text-[#8A8A8A]">
          Monday – Friday: 8:00 AM – 8:00 PM EST<br />
          Saturday: 9:00 AM – 5:00 PM EST (Sunday: Emergency Relay Only)
        </p>
        <div className="pt-2 border-t border-[#EAD9EC]/60 flex items-center gap-1 text-[#5C3264] font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>All vehicle data kept strictly confidential</span>
        </div>
      </div>
    </div>
  );
};
