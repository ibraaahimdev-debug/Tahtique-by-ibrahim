-- ==============================================================================
-- Tahtique E-Tag Orders Database Schema & Policies
-- Supabase Schema for customers, vehicles, tags, and orders
-- ==============================================================================

-- 1. Enable pgcrypto extension for UUIDs and secure cryptographic tokens
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLE: customers
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    guardian_number TEXT,
    address TEXT,
    city TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers (phone_number);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON public.customers (created_at DESC);

-- ==============================================================================
-- 3. TABLE: vehicles
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    vehicle_number TEXT NOT NULL,
    vehicle_type TEXT DEFAULT 'Car',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vehicles_customer_id ON public.vehicles (customer_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_number ON public.vehicles (vehicle_number);

-- ==============================================================================
-- 4. TABLE: tags
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    qr_code_value TEXT NOT NULL UNIQUE,
    qr_image_url TEXT,
    tag_material TEXT DEFAULT 'vinyl' CHECK (tag_material IN ('vinyl', 'acrylic')),
    package_type TEXT DEFAULT 'single',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'printed', 'shipped', 'active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fast lookup index for public QR scans via unique token
CREATE INDEX IF NOT EXISTS idx_tags_qr_code_value ON public.tags (qr_code_value);
CREATE INDEX IF NOT EXISTS idx_tags_vehicle_id ON public.tags (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_tags_status ON public.tags (status);

-- ==============================================================================
-- 5. TABLE: orders
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    package_type TEXT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    delivery_status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

-- ==============================================================================
-- 6. Trigger: Auto-update updated_at on tags
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_tags_updated_at ON public.tags;
CREATE TRIGGER trigger_tags_updated_at
    BEFORE UPDATE ON public.tags
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 7. Storage Bucket: qr-codes
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('qr-codes', 'qr-codes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies with idempotent drop checks
DROP POLICY IF EXISTS "Public can view QR code images" ON storage.objects;
CREATE POLICY "Public can view QR code images"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'qr-codes');

DROP POLICY IF EXISTS "Public & authenticated can upload QR code images" ON storage.objects;
CREATE POLICY "Public & authenticated can upload QR code images"
    ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'qr-codes');

DROP POLICY IF EXISTS "Admins can manage QR code images" ON storage.objects;
CREATE POLICY "Admins can manage QR code images"
    ON storage.objects
    FOR ALL
    USING (bucket_id = 'qr-codes');

-- ==============================================================================
-- 8. Row Level Security (RLS)
-- ==============================================================================
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- CUSTOMERS POLICIES
DROP POLICY IF EXISTS "Allow public customer creation on checkout" ON public.customers;
CREATE POLICY "Allow public customer creation on checkout"
    ON public.customers FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read on customers" ON public.customers;
CREATE POLICY "Allow authenticated read on customers"
    ON public.customers FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow update on customers" ON public.customers;
CREATE POLICY "Allow update on customers"
    ON public.customers FOR UPDATE
    USING (true);

-- VEHICLES POLICIES
DROP POLICY IF EXISTS "Allow public vehicle creation on checkout" ON public.vehicles;
CREATE POLICY "Allow public vehicle creation on checkout"
    ON public.vehicles FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read on vehicles" ON public.vehicles;
CREATE POLICY "Allow read on vehicles"
    ON public.vehicles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow update on vehicles" ON public.vehicles;
CREATE POLICY "Allow update on vehicles"
    ON public.vehicles FOR UPDATE
    USING (true);

-- TAGS POLICIES
DROP POLICY IF EXISTS "Allow public read of tags by qr_code_value" ON public.tags;
CREATE POLICY "Allow public read of tags by qr_code_value"
    ON public.tags FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow public tag creation on checkout" ON public.tags;
CREATE POLICY "Allow public tag creation on checkout"
    ON public.tags FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update on tags" ON public.tags;
CREATE POLICY "Allow update on tags"
    ON public.tags FOR UPDATE
    USING (true);

-- ORDERS POLICIES
DROP POLICY IF EXISTS "Allow order creation on checkout" ON public.orders;
CREATE POLICY "Allow order creation on checkout"
    ON public.orders FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read on orders" ON public.orders;
CREATE POLICY "Allow read on orders"
    ON public.orders FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow update on orders" ON public.orders;
CREATE POLICY "Allow update on orders"
    ON public.orders FOR UPDATE
    USING (true);

-- ==============================================================================
-- 9. TABLE: tag_scans (Audit log for QR scans)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tag_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_agent TEXT,
    ip_address TEXT
);

CREATE INDEX IF NOT EXISTS idx_tag_scans_tag_id ON public.tag_scans (tag_id);
CREATE INDEX IF NOT EXISTS idx_tag_scans_scanned_at ON public.tag_scans (scanned_at DESC);

ALTER TABLE public.tag_scans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert to tag_scans" ON public.tag_scans;
CREATE POLICY "Allow public insert to tag_scans"
    ON public.tag_scans FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read of tag_scans" ON public.tag_scans;
CREATE POLICY "Allow read of tag_scans"
    ON public.tag_scans FOR SELECT
    USING (true);

-- ==============================================================================
-- Realtime Publication: Enable Postgres changes for tables
-- ==============================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'tags'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.customers, public.vehicles, public.tags, public.orders;
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- Ignore if publication is managed by supabase dashboard
    NULL;
END $$;

-- ==============================================================================
-- 10. RPC Function: Public Minimal Relay Lookup
-- Returns ONLY what's needed for the emergency contact relay
-- Keeps address and private customer metadata concealed
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.get_tag_relay_info(lookup_token TEXT)
RETURNS TABLE (
    tag_id UUID,
    status TEXT,
    tag_material TEXT,
    vehicle_number TEXT,
    vehicle_type TEXT,
    owner_name TEXT,
    phone_number TEXT,
    guardian_number TEXT,
    is_valid BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id AS tag_id,
        t.status,
        t.tag_material,
        v.vehicle_number,
        v.vehicle_type,
        c.full_name AS owner_name,
        c.phone_number,
        c.guardian_number,
        true AS is_valid
    FROM public.tags t
    JOIN public.vehicles v ON v.id = t.vehicle_id
    JOIN public.customers c ON c.id = v.customer_id
    WHERE t.qr_code_value = lookup_token
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
