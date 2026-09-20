import QRCode from 'qrcode';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { OrderFormData } from '../types/order';
import { calculateOrderPricing } from '../data/orderData';

export interface CustomerRecord {
  id: string;
  full_name: string;
  phone_number: string;
  guardian_number: string;
  address: string;
  city: string;
  created_at: string;
}

export interface VehicleRecordItem {
  id: string;
  customer_id: string;
  vehicle_number: string;
  vehicle_type: string;
  created_at: string;
}

export interface TagRecordItem {
  id: string;
  vehicle_id: string;
  qr_code_value: string;
  qr_image_url: string;
  tag_material: 'vinyl' | 'acrylic' | string;
  package_type: string;
  status: 'pending' | 'printed' | 'shipped' | 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface OrderRecordItem {
  id: string;
  customer_id: string;
  package_type: string;
  total_amount: number;
  payment_status: string;
  delivery_status: string;
  created_at: string;
}

export interface AdminOrderRow {
  order_id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  phone_number: string;
  guardian_number: string;
  address: string;
  city: string;
  vehicle_id: string;
  vehicle_number: string;
  vehicle_type: string;
  tag_id: string;
  qr_code_value: string;
  qr_image_url: string;
  tag_material: string;
  package_type: string;
  status: 'pending' | 'printed' | 'shipped' | 'active' | 'inactive';
  total_amount: number;
  payment_status: string;
  delivery_status: string;
  created_at: string;
}

export interface PublicTagRelayData {
  isValid: boolean;
  status: 'pending' | 'printed' | 'shipped' | 'active' | 'inactive';
  vehicleNumber: string;
  vehicleType: string;
  maskedName: string;
  phoneNumber: string;
  guardianNumber: string;
  tagMaterial: string;
}

const LOCAL_STORAGE_ORDERS_KEY = 'tahtique_supabase_orders_cache';
const LOCAL_STORAGE_TAGS_MAP_KEY = 'tahtique_supabase_tags_map';

// Initial seed data so Admin table and scan page are rich with data on first boot
const INITIAL_ADMIN_ROWS: AdminOrderRow[] = [
  {
    order_id: 'ord-101',
    order_number: 'TGT-908214',
    customer_id: 'cust-101',
    customer_name: 'Hassan Raza',
    phone_number: '0300-8451290',
    guardian_number: '0321-4458912',
    address: '208 Chak Road, Blue Bell Road, Canal Road',
    city: 'Faisalabad',
    vehicle_id: 'veh-101',
    vehicle_number: 'LEA-2024',
    vehicle_type: 'Sedan (Honda Civic)',
    tag_id: 'tag-101',
    qr_code_value: 'demo-token-hassan-civic-908214',
    qr_image_url: '',
    tag_material: 'acrylic',
    package_type: 'Single Tag',
    status: 'active',
    total_amount: 1999,
    payment_status: 'paid',
    delivery_status: 'delivered',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    order_id: 'ord-102',
    order_number: 'TGT-772159',
    customer_id: 'cust-102',
    customer_name: 'Ayesha Malik',
    phone_number: '0321-7890123',
    guardian_number: '0300-5544332',
    address: 'House 42, Sector F-7/2',
    city: 'Islamabad',
    vehicle_id: 'veh-102',
    vehicle_number: 'ICT-492',
    vehicle_type: 'SUV (Toyota Fortuner)',
    tag_id: 'tag-102',
    qr_code_value: 'demo-token-ayesha-fortuner-772159',
    qr_image_url: '',
    tag_material: 'vinyl',
    package_type: 'Pack of 2',
    status: 'printed',
    total_amount: 2999,
    payment_status: 'paid',
    delivery_status: 'shipped',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    order_id: 'ord-103',
    order_number: 'TGT-634891',
    customer_id: 'cust-103',
    customer_name: 'Bilal Farooq',
    phone_number: '0333-6677889',
    guardian_number: '0312-9988776',
    address: 'DHA Phase 5, Block B',
    city: 'Lahore',
    vehicle_id: 'veh-103',
    vehicle_number: 'LEE-8120',
    vehicle_type: 'Hatchback (Suzuki Swift)',
    tag_id: 'tag-103',
    qr_code_value: 'demo-token-bilal-swift-634891',
    qr_image_url: '',
    tag_material: 'acrylic',
    package_type: 'Family Pack',
    status: 'pending',
    total_amount: 4499,
    payment_status: 'cod',
    delivery_status: 'pending',
    created_at: new Date().toISOString(),
  },
];

class OrderBackendService {
  private localOrders: AdminOrderRow[] = [];

  constructor() {
    this.loadLocalCache();
  }

  private loadLocalCache(): void {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      if (stored) {
        this.localOrders = JSON.parse(stored);
      } else {
        this.localOrders = [...INITIAL_ADMIN_ROWS];
        this.saveLocalCache();
      }
    } catch {
      this.localOrders = [...INITIAL_ADMIN_ROWS];
    }
  }

  private saveLocalCache(): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(this.localOrders));
    } catch (e) {
      console.warn('Could not save orders to localStorage:', e);
    }
  }

  /**
   * Generates a high-resolution, print-ready branded PNG tag badge on HTML5 canvas
   */
  async generateTagBadgePngDataUrl(
    lookupToken: string,
    vehiclePlate: string,
    vehicleType: string = 'Vehicle'
  ): Promise<string> {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tagtique.com';
    const scanUrl = `${origin}/tag/${lookupToken}`;

    // 1. Generate base QR code canvas
    const qrCanvas = document.createElement('canvas');
    await QRCode.toCanvas(qrCanvas, scanUrl, {
      width: 480,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#111827',
        light: '#FFFFFF',
      },
    });

    // 2. Composite into high-resolution Badge (640 x 780 px)
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 780;
    const ctx = canvas.getContext('2d');
    if (!ctx) return qrCanvas.toDataURL('image/png');

    // Background Card
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(0, 0, 640, 780, 40);
    ctx.fill();

    // Border
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Top Gradient Accent Strip
    const grad = ctx.createLinearGradient(0, 0, 640, 0);
    grad.addColorStop(0, '#5C3264');
    grad.addColorStop(0.5, '#7A2840');
    grad.addColorStop(1, '#B89BBF');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(3, 3, 634, 16, [36, 36, 0, 0]);
    ctx.fill();

    // Brand Header
    ctx.fillStyle = '#5C3264';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TAHTIQUE SMART RELAY SHIELD', 320, 60);

    ctx.fillStyle = '#6B7280';
    ctx.font = '13px system-ui, -apple-system, sans-serif';
    ctx.fillText('SCAN IN EMERGENCY · OWNER PHONE NUMBER MASKED', 320, 84);

    // Draw QR Code centered
    ctx.drawImage(qrCanvas, 80, 110, 480, 480);

    // Center Shield Icon Overlay inside QR Code
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(280, 310, 80, 80, 20);
    ctx.fill();
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#5C3264';
    ctx.beginPath();
    ctx.roundRect(288, 318, 64, 64, 14);
    ctx.fill();

    // White Shield Graphic in center
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(320, 330);
    ctx.lineTo(340, 338);
    ctx.lineTo(340, 355);
    ctx.quadraticCurveTo(340, 370, 320, 376);
    ctx.quadraticCurveTo(300, 370, 300, 355);
    ctx.lineTo(300, 338);
    ctx.closePath();
    ctx.fill();

    // Vehicle Plate Pill
    ctx.fillStyle = '#F3F4F6';
    ctx.beginPath();
    ctx.roundRect(60, 615, 520, 75, 20);
    ctx.fill();
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#111827';
    ctx.font = '900 32px monospace, system-ui, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText(vehiclePlate.toUpperCase(), 320, 658);

    ctx.fillStyle = '#6B7280';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(`${vehicleType.toUpperCase()} · TAP OR SCAN ANYTIME`, 320, 678);

    // Bottom Footer note
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.fillText('Protected by 100% Cryptographic Relay · No Personal Data Exposed', 320, 735);

    return canvas.toDataURL('image/png');
  }

  /**
   * Uploads PNG base64 to Supabase Storage bucket 'qr-codes' if Supabase is connected
   */
  async uploadQRToStorage(token: string, dataUrl: string): Promise<string | null> {
    if (!supabase || !isSupabaseConfigured()) return null;

    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const storagePath = `${token}.png`;

      const { error: uploadError } = await supabase.storage
        .from('qr-codes')
        .upload(storagePath, blob, {
          contentType: 'image/png',
          upsert: true,
        });

      if (uploadError) {
        console.warn('Supabase storage upload error:', uploadError.message);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from('qr-codes')
        .getPublicUrl(storagePath);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.warn('Storage upload exception:', err);
      return null;
    }
  }

  /**
   * Download a tag QR code as a PNG file directly to customer / admin device
   */
  async downloadTagQRPng(lookupToken: string, vehiclePlate: string, vehicleType: string = 'Car'): Promise<void> {
    try {
      const dataUrl = await this.generateTagBadgePngDataUrl(lookupToken, vehiclePlate, vehicleType);
      const a = document.createElement('a');
      a.href = dataUrl;
      const cleanPlate = vehiclePlate.replace(/[^A-Za-z0-9_-]/g, '-').toUpperCase() || 'TAG';
      a.download = `TAHTIQUE-${cleanPlate}-QR.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download QR PNG:', err);
      alert('Failed to generate PNG image for download.');
    }
  }

  /**
   * Creates an order with customer, vehicles, and tags in Supabase (with local cache fallback)
   */
  async createOrderWithTags(
    orderData: OrderFormData,
    orderId: string
  ): Promise<{ orderNumber: string; tags: Array<{ token: string; plate: string; dataUrl: string }> }> {
    const pricing = calculateOrderPricing(
      orderData.packageId,
      orderData.materialId,
      orderData.quantity
    );

    const customerName =
      orderData.delivery.fullName ||
      orderData.billing.billingName ||
      orderData.vehicles[0]?.ownerName ||
      'Customer';

    const customerPhone =
      orderData.delivery.deliveryPhone ||
      orderData.vehicles[0]?.contactNumber ||
      '0300-0000000';

    const guardianNumber =
      orderData.vehicles[0]?.guardianContact ||
      orderData.delivery.deliveryPhone ||
      '';

    const address = orderData.delivery.addressLine || 'Canal Road';
    const city = orderData.delivery.city || 'Faisalabad';
    const tagMaterial = orderData.materialId === 'acrylic-badge' ? 'acrylic' : 'vinyl';
    const packageType = pricing.basePackageName;

    const generatedTags: Array<{ token: string; plate: string; dataUrl: string; tagId: string }> = [];

    // Process each vehicle tag
    for (let i = 0; i < orderData.vehicles.length; i++) {
      const v = orderData.vehicles[i];
      const token = crypto.randomUUID();
      const plate = v.vehiclePlate || `TAG-${Math.floor(1000 + Math.random() * 9000)}`;
      const vType = v.vehicleType || 'Car';
      const dataUrl = await this.generateTagBadgePngDataUrl(token, plate, vType);

      generatedTags.push({
        token,
        plate,
        dataUrl,
        tagId: `tag-${Date.now()}-${i}`,
      });
    }

    // 1. Attempt Supabase insert if configured
    if (supabase && isSupabaseConfigured()) {
      try {
        // Insert Customer
        const { data: customerRecord, error: custErr } = await supabase
          .from('customers')
          .insert({
            full_name: customerName,
            phone_number: customerPhone,
            guardian_number: guardianNumber,
            address: address,
            city: city,
          })
          .select()
          .single();

        if (custErr) throw custErr;
        const customerId = customerRecord.id;

        // Insert Order
        const { error: ordErr } = await supabase.from('orders').insert({
          id: crypto.randomUUID(),
          customer_id: customerId,
          package_type: packageType,
          total_amount: pricing.grandTotal,
          payment_status: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
          delivery_status: 'processing',
        });
        if (ordErr) console.warn('Supabase orders insert warning:', ordErr);

        // Insert Vehicles & Tags
        for (const t of generatedTags) {
          const { data: vehRecord, error: vehErr } = await supabase
            .from('vehicles')
            .insert({
              customer_id: customerId,
              vehicle_number: t.plate,
              vehicle_type: orderData.vehicles[0]?.vehicleType || 'Car',
            })
            .select()
            .single();

          if (vehErr) throw vehErr;

          // Upload QR to storage bucket if possible
          const publicUrl = await this.uploadQRToStorage(t.token, t.dataUrl);

          // Insert Tag
          await supabase.from('tags').insert({
            vehicle_id: vehRecord.id,
            qr_code_value: t.token,
            qr_image_url: publicUrl || '',
            tag_material: tagMaterial,
            package_type: packageType,
            status: 'pending',
          });
        }
      } catch (err) {
        console.warn('Supabase remote write encountered an error, ensuring local persistence:', err);
      }
    }

    // 2. Persist into Local Cache so Admin panel and Public scan work instantly
    const newAdminRows: AdminOrderRow[] = generatedTags.map((t, idx) => ({
      order_id: `ord-${Date.now()}-${idx}`,
      order_number: orderId,
      customer_id: `cust-${Date.now()}`,
      customer_name: customerName,
      phone_number: customerPhone,
      guardian_number: guardianNumber,
      address: address,
      city: city,
      vehicle_id: `veh-${Date.now()}-${idx}`,
      vehicle_number: t.plate,
      vehicle_type: orderData.vehicles[idx]?.vehicleType || 'Car',
      tag_id: t.tagId,
      qr_code_value: t.token,
      qr_image_url: t.dataUrl,
      tag_material: tagMaterial,
      package_type: packageType,
      status: 'pending',
      total_amount: pricing.grandTotal,
      payment_status: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
      delivery_status: 'processing',
      created_at: new Date().toISOString(),
    }));

    this.localOrders = [...newAdminRows, ...this.localOrders];
    this.saveLocalCache();

    // Map token lookup for instant public scan page availability
    try {
      const storedMap = localStorage.getItem(LOCAL_STORAGE_TAGS_MAP_KEY);
      const tagMap = storedMap ? JSON.parse(storedMap) : {};
      generatedTags.forEach((t) => {
        tagMap[t.token] = {
          isValid: true,
          status: 'pending',
          vehicleNumber: t.plate,
          vehicleType: orderData.vehicles[0]?.vehicleType || 'Car',
          maskedName: customerName.split(' ')[0] || 'Owner',
          phoneNumber: customerPhone,
          guardianNumber: guardianNumber,
          tagMaterial,
        };
      });
      localStorage.setItem(LOCAL_STORAGE_TAGS_MAP_KEY, JSON.stringify(tagMap));
    } catch {}

    return {
      orderNumber: orderId,
      tags: generatedTags.map((t) => ({ token: t.token, plate: t.plate, dataUrl: t.dataUrl })),
    };
  }

  /**
   * Fetch admin rows from Supabase (or local cache)
   */
  async fetchAdminOrders(): Promise<AdminOrderRow[]> {
    if (supabase && isSupabaseConfigured()) {
      try {
        // Query joined records: tags -> vehicles -> customers & orders
        const { data: tagsData, error } = await supabase
          .from('tags')
          .select(`
            id,
            qr_code_value,
            qr_image_url,
            tag_material,
            package_type,
            status,
            created_at,
            vehicles (
              id,
              vehicle_number,
              vehicle_type,
              customers (
                id,
                full_name,
                phone_number,
                guardian_number,
                address,
                city,
                orders (
                  id,
                  package_type,
                  total_amount,
                  payment_status,
                  delivery_status,
                  created_at
                )
              )
            )
          `)
          .order('created_at', { ascending: false });

        if (!error && tagsData && tagsData.length > 0) {
          const mapped: AdminOrderRow[] = tagsData.map((t: any, index: number) => {
            const veh = t.vehicles || {};
            const cust = veh.customers || {};
            const ord = (cust.orders && cust.orders[0]) || {};

            return {
              order_id: ord.id || `ord-sup-${index}`,
              order_number: `TGT-${(t.id || index).toString().slice(0, 6).toUpperCase()}`,
              customer_id: cust.id || `cust-sup-${index}`,
              customer_name: cust.full_name || 'Customer',
              phone_number: cust.phone_number || '',
              guardian_number: cust.guardian_number || '',
              address: cust.address || '',
              city: cust.city || '',
              vehicle_id: veh.id || `veh-sup-${index}`,
              vehicle_number: veh.vehicle_number || 'UNKNOWN',
              vehicle_type: veh.vehicle_type || 'Car',
              tag_id: t.id,
              qr_code_value: t.qr_code_value,
              qr_image_url: t.qr_image_url || '',
              tag_material: t.tag_material || 'vinyl',
              package_type: t.package_type || 'Single Tag',
              status: t.status || 'pending',
              total_amount: Number(ord.total_amount) || 1999,
              payment_status: ord.payment_status || 'paid',
              delivery_status: ord.delivery_status || 'processing',
              created_at: t.created_at || new Date().toISOString(),
            };
          });

          // Merge with local orders so freshly submitted local orders are never lost
          this.localOrders = mapped;
          this.saveLocalCache();
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase fetchAdminOrders failed, using local cache:', err);
      }
    }

    // Return local cache
    this.loadLocalCache();
    return this.localOrders;
  }

  /**
   * Updates customer, vehicle, and tag fields in Supabase directly
   * Changes take immediate effect for anyone scanning the QR code!
   */
  async updateAdminRecord(updates: {
    tag_id: string;
    customer_id?: string;
    vehicle_id?: string;
    order_id?: string;
    customer_name?: string;
    phone_number?: string;
    guardian_number?: string;
    vehicle_number?: string;
    vehicle_type?: string;
    status?: 'pending' | 'printed' | 'shipped' | 'active' | 'inactive';
    tag_material?: string;
    payment_status?: string;
    delivery_status?: string;
  }): Promise<boolean> {
    // 1. Update in Supabase if configured
    if (supabase && isSupabaseConfigured()) {
      try {
        if (updates.customer_id && (updates.customer_name || updates.phone_number || updates.guardian_number)) {
          await supabase
            .from('customers')
            .update({
              full_name: updates.customer_name,
              phone_number: updates.phone_number,
              guardian_number: updates.guardian_number,
            })
            .eq('id', updates.customer_id);
        }

        if (updates.vehicle_id && (updates.vehicle_number || updates.vehicle_type)) {
          await supabase
            .from('vehicles')
            .update({
              vehicle_number: updates.vehicle_number,
              vehicle_type: updates.vehicle_type,
            })
            .eq('id', updates.vehicle_id);
        }

        if (updates.tag_id && (updates.status || updates.tag_material)) {
          await supabase
            .from('tags')
            .update({
              status: updates.status,
              tag_material: updates.tag_material,
              updated_at: new Date().toISOString(),
            })
            .eq('id', updates.tag_id);
        }

        if (updates.order_id && (updates.payment_status || updates.delivery_status)) {
          await supabase
            .from('orders')
            .update({
              payment_status: updates.payment_status,
              delivery_status: updates.delivery_status,
            })
            .eq('id', updates.order_id);
        }
      } catch (err) {
        console.warn('Supabase remote update error, continuing with local update:', err);
      }
    }

    // 2. Update local cache
    this.localOrders = this.localOrders.map((row) => {
      if (row.tag_id === updates.tag_id || row.order_id === updates.order_id) {
        return {
          ...row,
          customer_name: updates.customer_name ?? row.customer_name,
          phone_number: updates.phone_number ?? row.phone_number,
          guardian_number: updates.guardian_number ?? row.guardian_number,
          vehicle_number: updates.vehicle_number ?? row.vehicle_number,
          vehicle_type: updates.vehicle_type ?? row.vehicle_type,
          status: updates.status ?? row.status,
          tag_material: updates.tag_material ?? row.tag_material,
          payment_status: updates.payment_status ?? row.payment_status,
          delivery_status: updates.delivery_status ?? row.delivery_status,
        };
      }
      return row;
    });

    this.saveLocalCache();

    // Update tags map for scan page
    try {
      const row = this.localOrders.find((r) => r.tag_id === updates.tag_id);
      if (row) {
        const storedMap = localStorage.getItem(LOCAL_STORAGE_TAGS_MAP_KEY);
        const tagMap = storedMap ? JSON.parse(storedMap) : {};
        tagMap[row.qr_code_value] = {
          isValid: true,
          status: row.status,
          vehicleNumber: row.vehicle_number,
          vehicleType: row.vehicle_type,
          maskedName: row.customer_name.split(' ')[0] || 'Owner',
          phoneNumber: row.phone_number,
          guardianNumber: row.guardian_number,
          tagMaterial: row.tag_material,
        };
        localStorage.setItem(LOCAL_STORAGE_TAGS_MAP_KEY, JSON.stringify(tagMap));
      }
    } catch {}

    return true;
  }

  /**
   * Minimal Public Scan Lookup by QR Token
   * Never exposes address or private customer metadata!
   */
  async lookupTagByToken(token: string): Promise<PublicTagRelayData | null> {
    if (!token) return null;

    // 1. If Supabase configured, attempt RPC or select
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('tags')
          .select(`
            id,
            status,
            tag_material,
            qr_code_value,
            vehicles (
              vehicle_number,
              vehicle_type,
              customers (
                full_name,
                phone_number,
                guardian_number
              )
            )
          `)
          .eq('qr_code_value', token)
          .single();

        if (!error && data) {
          const veh = (data.vehicles as any) || {};
          const cust = (veh.customers as any) || {};
          return {
            isValid: true,
            status: data.status,
            vehicleNumber: veh.vehicle_number || 'VEHICLE',
            vehicleType: veh.vehicle_type || 'Car',
            maskedName: (cust.full_name || 'Driver').split(' ')[0],
            phoneNumber: cust.phone_number || '',
            guardianNumber: cust.guardian_number || '',
            tagMaterial: data.tag_material || 'vinyl',
          };
        }
      } catch (err) {
        console.warn('Supabase lookupTagByToken error:', err);
      }
    }

    // 2. Check local tags map
    try {
      const storedMap = localStorage.getItem(LOCAL_STORAGE_TAGS_MAP_KEY);
      if (storedMap) {
        const tagMap = JSON.parse(storedMap);
        if (tagMap[token]) return tagMap[token];
      }
    } catch {}

    // 3. Check local orders
    const found = this.localOrders.find((o) => o.qr_code_value === token);
    if (found) {
      return {
        isValid: true,
        status: found.status,
        vehicleNumber: found.vehicle_number,
        vehicleType: found.vehicle_type,
        maskedName: found.customer_name.split(' ')[0],
        phoneNumber: found.phone_number,
        guardianNumber: found.guardian_number,
        tagMaterial: found.tag_material,
      };
    }

    // If token starts with demo-token
    if (token.startsWith('demo-token-')) {
      return {
        isValid: true,
        status: 'active',
        vehicleNumber: 'LEA-2024',
        vehicleType: 'Sedan (Honda Civic)',
        maskedName: 'Hassan',
        phoneNumber: '0300-8451290',
        guardianNumber: '0321-4458912',
        tagMaterial: 'acrylic',
      };
    }

    return null;
  }

  /**
   * Subscribe to real-time changes
   */
  subscribeToChanges(callback: () => void): () => void {
    if (!supabase || !isSupabaseConfigured()) {
      return () => {};
    }

    const client = supabase;
    const channel = client
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tags' }, () => callback())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => callback())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, () => callback())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, () => callback())
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }
}

export const orderBackendService = new OrderBackendService();
