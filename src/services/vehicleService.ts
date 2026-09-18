import QRCode from 'qrcode';
import type {
  VehicleRecord,
  PublicVehicleScanData,
  MaskedContactRelayPayload,
} from '../types/vehicle';

const STORAGE_KEY = 'tagtique_vehicles';
const REVOKED_STORAGE_KEY = 'tagtique_revoked_tokens';

// Cryptographically secure token generator: 24-character base62 non-guessable string
export function generateSecureQRToken(length = 24): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[bytes[i] % chars.length];
    }
    return result;
  }
  // Fallback if crypto is unavailable
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Builds the public URL payload (NEVER encodes plate, phone, or owner)
export function buildPublicScanUrl(qrToken: string): string {
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin}/v/${qrToken}`;
  }
  return `https://tagtique.app/v/${qrToken}`;
}

// Generates a print-safe vector SVG XML string
export async function generatePrintSafeSVG(
  publicScanUrl: string,
  state: string,
  plateNumber: string
): Promise<string> {
  const rawQrSvg = await QRCode.toString(publicScanUrl, {
    type: 'svg',
    margin: 1,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#111827',
      light: '#FFFFFF',
    },
  });

  const vbMatch = rawQrSvg.match(/viewBox="([^"]+)"/);
  const viewBox = vbMatch ? vbMatch[1] : '0 0 33 33';
  const innerPaths = rawQrSvg
    .replace(/<\?xml.*?\?>/g, '')
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '');

  const cleanState = (state || 'CA').toUpperCase();
  const cleanPlate = (plateNumber || 'VEHICLE').toUpperCase();

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 560" width="480" height="560">
  <defs>
    <linearGradient id="tagHeaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D6E0F5" />
      <stop offset="50%" stop-color="#EAD9EC" />
      <stop offset="100%" stop-color="#F3D6DE" />
    </linearGradient>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Background White Card -->
  <rect width="480" height="560" rx="28" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="2" filter="url(#cardShadow)"/>

  <!-- Top Accent Bar -->
  <rect x="2" y="2" width="476" height="12" rx="6" fill="url(#tagHeaderGrad)" />

  <!-- Prominent Centered Vector QR Code -->
  <svg x="40" y="32" width="400" height="400" viewBox="${viewBox}" shape-rendering="crispEdges">
    ${innerPaths}
  </svg>

  <!-- Center Shield Logo Overlay -->
  <g transform="translate(216, 208)">
    <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1.5" />
    <rect x="4" y="4" width="40" height="40" rx="8" fill="#5C3264" />
    <path d="M24 14 L30 17 L30 24 C30 28 27 31 24 33 C21 31 18 28 18 24 L18 17 Z" fill="#FFFFFF" />
  </g>

  <!-- Plate Details Pill -->
  <rect x="40" y="445" width="400" height="52" rx="14" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1.5"/>
  <text x="240" y="480" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="900" fill="#111827" letter-spacing="2">
    ${cleanState} · ${cleanPlate}
  </text>
  <text x="240" y="525" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#6B7280" letter-spacing="0.8">
    TAGTIQUE™ SMART RELAY SHIELD · SCAN TO CONTACT
  </text>
</svg>`;
}

// Convert SVG XML into a downloadable data URL
export function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

// Initial default vehicles matching existing mock orders
const INITIAL_VEHICLES: VehicleRecord[] = [
  {
    id: 'veh-482-1',
    plate_number: '7XYZ890',
    state: 'CA',
    vehicle_model: 'Tesla Model Y (White)',
    qr_token: 'ca7x890_9a8f2k3m4n5p6q7r8s',
    qr_svg_url: null,
    qr_generated_at: '2026-09-16T10:00:00Z',
    created_at: '2026-09-16T10:00:00Z',
    updated_at: '2026-09-16T10:00:00Z',
    owner_name: 'Alex Henderson',
    owner_phone: '+1 (555) 234-5678',
  },
  {
    id: 'veh-482-2',
    plate_number: '8XKJ91',
    state: 'CA',
    vehicle_model: 'Honda Civic',
    qr_token: 'ca8x91_3b4c5d6e7f8g9h1j2k',
    qr_svg_url: null,
    qr_generated_at: '2026-09-16T10:00:00Z',
    created_at: '2026-09-16T10:00:00Z',
    updated_at: '2026-09-16T10:00:00Z',
    owner_name: 'Alex Henderson',
    owner_phone: '+1 (555) 234-5678',
  },
  {
    id: 'veh-483-1',
    plate_number: '9AK-210',
    state: 'WA',
    vehicle_model: 'Subaru Outback',
    qr_token: 'wa9ak210_7m8n9p1q2r3s4t5u',
    qr_svg_url: null,
    qr_generated_at: '2026-09-16T11:00:00Z',
    created_at: '2026-09-16T11:00:00Z',
    updated_at: '2026-09-16T11:00:00Z',
    owner_name: 'David Chen',
    owner_phone: '+1 (555) 345-6789',
  },
  {
    id: 'veh-484-1',
    plate_number: '392-BKV',
    state: 'IL',
    vehicle_model: 'Audi Q7',
    qr_token: 'il392bkv_1x2y3z4a5b6c7d8e',
    qr_svg_url: null,
    qr_generated_at: '2026-09-16T12:00:00Z',
    created_at: '2026-09-16T12:00:00Z',
    updated_at: '2026-09-16T12:00:00Z',
    owner_name: 'Elena Rostova',
    owner_phone: '+1 (555) 456-7890',
  },
];

// Reactive Vehicle Service Manager
class VehicleService {
  private vehicles: VehicleRecord[] = [];
  private revokedTokens: Set<string> = new Set();
  private listeners: Set<(vehicles: VehicleRecord[]) => void> = new Set();
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          this.vehicles = JSON.parse(stored);
        } else {
          this.vehicles = [...INITIAL_VEHICLES];
          this.saveToStorage();
        }

        const storedRevoked = localStorage.getItem(REVOKED_STORAGE_KEY);
        if (storedRevoked) {
          const list: string[] = JSON.parse(storedRevoked);
          this.revokedTokens = new Set(list);
        }
      } catch (e) {
        console.error('Error initializing VehicleService from localStorage:', e);
        this.vehicles = [...INITIAL_VEHICLES];
      }
    } else {
      this.vehicles = [...INITIAL_VEHICLES];
    }

    // Pre-generate or upgrade SVGs to the new prominent layout
    this.vehicles.forEach((v) => {
      const needsUpgrade =
        !v.qr_svg_url ||
        v.qr_svg_url.includes('480%20540') ||
        v.qr_svg_url.includes('translate');
      if (needsUpgrade && !v.revoked_at) {
        this.triggerAsyncSVGGeneration(v.id);
      }
    });
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.vehicles));
      localStorage.setItem(
        REVOKED_STORAGE_KEY,
        JSON.stringify(Array.from(this.revokedTokens))
      );
    } catch (e) {
      console.error('Failed to persist vehicles:', e);
    }
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((listener) => {
      try {
        listener([...this.vehicles]);
      } catch (e) {
        console.error('Listener error:', e);
      }
    });
  }

  public subscribe(callback: (vehicles: VehicleRecord[]) => void): () => void {
    this.listeners.add(callback);
    callback([...this.vehicles]);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public getAllVehicles(): VehicleRecord[] {
    return [...this.vehicles];
  }

  public getVehicleById(id: string): VehicleRecord | undefined {
    return this.vehicles.find((v) => v.id === id);
  }

  public getVehicleByPlate(plate: string): VehicleRecord | undefined {
    const clean = plate.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
    return this.vehicles.find(
      (v) => v.plate_number.replace(/[^A-Za-z0-9]/g, '').toLowerCase() === clean
    );
  }

  // Looks up vehicle by non-guessable qr_token only (for public scan /v/{qr_token})
  public lookupByQRToken(qrToken: string): PublicVehicleScanData {
    if (this.revokedTokens.has(qrToken)) {
      return {
        isValid: false,
        isRevoked: true,
        qrToken,
        maskedPlate: '••• · ••••',
        state: '••',
      };
    }

    const vehicle = this.vehicles.find((v) => v.qr_token === qrToken);
    if (!vehicle) {
      return {
        isValid: false,
        isRevoked: false,
        qrToken,
        maskedPlate: 'UNKNOWN',
        state: 'NA',
      };
    }

    if (vehicle.revoked_at) {
      return {
        isValid: false,
        isRevoked: true,
        qrToken,
        maskedPlate: '••• · ••••',
        state: vehicle.state,
      };
    }

    // Mask plate number to preserve privacy while confirming match
    const p = vehicle.plate_number;
    const masked =
      p.length > 3
        ? `${p.slice(0, 2)}${'*'.repeat(Math.max(2, p.length - 3))}${p.slice(-1)}`
        : `${p}***`;

    return {
      isValid: true,
      isRevoked: false,
      qrToken,
      vehicleModel: vehicle.vehicle_model || 'Registered Vehicle',
      maskedPlate: `${vehicle.state} · ${masked.toUpperCase()}`,
      state: vehicle.state,
      registeredAt: vehicle.created_at,
    };
  }

  // Auto-generate or save vehicle.
  // Rule: Only plate_number or state change triggers QR regeneration!
  public saveVehicle(
    data: {
      id?: string;
      plate_number: string;
      state: string;
      vehicle_model?: string;
      owner_name?: string;
      owner_phone?: string;
      owner_email?: string;
    }
  ): VehicleRecord {
    const nowIso = new Date().toISOString();
    const existingIndex = data.id
      ? this.vehicles.findIndex((v) => v.id === data.id)
      : this.vehicles.findIndex(
          (v) =>
            v.plate_number.toLowerCase().trim() === data.plate_number.toLowerCase().trim() &&
            v.state.toLowerCase().trim() === data.state.toLowerCase().trim()
        );

    // CASE 1: Updating existing vehicle
    if (existingIndex >= 0) {
      const existing = this.vehicles[existingIndex];
      const plateChanged =
        existing.plate_number.trim().toUpperCase() !== data.plate_number.trim().toUpperCase();
      const stateChanged =
        existing.state.trim().toUpperCase() !== data.state.trim().toUpperCase();

      // Only regenerate if plate or state changed!
      if (plateChanged || stateChanged) {
        // Invalidate old token
        if (existing.qr_token) {
          this.revokedTokens.add(existing.qr_token);
        }

        const newToken = generateSecureQRToken(24);
        const updatedRecord: VehicleRecord = {
          ...existing,
          plate_number: data.plate_number.trim().toUpperCase(),
          state: data.state.trim().toUpperCase(),
          vehicle_model: data.vehicle_model ?? existing.vehicle_model,
          owner_name: data.owner_name ?? existing.owner_name,
          owner_phone: data.owner_phone ?? existing.owner_phone,
          owner_email: data.owner_email ?? existing.owner_email,
          qr_token: newToken,
          qr_svg_url: null, // Reset to null so UI displays skeleton/spinner!
          qr_generated_at: null,
          revoked_at: null,
          updated_at: nowIso,
        };

        this.vehicles[existingIndex] = updatedRecord;
        this.notify();
        this.triggerAsyncSVGGeneration(updatedRecord.id);
        return updatedRecord;
      } else {
        // Unrelated fields changed (owner name, phone, model) -> KEEP SAME QR!
        const updatedRecord: VehicleRecord = {
          ...existing,
          vehicle_model: data.vehicle_model ?? existing.vehicle_model,
          owner_name: data.owner_name ?? existing.owner_name,
          owner_phone: data.owner_phone ?? existing.owner_phone,
          owner_email: data.owner_email ?? existing.owner_email,
          updated_at: nowIso,
        };
        this.vehicles[existingIndex] = updatedRecord;
        this.notify();
        return updatedRecord;
      }
    }

    // CASE 2: New vehicle record creation
    const newId = data.id || `veh-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newToken = generateSecureQRToken(24);

    const newRecord: VehicleRecord = {
      id: newId,
      plate_number: data.plate_number.trim().toUpperCase(),
      state: data.state.trim().toUpperCase() || 'CA',
      vehicle_model: data.vehicle_model || 'Vehicle',
      qr_token: newToken,
      qr_svg_url: null, // Skeleton spinner state while generating
      qr_generated_at: null,
      created_at: nowIso,
      updated_at: nowIso,
      owner_name: data.owner_name,
      owner_phone: data.owner_phone,
      owner_email: data.owner_email,
    };

    this.vehicles.unshift(newRecord);
    this.notify();
    this.triggerAsyncSVGGeneration(newRecord.id);
    return newRecord;
  }

  // Admin manual tag regeneration (e.g. for lost stickers).
  // Immediately revokes old token and issues new token.
  public regenerateQR(vehicleId: string, _reason = 'admin_manual_regeneration'): VehicleRecord | null {
    const index = this.vehicles.findIndex((v) => v.id === vehicleId);
    if (index < 0) return null;

    const existing = this.vehicles[index];
    if (existing.qr_token) {
      this.revokedTokens.add(existing.qr_token);
    }

    const newToken = generateSecureQRToken(24);
    const nowIso = new Date().toISOString();

    const updatedRecord: VehicleRecord = {
      ...existing,
      qr_token: newToken,
      qr_svg_url: null, // Triggers skeleton/spinner state
      qr_generated_at: null,
      revoked_at: null,
      updated_at: nowIso,
    };

    this.vehicles[index] = updatedRecord;
    this.notify();
    this.triggerAsyncSVGGeneration(vehicleId);
    return updatedRecord;
  }

  // Async generation simulating Edge Function execution without blocking UI
  private async triggerAsyncSVGGeneration(vehicleId: string): Promise<void> {
    const delay = 650; // realistic server edge execution delay

    setTimeout(async () => {
      const idx = this.vehicles.findIndex((v) => v.id === vehicleId);
      if (idx < 0) return;

      const vehicle = this.vehicles[idx];
      try {
        const publicUrl = buildPublicScanUrl(vehicle.qr_token);
        const svgContent = await generatePrintSafeSVG(
          publicUrl,
          vehicle.state,
          vehicle.plate_number
        );
        const svgDataUrl = svgToDataUrl(svgContent);

        this.vehicles[idx] = {
          ...vehicle,
          qr_svg_url: svgDataUrl,
          qr_generated_at: new Date().toISOString(),
        };
        this.notify();
      } catch (err) {
        console.error(`Error generating SVG for vehicle ${vehicleId}:`, err);
      }
    }, delay);
  }

  // Mock relay handler for the Public Scan page
  public sendRelayMessage(payload: MaskedContactRelayPayload): { success: boolean; message: string } {
    console.log('[Tagtique Relay Hub] Message dispatched to vehicle owner:', payload);
    return {
      success: true,
      message: 'Your message has been securely relayed to the vehicle owner via Tagtique Shield.',
    };
  }
}

export const vehicleService = new VehicleService();
