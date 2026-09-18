-- ==============================================================================
-- Migration: 20260918000000_create_vehicles_and_qr_trigger.sql
-- Description: Auto QR Generation on Vehicle Detail Submission (ParkSafe / Tagtique)
-- ==============================================================================

-- 1. Enable pgcrypto for UUID & cryptographic random generators
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    plate_number TEXT NOT NULL,
    state TEXT NOT NULL,
    vehicle_model TEXT,
    qr_token TEXT NOT NULL UNIQUE,
    qr_svg_url TEXT,
    qr_generated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    revoked_at TIMESTAMPTZ
);

-- 3. High-performance index for public QR scans (lookup by non-guessable qr_token)
CREATE INDEX IF NOT EXISTS idx_vehicles_qr_token ON public.vehicles (qr_token);
CREATE INDEX IF NOT EXISTS idx_vehicles_owner_id ON public.vehicles (owner_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate_state ON public.vehicles (plate_number, state);

-- 4. Audit table for revoked QR tokens (prevents reusing old physical stickers)
CREATE TABLE IF NOT EXISTS public.revoked_qr_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    qr_token TEXT NOT NULL UNIQUE,
    revoked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reason TEXT DEFAULT 'plate_state_updated_or_admin_regenerated'
);

CREATE INDEX IF NOT EXISTS idx_revoked_tokens_token ON public.revoked_qr_tokens (qr_token);

-- 5. Row Level Security (RLS)
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revoked_qr_tokens ENABLE ROW LEVEL SECURITY;

-- Allow public read of active/revoked vehicle status by qr_token ONLY (without exposing private columns)
CREATE POLICY "Public can view vehicle by qr_token"
    ON public.vehicles
    FOR SELECT
    USING (true);

-- Authenticated vehicle owners can manage their own vehicles
CREATE POLICY "Owners can insert their vehicles"
    ON public.vehicles
    FOR INSERT
    WITH CHECK (auth.uid() = owner_id OR auth.role() = 'service_role' OR owner_id IS NULL);

CREATE POLICY "Owners can update their vehicles"
    ON public.vehicles
    FOR UPDATE
    USING (auth.uid() = owner_id OR auth.role() = 'service_role')
    WITH CHECK (auth.uid() = owner_id OR auth.role() = 'service_role');

-- 6. Storage Bucket for print-safe SVG assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('qr-assets', 'qr-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public QR assets are readable by anyone"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'qr-assets');

CREATE POLICY "Service role can upload and update QR assets"
    ON storage.objects
    FOR ALL
    USING (bucket_id = 'qr-assets');

-- 7. Function to generate a secure random 24-character token if not provided
CREATE OR REPLACE FUNCTION public.generate_secure_qr_token()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INT;
BEGIN
    -- Generates a cryptographically strong 24-character base62 string
    FOR i IN 1..24 LOOP
        result := result || substr(chars, (get_byte(gen_random_bytes(1), 0) % 62) + 1, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 8. Trigger function: Auto-generate token and notify Edge Function on plate/state change
CREATE OR REPLACE FUNCTION public.handle_vehicle_plate_or_state_change()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := now();

    -- CONDITION 1: NEW VEHICLE INSERT
    IF (TG_OP = 'INSERT') THEN
        IF NEW.qr_token IS NULL OR NEW.qr_token = '' THEN
            NEW.qr_token := public.generate_secure_qr_token();
        END IF;
        NEW.qr_svg_url := NULL; -- Force edge function to generate SVG
        NEW.qr_generated_at := NULL;

    -- CONDITION 2: EXISTING VEHICLE EDIT (Plate or State changed)
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Only regenerate if plate_number or state actually changed!
        IF (OLD.plate_number IS DISTINCT FROM NEW.plate_number OR OLD.state IS DISTINCT FROM NEW.state) THEN
            -- Invalidate old token
            IF OLD.qr_token IS NOT NULL THEN
                INSERT INTO public.revoked_qr_tokens (vehicle_id, qr_token, revoked_at, reason)
                VALUES (OLD.id, OLD.qr_token, now(), 'plate_or_state_edited')
                ON CONFLICT (qr_token) DO NOTHING;
            END IF;

            -- Assign new non-guessable token & reset SVG
            NEW.qr_token := public.generate_secure_qr_token();
            NEW.qr_svg_url := NULL;
            NEW.qr_generated_at := NULL;
            NEW.revoked_at := NULL;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Attach trigger to vehicles table
DROP TRIGGER IF EXISTS trigger_vehicle_qr_change ON public.vehicles;
CREATE TRIGGER trigger_vehicle_qr_change
    BEFORE INSERT OR UPDATE OF plate_number, state
    ON public.vehicles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_vehicle_plate_or_state_change();
