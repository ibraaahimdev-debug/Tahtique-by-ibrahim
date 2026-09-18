// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This code is designed to run in Supabase Edge Functions (Deno 1.x / 2.x)

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
// @ts-ignore: qrcode npm specifier for Deno
import QRCode from 'npm:qrcode@1.5.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generates a cryptographically strong, non-guessable 24-character token
function generateSecureToken(length = 24): string {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let token = '';
  for (let i = 0; i < length; i++) {
    token += alphabet[bytes[i] % alphabet.length];
  }
  return token;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const publicAppUrl = Deno.env.get('PUBLIC_APP_URL') || 'https://tagtique.app';

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();

    // Payload can be either direct invocation or from Postgres trigger hook
    const vehicleId = body.vehicle_id || body.record?.id;
    if (!vehicleId) {
      return new Response(
        JSON.stringify({ error: 'Missing vehicle_id in request payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Fetch current vehicle record
    const { data: vehicle, error: fetchError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single();

    if (fetchError || !vehicle) {
      throw new Error(`Vehicle not found: ${fetchError?.message || 'Unknown error'}`);
    }

    // 2. Ensure or generate non-guessable cryptographic token (min 21 chars)
    let qrToken = vehicle.qr_token;
    if (!qrToken || qrToken.length < 21) {
      qrToken = generateSecureToken(24);
    }

    // 3. Build public scan URL (NEVER encode personal data in QR payload!)
    const publicScanUrl = `${publicAppUrl.replace(/\/$/, '')}/v/${qrToken}`;

    // 4. Render QR as print-safe vector SVG with high error correction
    const qrSvgString: string = await QRCode.toString(publicScanUrl, {
      type: 'svg',
      margin: 2,
      errorCorrectionLevel: 'H',
      width: 512,
      color: {
        dark: '#111827',
        light: '#FFFFFF',
      },
    });

    // Extract viewBox and module paths
    const vbMatch = qrSvgString.match(/viewBox="([^"]+)"/);
    const viewBox = vbMatch ? vbMatch[1] : '0 0 33 33';
    const innerPaths = qrSvgString
      .replace(/<\?xml.*?\?>/g, '')
      .replace(/<svg[^>]*>/, '')
      .replace(/<\/svg>\s*$/, '');

    // Wrap in standard SVG with vehicle caption for print queue
    const printSvgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 560" width="480" height="560">
  <defs>
    <linearGradient id="tagHeaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D6E0F5" />
      <stop offset="50%" stop-color="#EAD9EC" />
      <stop offset="100%" stop-color="#F3D6DE" />
    </linearGradient>
  </defs>

  <!-- Card Background -->
  <rect width="480" height="560" rx="28" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="2"/>
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
    ${(vehicle.state || 'CA').toUpperCase()} · ${vehicle.plate_number.toUpperCase()}
  </text>
  <text x="240" y="525" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#6B7280" letter-spacing="0.8">
    TAGTIQUE™ SMART RELAY SHIELD · SCAN TO CONTACT
  </text>
</svg>`;

    // 5. Upload SVG to Supabase Storage bucket 'qr-assets'
    const storagePath = `${vehicle.id}.svg`;
    const { error: uploadError } = await supabase.storage
      .from('qr-assets')
      .upload(storagePath, new Blob([printSvgContent], { type: 'image/svg+xml' }), {
        contentType: 'image/svg+xml',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Failed to upload SVG to storage: ${uploadError.message}`);
    }

    // 6. Get Public URL for the asset
    const { data: publicUrlData } = supabase.storage
      .from('qr-assets')
      .getPublicUrl(storagePath);

    const qrSvgUrl = publicUrlData.publicUrl;
    const nowIso = new Date().toISOString();

    // 7. Update vehicle row with qr_token, qr_svg_url, and qr_generated_at
    const { error: updateError } = await supabase
      .from('vehicles')
      .update({
        qr_token: qrToken,
        qr_svg_url: qrSvgUrl,
        qr_generated_at: nowIso,
        revoked_at: null,
      })
      .eq('id', vehicle.id);

    if (updateError) {
      throw new Error(`Failed to update vehicle record: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        vehicle_id: vehicle.id,
        qr_token: qrToken,
        qr_svg_url: qrSvgUrl,
        public_scan_url: publicScanUrl,
        qr_generated_at: nowIso,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Edge function generate-vehicle-qr error:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
