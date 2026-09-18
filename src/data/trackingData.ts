export interface TrackingStage {
  step: number;
  label: string;
  description: string;
  timestamp?: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface TrackedOrder {
  orderNumber: string;
  customerEmail: string;
  customerPhone: string;
  packageName: string;
  materialName: string;
  quantity: number;
  totalPaid: number;
  vehicles: Array<{ plate: string; model?: string; owner: string }>;
  deliveryAddress: string;
  courierName: string;
  courierTrackingCode: string;
  estimatedDelivery: string;
  currentStageIndex: number; // 0 to 4
  stages: TrackingStage[];
}

export const MOCK_TRACKED_ORDERS: Record<string, TrackedOrder> = {
  'TGT-000482': {
    orderNumber: 'TGT-000482',
    customerEmail: 'alex.henderson@example.com',
    customerPhone: '+1 (555) 234-5678',
    packageName: 'Pack of 2',
    materialName: '3M Weatherproof Vinyl Sticker',
    quantity: 2,
    totalPaid: 32,
    vehicles: [
      { plate: 'CA • 7XYZ890', model: 'Tesla Model Y', owner: 'Alex Henderson' },
      { plate: 'CA • 8XKJ91', model: 'Honda Civic', owner: 'Alex Henderson' },
    ],
    deliveryAddress: '742 Evergreen Terrace, Apt 4B, San Francisco, CA 94107',
    courierName: 'FedEx Express Courier',
    courierTrackingCode: 'FX-889210492-US',
    estimatedDelivery: 'Thursday, Sep 18 (2 Business Days)',
    currentStageIndex: 2, // Printing & UV Curing
    stages: [
      {
        step: 1,
        label: 'Order received',
        description: 'Payment authorized & order confirmed in Tagtique system.',
        timestamp: 'Sep 16, 10:30 AM',
        status: 'completed',
      },
      {
        step: 2,
        label: 'Details confirmed',
        description: 'Vehicle license plate & encrypted relay proxies configured.',
        timestamp: 'Sep 16, 11:15 AM',
        status: 'completed',
      },
      {
        step: 3,
        label: 'Printing & UV curing',
        description: 'Automotive vinyl precision cut & high-durability UV lamination applied.',
        timestamp: 'In progress',
        status: 'current',
      },
      {
        step: 4,
        label: 'Shipped with courier',
        description: 'Package handed over to express delivery courier.',
        timestamp: 'Expected Sep 17',
        status: 'upcoming',
      },
      {
        step: 5,
        label: 'Delivered',
        description: 'Package safely delivered to your doorstep mailer.',
        timestamp: 'Expected Sep 18',
        status: 'upcoming',
      },
    ],
  },
  'TGT-000109': {
    orderNumber: 'TGT-000109',
    customerEmail: 'sarah.miller@example.com',
    customerPhone: '+1 (555) 891-2345',
    packageName: 'Single Tag',
    materialName: 'High-Gloss Acrylic Hard Tag',
    quantity: 1,
    totalPaid: 25,
    vehicles: [
      { plate: 'NY • EM5821', model: 'BMW 330i', owner: 'Sarah Miller' },
    ],
    deliveryAddress: '120 Broadway, Suite 1400, New York, NY 10005',
    courierName: 'DHL Express',
    courierTrackingCode: 'DHL-94281729-NY',
    estimatedDelivery: 'Tomorrow by 4:00 PM',
    currentStageIndex: 3, // Shipped
    stages: [
      {
        step: 1,
        label: 'Order received',
        description: 'Order confirmed and registered in production pipeline.',
        timestamp: 'Sep 15, 08:00 AM',
        status: 'completed',
      },
      {
        step: 2,
        label: 'Details confirmed',
        description: 'Vehicle details verified and routing proxy active.',
        timestamp: 'Sep 15, 09:30 AM',
        status: 'completed',
      },
      {
        step: 3,
        label: 'Printing & UV curing',
        description: '3mm acrylic laser etched and suction mount bundled.',
        timestamp: 'Sep 15, 02:00 PM',
        status: 'completed',
      },
      {
        step: 4,
        label: 'Shipped with courier',
        description: 'In transit with DHL courier out for destination hub.',
        timestamp: 'Sep 16, 06:45 AM',
        status: 'current',
      },
      {
        step: 5,
        label: 'Delivered',
        description: 'Doorstep signature delivery.',
        timestamp: 'Expected Sep 17',
        status: 'upcoming',
      },
    ],
  },
  'TGT-000994': {
    orderNumber: 'TGT-000994',
    customerEmail: 'marcus.vance@example.com',
    customerPhone: '+1 (555) 777-1234',
    packageName: 'Family Pack',
    materialName: '3M Weatherproof Vinyl Sticker',
    quantity: 4,
    totalPaid: 54,
    vehicles: [
      { plate: 'TX • 4B7-K92', model: 'Ford F-150', owner: 'Marcus Vance' },
      { plate: 'TX • 8C1-M45', model: 'Toyota RAV4', owner: 'Elena Vance' },
      { plate: 'TX • 2P9-X18', model: 'Honda CR-V', owner: 'Leo Vance' },
      { plate: 'TX • 5R3-Y71', model: 'Mazda CX-5', owner: 'Marcus Vance' },
    ],
    deliveryAddress: '4502 Westlake Drive, Austin, TX 78746',
    courierName: 'FedEx Home Delivery',
    courierTrackingCode: 'FX-33918204-TX',
    estimatedDelivery: 'Delivered on Sep 14',
    currentStageIndex: 4, // Delivered
    stages: [
      {
        step: 1,
        label: 'Order received',
        description: 'Order confirmed and queued.',
        timestamp: 'Sep 12, 09:10 AM',
        status: 'completed',
      },
      {
        step: 2,
        label: 'Details confirmed',
        description: '4 vehicle QR profiles generated.',
        timestamp: 'Sep 12, 10:00 AM',
        status: 'completed',
      },
      {
        step: 3,
        label: 'Printing & UV curing',
        description: 'Printed and weatherproofed.',
        timestamp: 'Sep 12, 04:00 PM',
        status: 'completed',
      },
      {
        step: 4,
        label: 'Shipped with courier',
        description: 'Departed Austin distribution hub.',
        timestamp: 'Sep 13, 08:30 AM',
        status: 'completed',
      },
      {
        step: 5,
        label: 'Delivered',
        description: 'Package placed safely on front porch.',
        timestamp: 'Sep 14, 02:15 PM',
        status: 'completed',
      },
    ],
  },
};
