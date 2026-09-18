export type AdminOrderStatus = 'new' | 'printing' | 'shipped' | 'delivered' | 'cancelled';

export interface AdminVehicleItem {
  plate: string;
  model?: string;
  ownerName: string;
  contactNumber: string;
}

export interface AdminStaffNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  packageName: string;
  materialName: string;
  quantity: number;
  totalAmount: number;
  orderDate: string;
  status: AdminOrderStatus;
  vehicles: AdminVehicleItem[];
  deliveryAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
  courierName?: string;
  courierTrackingCode?: string;
  notes: AdminStaffNote[];
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  lifetimeSpend: number;
  lastOrderDate: string;
  city: string;
}

export interface AdminQRCodeItem {
  id: string;
  qrId: string;
  orderNumber: string;
  customerName: string;
  plateNumber: string;
  generatedDate: string;
  scanCount: number;
  status: 'active' | 'pending' | 'revoked';
}
