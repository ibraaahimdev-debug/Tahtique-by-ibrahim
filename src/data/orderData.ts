import type { TagMaterial, PaymentMethod, OrderFormData } from '../types/order';
import { PRICING_PACKAGES } from './mockData';

export interface OrderPricing {
  basePackageName: string;
  basePackagePrice: number;
  extraTagsCount: number;
  extraTagsPrice: number;
  basePrice: number;
  materialName: string;
  materialUpgradeCost: number;
  shippingCost: number;
  grandTotal: number;
}

export const EXTRA_TAG_UNIT_PRICE = 1000;

export function calculateOrderPricing(
  packageId: string,
  materialId: string,
  quantity: number
): OrderPricing {
  const safeQty = Math.max(1, quantity || 1);
  const pkg = PRICING_PACKAGES.find((p) => p.id === packageId) || PRICING_PACKAGES[1];
  const mat = TAG_MATERIALS.find((m) => m.id === materialId) || TAG_MATERIALS[0];

  let basePrice = 0;
  let basePackagePrice = pkg.price;
  let extraTagsCount = 0;
  let extraTagsPrice = 0;

  if (safeQty === 1) {
    basePackagePrice = 1499;
    basePrice = 1499;
  } else if (safeQty === 2) {
    basePackagePrice = 2499;
    basePrice = 2499;
  } else if (safeQty === 3) {
    basePackagePrice = 2499;
    extraTagsCount = 1;
    extraTagsPrice = EXTRA_TAG_UNIT_PRICE;
    basePrice = basePackagePrice + extraTagsPrice;
  } else if (safeQty === 4) {
    basePackagePrice = 4499;
    basePrice = 4499;
  } else if (safeQty > 4) {
    basePackagePrice = 4499;
    extraTagsCount = safeQty - 4;
    extraTagsPrice = extraTagsCount * EXTRA_TAG_UNIT_PRICE;
    basePrice = basePackagePrice + extraTagsPrice;
  } else {
    basePackagePrice = 1499;
    basePrice = 1499;
  }

  const materialUpgradeCost = mat.extraPrice * safeQty;
  const shippingCost = 0;
  const grandTotal = basePrice + materialUpgradeCost + shippingCost;

  return {
    basePackageName: pkg.name,
    basePackagePrice,
    extraTagsCount,
    extraTagsPrice,
    basePrice,
    materialName: mat.name,
    materialUpgradeCost,
    shippingCost,
    grandTotal,
  };
}

export const TAG_MATERIALS: TagMaterial[] = [
  {
    id: '3m-sticker',
    name: '3M Weatherproof Vinyl Sticker',
    description: 'Ultra-durable, UV-matte laminated flexible vinyl. Mounts smoothly on the inside or outside of windshield glass. Pressure-washer & wiper safe.',
    badge: 'Recommended (Included)',
    extraPrice: 0,
    iconName: 'Sparkles',
  },
  {
    id: 'acrylic-hard-tag',
    name: 'High-Gloss Acrylic Hard Tag',
    description: '3mm rigid acrylic badge with beveled edge. Includes silicone windshield suction mount and dual-lock adhesive. Easy to transfer between cars.',
    badge: 'Premium Edition (+PKR 450/tag)',
    extraPrice: 450,
    iconName: 'Shield',
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'cod',
    name: 'Cash on Delivery (COD)',
    description: 'Pay cash to the courier rider upon delivery anywhere in Pakistan.',
    badge: 'Most Popular in Pakistan',
    icon: 'Truck',
  },
  {
    id: 'bank_transfer',
    name: 'Direct Bank Transfer / Raast',
    description: 'Instant transfer via Raast ID or Pakistani bank accounts (HBL, Meezan, Alfalah, etc.).',
    badge: 'Instant & Zero Fees',
    icon: 'Landmark',
  },
  {
    id: 'card',
    name: 'Credit or Debit Card',
    description: 'Secure 256-bit encrypted payment via Visa, Mastercard, or PayPak.',
    badge: 'Fast & Secure',
    icon: 'CreditCard',
  },
];

export const INITIAL_ORDER_STATE: OrderFormData = {
  packageId: 'pack-of-two',
  materialId: '3m-sticker',
  quantity: 2,
  vehicles: [
    {
      ownerName: '',
      contactNumber: '',
      vehiclePlate: '',
      vehicleModel: '',
    },
    {
      ownerName: '',
      contactNumber: '',
      vehiclePlate: '',
      vehicleModel: '',
    },
  ],
  delivery: {
    fullName: '',
    addressLine: '',
    city: '',
    postalCode: '',
    deliveryPhone: '',
    notes: '',
  },
  billing: {
    sameAsDelivery: true,
    billingName: '',
    billingEmail: '',
    billingAddress: '',
    billingCity: '',
    billingPostalCode: '',
  },
  paymentMethod: 'card',
};
