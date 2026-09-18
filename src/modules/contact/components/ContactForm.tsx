import React, { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { User, Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  onSubmitContact: (data: ContactFormData) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmitContact }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    subject: 'Order & Shipping Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please provide details in your message (at least 10 characters)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onSubmitContact(formData);
    }, 400);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-[#EAD9EC] shadow-sm animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[#EAD9EC]/60 text-[#5C3264] flex items-center justify-center mb-4 border border-[#EAD9EC]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1">
          Message Sent Successfully!
        </h3>
        <p className="text-xs sm:text-sm text-[#8A8A8A] max-w-sm mx-auto mb-6">
          Thank you, {formData.fullName}. Our driver support team has received your ticket and will reply to <strong>{formData.email}</strong> within 2 hours.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              fullName: '',
              email: '',
              subject: 'Order & Shipping Inquiry',
              message: '',
            });
          }}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.05] shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#1A1A1A]">
          Send Us a Message
        </h3>
        <p className="text-xs sm:text-sm text-[#8A8A8A]">
          Fill out the form below and we will get back to you right away.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
            Full Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="e.g. Alex Henderson"
              value={formData.fullName}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm border bg-[#F7EBEF]/30 focus:bg-white focus:outline-none focus:ring-2 ${
                errors.fullName
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-black/10 focus:border-[#B89BBF] focus:ring-[#EAD9EC]/60'
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
            Email Address *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A8A]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="e.g. alex@example.com"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm border bg-[#F7EBEF]/30 focus:bg-white focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-black/10 focus:border-[#B89BBF] focus:ring-[#EAD9EC]/60'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
            Inquiry Topic
          </label>
          <select
            value={formData.subject}
            onChange={(e) => handleFieldChange('subject', e.target.value)}
            className="w-full px-4 py-3 rounded-2xl text-sm border border-black/10 bg-[#F7EBEF]/30 focus:bg-white focus:outline-none focus:border-[#B89BBF] focus:ring-2 focus:ring-[#EAD9EC]/60"
          >
            <option value="Order & Shipping Inquiry">Order & Shipping Inquiry</option>
            <option value="Change Vehicle / Phone Number">Change Vehicle / Phone Number</option>
            <option value="Replacement Under Warranty">Replacement Under Warranty</option>
            <option value="Corporate Fleet & Bulk Orders">Corporate Fleet & Bulk Orders</option>
            <option value="General Question">General Question</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
            Your Message *
          </label>
          <div className="relative">
            <textarea
              rows={4}
              placeholder="Please provide order number (if applicable) and describe what you need assistance with..."
              value={formData.message}
              onChange={(e) => handleFieldChange('message', e.target.value)}
              className={`w-full p-4 rounded-2xl text-sm border bg-[#F7EBEF]/30 focus:bg-white focus:outline-none focus:ring-2 ${
                errors.message
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-black/10 focus:border-[#B89BBF] focus:ring-[#EAD9EC]/60'
              }`}
            />
          </div>
          {errors.message && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isSubmitting}
          icon={<Send className="w-4 h-4" />}
          className="shadow-md"
        >
          {isSubmitting ? 'Sending Ticket...' : 'Submit Inquiry'}
        </Button>
      </form>
    </div>
  );
};
