-- =====================================================================
-- YourStop Studio - Supabase PostgreSQL Schema & Security Policies
-- =====================================================================

-- 1. Create Enums
CREATE TYPE booking_status AS ENUM (
  'New',
  'Contacted',
  'Discussion',
  'Quotation Sent',
  'Confirmed',
  'In Progress',
  'Review',
  'Completed',
  'Cancelled'
);

CREATE TYPE communication_pref AS ENUM (
  'WhatsApp',
  'Phone',
  'Email',
  'Instagram'
);

-- 2. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id VARCHAR(32) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  business_name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  whatsapp VARCHAR(50),
  instagram_handle VARCHAR(100),
  website VARCHAR(255),
  selected_service VARCHAR(100) NOT NULL,
  budget VARCHAR(100) NOT NULL,
  deadline VARCHAR(100) NOT NULL,
  project_description TEXT NOT NULL,
  preferred_communication communication_pref NOT NULL DEFAULT 'WhatsApp',
  reference_file_path TEXT,
  reference_file_name VARCHAR(255),
  status booking_status NOT NULL DEFAULT 'New',
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Contacts Table
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Unread',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Admin Profiles Table
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Booking Status History Table (Audit Trail)
CREATE TABLE IF NOT EXISTS public.booking_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id VARCHAR(32) REFERENCES public.bookings(booking_id) ON DELETE CASCADE,
  old_status booking_status,
  new_status booking_status NOT NULL,
  changed_by VARCHAR(255) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Notification Logs Table
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id VARCHAR(32) REFERENCES public.bookings(booking_id) ON DELETE SET NULL,
  channel VARCHAR(50) NOT NULL, -- 'RESEND_EMAIL' or 'META_WHATSAPP'
  recipient VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL, -- 'SUCCESS' or 'FAILED'
  error_message TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Indexes for Query Performance
CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON public.bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);

-- 8. Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bookings_modtime
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- =====================================================================
-- Row Level Security (RLS) Policies
-- =====================================================================

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors to INSERT bookings (submissions)
CREATE POLICY "Allow public insert into bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

-- Only authenticated admins can SELECT, UPDATE, DELETE bookings
CREATE POLICY "Allow authenticated admins select bookings"
  ON public.bookings FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admins update bookings"
  ON public.bookings FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admins delete bookings"
  ON public.bookings FOR DELETE
  USING (auth.role() = 'authenticated');

-- Contacts RLS
CREATE POLICY "Allow public insert into contacts"
  ON public.contacts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated admins select contacts"
  ON public.contacts FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin Profiles RLS
CREATE POLICY "Allow authenticated admins to read admin profiles"
  ON public.admin_profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- Status History & Notification Logs RLS
CREATE POLICY "Allow authenticated admins status history access"
  ON public.booking_status_history FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admins notification logs access"
  ON public.notification_logs FOR ALL
  USING (auth.role() = 'authenticated');

-- =====================================================================
-- Storage Bucket Setup (Private Bucket for Booking Reference Files)
-- =====================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'booking-references',
  'booking-references',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage RLS Policy: Anyone can upload a file during booking
CREATE POLICY "Allow public upload to booking-references"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'booking-references');

-- Only authenticated admins can download/view uploaded reference files
CREATE POLICY "Allow admin download from booking-references"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'booking-references' AND auth.role() = 'authenticated');
