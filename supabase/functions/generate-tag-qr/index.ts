// Supabase Edge Function: generate-tag-qr
// Triggered on order/tag creation to generate QR code and store in Supabase Storage

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
// @ts-ignore: Deno npm import
import QRCode from 'npm:qrcode@1.5.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const publicAppUrl = Deno.env.get('PUBLIC_APP_URL') || 'https://tagtique.com';

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();

    const tagId = body.tag_id || body.record?.id;
    if (!tagId) {
      return new Response(
        JSON.stringify({ error: 'Missing tag_id in payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Fetch tag and related vehicle
    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('*, vehicles(vehicle_number, vehicle_type)')
      .eq('id', tagId)
      .single();

    if (tagError || !tag) {
      throw new Error(`Tag not found: ${tagError?.message || 'Unknown error'}`);
    }

    // 2. Ensure unique lookup token (UUID)
    let token = tag.qr_code_value;
    if (!token) {
      token = crypto.randomUUID();
    }

    // 3. Form public scan URL (Never encode raw phone/name in QR)
    const scanUrl = `${publicAppUrl.replace(/\/$/, '')}/tag/${token}`;

    // 4. Generate high-resolution SVG or PNG QR
    const qrSvg: string = await QRCode.toString(scanUrl, {
      type: 'svg',
      margin: 2,
      errorCorrectionLevel: 'H',
      width: 512,
      color: {
        dark: '#1A1A1A',
        light: '#FFFFFF',
      },
    });

    // 5. Upload to Supabase Storage bucket 'qr-codes'
    const storagePath = `${token}.svg`;
    const { error: uploadError } = await supabase.storage
      .from('qr-codes')
      .upload(storagePath, new Blob([qrSvg], { type: 'image/svg+xml' }), {
        contentType: 'image/svg+xml',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // 6. Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('qr-codes')
      .getPublicUrl(storagePath);

    const qrImageUrl = publicUrlData.publicUrl;

    // 7. Update tag record
    const { error: updateError } = await supabase
      .from('tags')
      .update({
        qr_code_value: token,
        qr_image_url: qrImageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tagId);

    if (updateError) {
      throw new Error(`Failed to update tag: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        tag_id: tagId,
        qr_code_value: token,
        qr_image_url: qrImageUrl,
        scan_url: scanUrl,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
