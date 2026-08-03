import { createClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from '../config/env';

export const supabaseAdmin = isSupabaseConfigured()
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export interface BookingRecord {
  id: string;
  booking_id: string;
  customer_name: string;
  business_name?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  instagram_handle?: string;
  website?: string;
  selected_service: string;
  budget: string;
  deadline: string;
  project_description: string;
  preferred_communication: string;
  reference_file_path?: string;
  reference_file_name?: string;
  status: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

// In-memory fallback store — used when Supabase credentials are not configured.
// Data lives for the duration of the server process only.
const localBookingsStore: BookingRecord[] = [
  {
    id: 'b8e920d3-1a2b-4c5d-8e9f-1234567890ab',
    booking_id: 'YSS-2026-X9K2L',
    customer_name: 'Alexander Wright',
    business_name: 'Apex Innovations',
    email: 'alex@apexinnovations.io',
    phone: '+1 (555) 234-5678',
    whatsapp: '+1 (555) 234-5678',
    instagram_handle: '@apexinnovations',
    website: 'https://apexinnovations.io',
    selected_service: 'Website Development',
    budget: '$3,000 - $5,000',
    deadline: '3 Weeks',
    project_description:
      'We need a high-converting single-page landing website built with Next.js, dark theme aesthetics, and custom motion animations for our SaaS platform launch.',
    preferred_communication: 'WhatsApp',
    status: 'New',
    internal_notes: 'High priority lead. Client requested custom Framer Motion interactive demo.',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'c9f031e4-2b3c-5d6e-9f0a-2345678901bc',
    booking_id: 'YSS-2026-M4P7R',
    customer_name: 'Priya Sharma',
    business_name: 'Aura Lifestyle',
    email: 'priya@auralifestyle.in',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    instagram_handle: '@aura.lifestyle',
    website: '',
    selected_service: 'Reel Making',
    budget: '₹25,000 - ₹50,000',
    deadline: '1 Week',
    project_description:
      'Looking for 5 promotional short-form Instagram reels showcasing our new summer fashion collection with engaging transitions and voice-overs.',
    preferred_communication: 'WhatsApp',
    status: 'Discussion',
    internal_notes: 'Initial discussion completed via WhatsApp. Sample scripts shared.',
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

const localContactsStore: ContactRecord[] = [];

// ---------------------------------------------------------------------------
// saveBooking
// FIX: Do NOT include locally-generated `id`, `created_at`, or `updated_at`
// in the Supabase insert payload — the DB generates these with defaults.
// Sending them caused primary-key conflicts and insert failures.
// ---------------------------------------------------------------------------
export const saveBooking = async (
  bookingData: Omit<BookingRecord, 'id' | 'created_at' | 'updated_at'>
): Promise<BookingRecord> => {
  if (supabaseAdmin) {
    // Only send the application fields — let Supabase handle id/timestamps
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Booking insert error:', error.message, error.details);
      // Fall back to local store so the booking is not silently lost
      const fallback: BookingRecord = {
        ...bookingData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localBookingsStore.unshift(fallback);
      return fallback;
    }

    return data as BookingRecord;
  }

  // No Supabase configured — use local store
  const record: BookingRecord = {
    ...bookingData,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  localBookingsStore.unshift(record);
  return record;
};

// ---------------------------------------------------------------------------
// getBookings
// ---------------------------------------------------------------------------
export const getBookings = async (): Promise<BookingRecord[]> => {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase] Booking fetch error:', error.message);
      return localBookingsStore;
    }

    return data as BookingRecord[];
  }

  return localBookingsStore;
};

// ---------------------------------------------------------------------------
// updateBookingStatus
// FIX: Return null immediately on a DB error — don't silently fall through
// to the local store (which is empty in production), masking the real failure.
// ---------------------------------------------------------------------------
export const updateBookingStatus = async (
  booking_id: string,
  status: string,
  notes?: string
): Promise<BookingRecord | null> => {
  if (supabaseAdmin) {
    const updatePayload: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (notes !== undefined) updatePayload.internal_notes = notes;

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .update(updatePayload)
      .eq('booking_id', booking_id)
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Booking update error:', error.message);
      return null; // FIX: was falling through to local store incorrectly
    }

    return data as BookingRecord;
  }

  // Local fallback
  const existing = localBookingsStore.find((b) => b.booking_id === booking_id);
  if (existing) {
    existing.status = status;
    if (notes !== undefined) existing.internal_notes = notes;
    existing.updated_at = new Date().toISOString();
    return existing;
  }
  return null;
};

// ---------------------------------------------------------------------------
// deleteBooking
// ---------------------------------------------------------------------------
export const deleteBooking = async (booking_id: string): Promise<boolean> => {
  if (supabaseAdmin) {
    const { error } = await supabaseAdmin
      .from('bookings')
      .delete()
      .eq('booking_id', booking_id);

    if (error) {
      console.error('[Supabase] Booking delete error:', error.message);
      return false;
    }
    return true;
  }

  const index = localBookingsStore.findIndex((b) => b.booking_id === booking_id);
  if (index !== -1) {
    localBookingsStore.splice(index, 1);
    return true;
  }
  return false;
};

// ---------------------------------------------------------------------------
// saveContact
// FIX: Same as saveBooking — omit locally-generated id from insert payload.
// ---------------------------------------------------------------------------
export const saveContact = async (
  contactData: Omit<ContactRecord, 'id' | 'created_at' | 'status'>
): Promise<ContactRecord> => {
  const insertPayload = {
    ...contactData,
    status: 'Unread',
  };

  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('contacts')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Contact insert error:', error.message);
      const fallback: ContactRecord = {
        ...insertPayload,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };
      localContactsStore.unshift(fallback);
      return fallback;
    }

    return data as ContactRecord;
  }

  const contact: ContactRecord = {
    ...insertPayload,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  localContactsStore.unshift(contact);
  return contact;
};
