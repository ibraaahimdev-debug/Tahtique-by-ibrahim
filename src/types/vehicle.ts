export interface VehicleRecord {
  id: string; // uuid
  owner_id?: string; // uuid fk -> users
  plate_number: string;
  state: string; // state/province code e.g. 'CA', 'WA', 'ICT'
  vehicle_model?: string;
  qr_token: string; // non-guessable, minimum 21 chars base62
  qr_svg_url: string | null; // storage path or data URI to generated SVG
  qr_generated_at: string | null; // ISO timestamp
  created_at: string;
  updated_at: string;
  revoked_at?: string | null; // set if token was replaced / invalidated

  // Optional associated customer metadata for local UI relay
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
}

export type VehicleQRStatus = 'generating' | 'ready' | 'revoked' | 'error';

export interface PublicVehicleScanData {
  isValid: boolean;
  isRevoked: boolean;
  qrToken: string;
  vehicleModel?: string;
  maskedPlate: string; // e.g. "CA • 7XYZ***"
  state: string;
  registeredAt?: string;
}

export interface MaskedContactRelayPayload {
  qrToken: string;
  presetTopic: 'lights_on' | 'blocking' | 'alarm' | 'damage' | 'custom';
  messageText: string;
  senderPhoneOrHandle?: string;
}
