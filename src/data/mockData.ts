import type { PricingPackage, FAQItem, StepItem, TrustFeature } from '../types';

export const HOW_IT_WORKS_STEPS: StepItem[] = [
  {
    stepNumber: 1,
    title: 'Order your tag',
    description: 'Select your package (1, 2, or family pack). Fast and free doorstep delivery in weather-proof packaging.',
    badge: 'Step 01',
  },
  {
    stepNumber: 2,
    title: 'Add your details',
    description: 'Scan your tag once to set up. Link your car registration and contact number in under 60 seconds.',
    badge: 'Step 02',
  },
  {
    stepNumber: 3,
    title: 'We print & ship',
    description: 'Precision-cut, UV-laminated vinyl stickers crafted to withstand heavy rain, heat, and car washes.',
    badge: 'Step 03',
  },
  {
    stepNumber: 4,
    title: 'Stick it on your car',
    description: 'Place on your windshield or corner window. Anyone who scans can call or message you without ever seeing your number.',
    badge: 'Step 04',
  },
];

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: 'single-tag',
    name: 'Single Tag',
    tagline: 'Ideal for everyday solo drivers & single vehicle owners',
    price: 1499,
    originalPrice: 1999,
    tagCount: 1,
    popular: false,
    ctaText: 'Order Single Tag (PKR 1,499)',
    features: [
      '1x Premium Weatherproof 3M QR Tag',
      '100% Phone Number Masking',
      'Lifetime Secure Relay Forwarding',
      'No App Required for Scanners',
      'Instant SMS & Voice Relay in Pakistan',
      'Transferable to New Phone Anytime',
      'One-Time Charge — No Monthly Fees',
    ],
  },
  {
    id: 'pack-of-two',
    name: 'Pack of 2',
    tagline: 'Best value for couples or two-car households',
    price: 2499,
    originalPrice: 3499,
    tagCount: 2,
    popular: true,
    badge: 'Most Popular',
    ctaText: 'Claim Most Popular Pack (PKR 2,499)',
    features: [
      '2x Premium Weatherproof 3M QR Tags',
      '100% Phone Number Masking for Both',
      'Independent Contact Routing per Tag',
      'Free Fast Delivery Across Pakistan',
      'Lifetime Secure Relay Forwarding',
      'Anti-Spam & Do-Not-Disturb Schedule',
      'One-Time Charge — Zero Recurring Fees',
    ],
  },
  {
    id: 'family-pack',
    name: 'Family Pack',
    tagline: 'Complete coverage for families or small fleet owners',
    price: 4499,
    originalPrice: 5999,
    tagCount: 4,
    popular: false,
    badge: 'Best Value',
    ctaText: 'Order Family 4-Pack (PKR 4,499)',
    features: [
      '4x Premium Weatherproof 3M QR Tags',
      'Centralized Family Dashboard',
      '100% Phone Number Masking',
      'Custom Emergency Contact Backup',
      'Complimentary Express Nationwide Shipping',
      'Lifetime Replacement Warranty',
      'One-Time Charge — Zero Renewal Fees',
    ],
  },
];

export const TRUST_FEATURES: TrustFeature[] = [
  {
    title: 'Zero Number Exposure',
    description: 'Your real 10-digit number is locked in an encrypted vault. Callers only ever see a masked Tagtique proxy identity.',
    badge: 'Privacy Core',
  },
  {
    title: 'Anti-Harassment Shield',
    description: 'Mute alerts anytime or enable "Garage Mode" when your car is safely parked at home. Block unwanted callers with one tap.',
    badge: 'Smart Controls',
  },
  {
    title: 'No App Required',
    description: 'Anyone with an iPhone or Android camera can scan the tag and reach you instantly in their mobile browser.',
    badge: 'Universal Access',
  },
  {
    title: 'Industrial Grade Vinyl',
    description: 'Rated for 5+ years of intense outdoor exposure, UV sunlight, high-pressure pressure washers, and wiper sweeps.',
    badge: 'Built to Last',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How does someone contact me without seeing my phone number?',
    answer: 'When a bystander or parking warden scans your tag, they are brought to a secure, branded Tagtique web page. When they tap "Call Owner" or "Send Quick Alert", our automated privacy gateway connects the call using a masked proxy line. Both your number and their number stay completely private.',
  },
  {
    id: 'faq-2',
    question: 'Does the person scanning need to install an app?',
    answer: 'Not at all. Tagtique works with the standard camera app on all modern iPhones and Android smartphones. Scanning the QR opens a lightweight, fast web interface in their default browser.',
  },
  {
    id: 'faq-3',
    question: 'What if I change my phone number or sell my car?',
    answer: 'You can update your linked phone number, name, or vehicle details anytime in seconds via your Tagtique owner portal. The QR code on your car never needs to be reprinted.',
  },
  {
    id: 'faq-4',
    question: 'Is the tag safe from harsh weather, rain, and car washes?',
    answer: 'Yes! Every Tagtique sticker is manufactured using automotive-grade 3M adhesive vinyl with an extra UV matte lamination layer. It resists extreme sun heat, freezing rain, pressure washers, and windshield wiper abrasions.',
  },
  {
    id: 'faq-5',
    question: 'Can I silence alerts during nighttime or when parked at home?',
    answer: 'Yes, your owner settings let you toggle "Do Not Disturb" mode or set automated quiet hours. During these times, scanners can leave an urgent text message notification instead of directly ringing your phone.',
  },
  {
    id: 'faq-6',
    question: 'Are there any recurring monthly subscription fees?',
    answer: 'No hidden fees and absolutely no monthly or annual subscriptions. Your payment in PKR is 100% a one-time charge for the physical QR tags, and lifetime privacy relay forwarding is included.',
  },
];
