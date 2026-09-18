import type { AdminOrder, AdminCustomer, AdminQRCodeItem } from '../types/admin';

export const INITIAL_ADMIN_ORDERS: AdminOrder[] = [
  {
    id: 'ord-1',
    orderNumber: 'TGT-000482',
    customerName: 'Alex Henderson',
    customerEmail: 'alex.henderson@example.com',
    customerPhone: '+1 (555) 234-5678',
    packageName: 'Pack of 2',
    materialName: '3M Weatherproof Vinyl Sticker',
    quantity: 2,
    totalAmount: 2499,
    orderDate: '2026-09-16',
    status: 'printing',
    vehicles: [
      { plate: 'CA • 7XYZ890', model: 'Tesla Model Y', ownerName: 'Alex Henderson', contactNumber: '+1 (555) 234-5678' },
      { plate: 'CA • 8XKJ91', model: 'Honda Civic', ownerName: 'Alex Henderson', contactNumber: '+1 (555) 234-5678' },
    ],
    deliveryAddress: {
      street: '742 Evergreen Terrace, Apt 4B',
      city: 'San Francisco',
      postalCode: '94107',
    },
    courierName: 'FedEx Express',
    courierTrackingCode: 'FX-889210492-US',
    notes: [
      { id: 'n-1', author: 'Sarah (Ops)', content: 'Verified California registration format with DMV proxy.', createdAt: 'Sep 16, 10:45 AM' },
    ],
  },
  {
    id: 'ord-2',
    orderNumber: 'TGT-000483',
    customerName: 'David Chen',
    customerEmail: 'david.chen@example.com',
    customerPhone: '+1 (555) 345-6789',
    packageName: 'Single Tag',
    materialName: '3M Weatherproof Vinyl Sticker',
    quantity: 1,
    totalAmount: 1499,
    orderDate: '2026-09-16',
    status: 'new',
    vehicles: [
      { plate: 'WA • 9AK-210', model: 'Subaru Outback', ownerName: 'David Chen', contactNumber: '+1 (555) 345-6789' },
    ],
    deliveryAddress: {
      street: '1201 3rd Ave',
      city: 'Seattle',
      postalCode: '98101',
    },
    notes: [],
  },
  {
    id: 'ord-3',
    orderNumber: 'TGT-000484',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@example.com',
    customerPhone: '+1 (555) 456-7890',
    packageName: 'Family Pack',
    materialName: 'High-Gloss Acrylic Hard Tag',
    quantity: 4,
    totalAmount: 6299,
    orderDate: '2026-09-16',
    status: 'new',
    vehicles: [
      { plate: 'IL • 392-BKV', model: 'Audi Q7', ownerName: 'Elena Rostova', contactNumber: '+1 (555) 456-7890' },
      { plate: 'IL • 882-LMA', model: 'BMW X5', ownerName: 'Pavel Rostov', contactNumber: '+1 (555) 456-7890' },
      { plate: 'IL • 104-PQZ', model: 'Toyota Prius', ownerName: 'Misha Rostov', contactNumber: '+1 (555) 456-7890' },
      { plate: 'IL • 551-ZZK', model: 'Porsche Macan', ownerName: 'Elena Rostova', contactNumber: '+1 (555) 456-7890' },
    ],
    deliveryAddress: {
      street: '401 N Michigan Ave',
      city: 'Chicago',
      postalCode: '60611',
    },
    notes: [
      { id: 'n-2', author: 'Marcus (Support)', content: 'Customer requested laser etched acrylic with black beveled border.', createdAt: 'Sep 16, 11:20 AM' },
    ],
  },
  {
    id: 'ord-4',
    orderNumber: 'TGT-000480',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.vance@example.com',
    customerPhone: '+1 (555) 777-1234',
    packageName: 'Pack of 2',
    materialName: '3M Weatherproof Vinyl Sticker',
    quantity: 2,
    totalAmount: 2499,
    orderDate: '2026-09-15',
    status: 'printing',
    vehicles: [
      { plate: 'TX • 4B7-K92', model: 'Ford F-150', ownerName: 'Marcus Vance', contactNumber: '+1 (555) 777-1234' },
      { plate: 'TX • 8C1-M45', model: 'Toyota RAV4', ownerName: 'Elena Vance', contactNumber: '+1 (555) 777-1234' },
    ],
    deliveryAddress: {
      street: '4502 Westlake Drive',
      city: 'Austin',
      postalCode: '78746',
    },
    notes: [],
  },
  {
    id: 'ord-5',
    orderNumber: 'TGT-000479',
    customerName: 'Sarah Miller',
    customerEmail: 'sarah.miller@example.com',
    customerPhone: '+1 (555) 891-2345',
    packageName: 'Single Tag',
    materialName: 'High-Gloss Acrylic Hard Tag',
    quantity: 1,
    totalAmount: 1949,
    orderDate: '2026-09-15',
    status: 'shipped',
    vehicles: [
      { plate: 'NY • EM5821', model: 'BMW 330i', ownerName: 'Sarah Miller', contactNumber: '+1 (555) 891-2345' },
    ],
    deliveryAddress: {
      street: '120 Broadway, Suite 1400',
      city: 'New York',
      postalCode: '10005',
    },
    courierName: 'DHL Express',
    courierTrackingCode: 'DHL-94281729-NY',
    notes: [
      { id: 'n-3', author: 'Ops Team', content: 'Dispatched via DHL pickup batch #44.', createdAt: 'Sep 15, 04:00 PM' },
    ],
  },
  {
    id: 'ord-6',
    orderNumber: 'TGT-000478',
    customerName: 'Jason Wright',
    customerEmail: 'jason.wright@example.com',
    customerPhone: '+1 (555) 902-3456',
    packageName: 'Pack of 2',
    materialName: '3M Weatherproof Vinyl Sticker',
    quantity: 2,
    totalAmount: 2499,
    orderDate: '2026-09-15',
    status: 'shipped',
    vehicles: [
      { plate: 'FL • 482-WGT', model: 'Jeep Wrangler', ownerName: 'Jason Wright', contactNumber: '+1 (555) 902-3456' },
      { plate: 'FL • 910-YTR', model: 'Mazda CX-5', ownerName: 'Karen Wright', contactNumber: '+1 (555) 902-3456' },
    ],
    deliveryAddress: {
      street: '880 Brickell Key Dr',
      city: 'Miami',
      postalCode: '33131',
    },
    courierName: 'FedEx Priority',
    courierTrackingCode: 'FX-771920384-FL',
    notes: [],
  },
  {
    id: 'ord-7',
    orderNumber: 'TGT-000477',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@example.com',
    customerPhone: '+1 (555) 678-9012',
    packageName: 'Single Tag',
    materialName: '3M Weatherproof Vinyl Sticker',
    quantity: 1,
    totalAmount: 1499,
    orderDate: '2026-09-14',
    status: 'delivered',
    vehicles: [
      { plate: 'CA • 6LMN451', model: 'Hyundai Ioniq 5', ownerName: 'Priya Sharma', contactNumber: '+1 (555) 678-9012' },
    ],
    deliveryAddress: {
      street: '2200 University Ave',
      city: 'Palo Alto',
      postalCode: '94301',
    },
    courierName: 'USPS Priority',
    courierTrackingCode: '9400111899562',
    notes: [],
  },
  {
    id: 'ord-8',
    orderNumber: 'TGT-000476',
    customerName: 'Michael Brown',
    customerEmail: 'm.brown@example.com',
    customerPhone: '+1 (555) 123-4567',
    packageName: 'Single Tag',
    materialName: '3M Weatherproof Vinyl Sticker',
    quantity: 1,
    totalAmount: 1499,
    orderDate: '2026-09-14',
    status: 'delivered',
    vehicles: [
      { plate: 'CO • 881-ZQP', model: 'Subaru Forester', ownerName: 'Michael Brown', contactNumber: '+1 (555) 123-4567' },
    ],
    deliveryAddress: {
      street: '1701 Wynkoop St',
      city: 'Denver',
      postalCode: '80202',
    },
    courierName: 'FedEx Ground',
    courierTrackingCode: 'FX-662910283-CO',
    notes: [],
  },
  {
    id: 'ord-9',
    orderNumber: 'TGT-000475',
    customerName: 'Claire Dupont',
    customerEmail: 'claire.d@example.com',
    customerPhone: '+1 (555) 234-9876',
    packageName: 'Pack of 2',
    materialName: 'High-Gloss Acrylic Hard Tag',
    quantity: 2,
    totalAmount: 3399,
    orderDate: '2026-09-13',
    status: 'delivered',
    vehicles: [
      { plate: 'MA • 572-CD9', model: 'Volvo XC60', ownerName: 'Claire Dupont', contactNumber: '+1 (555) 234-9876' },
      { plate: 'MA • 118-KL4', model: 'Mini Cooper', ownerName: 'Claire Dupont', contactNumber: '+1 (555) 234-9876' },
    ],
    deliveryAddress: {
      street: '500 Boylston St',
      city: 'Boston',
      postalCode: '02116',
    },
    courierName: 'UPS Ground',
    courierTrackingCode: '1Z9999999999999999',
    notes: [],
  },
  {
    id: 'ord-10',
    orderNumber: 'TGT-000474',
    customerName: 'Robert Martinez',
    customerEmail: 'robert.m@example.com',
    customerPhone: '+1 (555) 345-0987',
    packageName: 'Single Tag',
    materialName: '3M Weatherproof Vinyl Sticker',
    quantity: 1,
    totalAmount: 1499,
    orderDate: '2026-09-13',
    status: 'cancelled',
    vehicles: [
      { plate: 'AZ • 491-RTM', model: 'Chevy Silverado', ownerName: 'Robert Martinez', contactNumber: '+1 (555) 345-0987' },
    ],
    deliveryAddress: {
      street: '100 E Washington St',
      city: 'Phoenix',
      postalCode: '85004',
    },
    notes: [
      { id: 'n-4', author: 'Support', content: 'Customer cancelled prior to print queue: vehicle sold.', createdAt: 'Sep 13, 01:15 PM' },
    ],
  },
  {
    id: 'ord-11',
    orderNumber: 'TGT-000473',
    customerName: 'Samantha Brooks',
    customerEmail: 's.brooks@example.com',
    customerPhone: '+1 (555) 456-1122',
    packageName: 'Family Pack',
    materialName: '3M Weatherproof Vinyl Sticker',
    quantity: 4,
    totalAmount: 4499,
    orderDate: '2026-09-12',
    status: 'delivered',
    vehicles: [
      { plate: 'CA • 7ABC111', model: 'Honda Odyssey', ownerName: 'Samantha Brooks', contactNumber: '+1 (555) 456-1122' },
      { plate: 'CA • 7ABC222', model: 'Tesla Model 3', ownerName: 'Dan Brooks', contactNumber: '+1 (555) 456-1122' },
      { plate: 'CA • 7ABC333', model: 'Toyota Camry', ownerName: 'Sam Brooks', contactNumber: '+1 (555) 456-1122' },
      { plate: 'CA • 7ABC444', model: 'Ford Bronco', ownerName: 'Samantha Brooks', contactNumber: '+1 (555) 456-1122' },
    ],
    deliveryAddress: {
      street: '350 S Grand Ave',
      city: 'Los Angeles',
      postalCode: '90071',
    },
    courierName: 'FedEx Express',
    courierTrackingCode: 'FX-551920194-LA',
    notes: [],
  },
  {
    id: 'ord-12',
    orderNumber: 'TGT-000472',
    customerName: 'Lucas Kim',
    customerEmail: 'lucas.kim@example.com',
    customerPhone: '+1 (555) 567-2233',
    packageName: 'Pack of 2',
    materialName: 'High-Gloss Acrylic Hard Tag',
    quantity: 2,
    totalAmount: 3399,
    orderDate: '2026-09-12',
    status: 'delivered',
    vehicles: [
      { plate: 'GA • 991-LK1', model: 'Kia EV6', ownerName: 'Lucas Kim', contactNumber: '+1 (555) 567-2233' },
      { plate: 'GA • 442-LK2', model: 'Genesis GV70', ownerName: 'Hannah Kim', contactNumber: '+1 (555) 567-2233' },
    ],
    deliveryAddress: {
      street: '1075 Peachtree St NE',
      city: 'Atlanta',
      postalCode: '30309',
    },
    courierName: 'USPS Priority',
    courierTrackingCode: '9400111899588',
    notes: [],
  },
];

export const INITIAL_ADMIN_CUSTOMERS: AdminCustomer[] = [
  {
    id: 'cust-1',
    name: 'Alex Henderson',
    email: 'alex.henderson@example.com',
    phone: '+1 (555) 234-5678',
    totalOrders: 2,
    lifetimeSpend: 4998,
    lastOrderDate: '2026-09-16',
    city: 'San Francisco, CA',
  },
  {
    id: 'cust-2',
    name: 'David Chen',
    email: 'david.chen@example.com',
    phone: '+1 (555) 345-6789',
    totalOrders: 1,
    lifetimeSpend: 1499,
    lastOrderDate: '2026-09-16',
    city: 'Seattle, WA',
  },
  {
    id: 'cust-3',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+1 (555) 456-7890',
    totalOrders: 3,
    lifetimeSpend: 11297,
    lastOrderDate: '2026-09-16',
    city: 'Chicago, IL',
  },
  {
    id: 'cust-4',
    name: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    phone: '+1 (555) 777-1234',
    totalOrders: 2,
    lifetimeSpend: 4998,
    lastOrderDate: '2026-09-15',
    city: 'Austin, TX',
  },
  {
    id: 'cust-5',
    name: 'Sarah Miller',
    email: 'sarah.miller@example.com',
    phone: '+1 (555) 891-2345',
    totalOrders: 1,
    lifetimeSpend: 1949,
    lastOrderDate: '2026-09-15',
    city: 'New York, NY',
  },
  {
    id: 'cust-6',
    name: 'Jason Wright',
    email: 'jason.wright@example.com',
    phone: '+1 (555) 902-3456',
    totalOrders: 1,
    lifetimeSpend: 2499,
    lastOrderDate: '2026-09-15',
    city: 'Miami, FL',
  },
  {
    id: 'cust-7',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+1 (555) 678-9012',
    totalOrders: 2,
    lifetimeSpend: 2998,
    lastOrderDate: '2026-09-14',
    city: 'Palo Alto, CA',
  },
  {
    id: 'cust-8',
    name: 'Samantha Brooks',
    email: 's.brooks@example.com',
    phone: '+1 (555) 456-1122',
    totalOrders: 1,
    lifetimeSpend: 4499,
    lastOrderDate: '2026-09-12',
    city: 'Los Angeles, CA',
  },
];

export const INITIAL_ADMIN_QR_CODES: AdminQRCodeItem[] = [
  { id: 'qr-1', qrId: 'QR-000482-1', orderNumber: 'TGT-000482', customerName: 'Alex Henderson', plateNumber: 'CA • 7XYZ890', generatedDate: '2026-09-16', scanCount: 14, status: 'active' },
  { id: 'qr-2', qrId: 'QR-000482-2', orderNumber: 'TGT-000482', customerName: 'Alex Henderson', plateNumber: 'CA • 8XKJ91', generatedDate: '2026-09-16', scanCount: 3, status: 'active' },
  { id: 'qr-3', qrId: 'QR-000483-1', orderNumber: 'TGT-000483', customerName: 'David Chen', plateNumber: 'WA • 9AK-210', generatedDate: '2026-09-16', scanCount: 0, status: 'pending' },
  { id: 'qr-4', qrId: 'QR-000484-1', orderNumber: 'TGT-000484', customerName: 'Elena Rostova', plateNumber: 'IL • 392-BKV', generatedDate: '2026-09-16', scanCount: 0, status: 'pending' },
  { id: 'qr-5', qrId: 'QR-000484-2', orderNumber: 'TGT-000484', customerName: 'Elena Rostova', plateNumber: 'IL • 882-LMA', generatedDate: '2026-09-16', scanCount: 0, status: 'pending' },
  { id: 'qr-6', qrId: 'QR-000479-1', orderNumber: 'TGT-000479', customerName: 'Sarah Miller', plateNumber: 'NY • EM5821', generatedDate: '2026-09-15', scanCount: 22, status: 'active' },
  { id: 'qr-7', qrId: 'QR-000478-1', orderNumber: 'TGT-000478', customerName: 'Jason Wright', plateNumber: 'FL • 482-WGT', generatedDate: '2026-09-15', scanCount: 8, status: 'active' },
  { id: 'qr-8', qrId: 'QR-000477-1', orderNumber: 'TGT-000477', customerName: 'Priya Sharma', plateNumber: 'CA • 6LMN451', generatedDate: '2026-09-14', scanCount: 45, status: 'active' },
  { id: 'qr-9', qrId: 'QR-000474-1', orderNumber: 'TGT-000474', customerName: 'Robert Martinez', plateNumber: 'AZ • 491-RTM', generatedDate: '2026-09-13', scanCount: 0, status: 'revoked' },
];

export function getStoredAdminOrders(): AdminOrder[] {
  if (typeof window === 'undefined') return INITIAL_ADMIN_ORDERS;
  try {
    const saved = localStorage.getItem('tagtique_admin_orders');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read orders from localStorage:', e);
  }
  return INITIAL_ADMIN_ORDERS;
}

export function registerNewAdminOrder(order: AdminOrder): void {
  INITIAL_ADMIN_ORDERS.unshift(order);
  if (typeof window !== 'undefined') {
    try {
      const current = getStoredAdminOrders();
      const updated = [order, ...current.filter((o) => o.id !== order.id && o.orderNumber !== order.orderNumber)];
      localStorage.setItem('tagtique_admin_orders', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save order to localStorage:', e);
    }
  }
}
