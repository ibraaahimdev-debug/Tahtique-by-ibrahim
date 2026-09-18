export interface PricingPackage {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  tagCount: number;
  popular?: boolean;
  features: string[];
  ctaText: string;
  badge?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface StepItem {
  stepNumber: number;
  title: string;
  description: string;
  badge: string;
}

export interface TrustFeature {
  title: string;
  description: string;
  badge: string;
}
