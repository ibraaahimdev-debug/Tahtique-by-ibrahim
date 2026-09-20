export interface TagMaterial {
  id: string;
  name: string;
  description: string;
  badge: string;
  extraPrice: number;
  iconName: string;
}

export interface VehicleDetails {
  id?: string;
  ownerName: string;
  contactNumber: string;
  guardianContact?: string;
  vehiclePlate: string;
  state?: string;
  vehicleModel?: string;
  vehicleType?: string;
  qrToken?: string;
  qrSvgUrl?: string | null;
  qrGeneratedAt?: string | null;
  revokedAt?: string | null;
  qrStatus?: 'generating' | 'ready' | 'revoked' | 'error';
}

export interface DeliveryDetails {
  fullName: string;
  addressLine: string;
  city: string;
  postalCode: string;
  deliveryPhone: string;
  notes?: string;
}

export interface BillingDetails {
  sameAsDelivery: boolean;
  billingName: string;
  billingEmail: string;
  billingAddress: string;
  billingCity: string;
  billingPostalCode: string;
}

export type PaymentMethodId = 'card' | 'bank_transfer' | 'cod';

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  description: string;
  badge?: string;
  icon: string;
}

export interface OrderFormData {
  packageId: string;
  materialId: string;
  quantity: number;
  vehicles: VehicleDetails[];
  delivery: DeliveryDetails;
  billing: BillingDetails;
  paymentMethod: PaymentMethodId;
}
