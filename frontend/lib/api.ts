import { BookingRecord } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yourstop-studio.onrender.com';

// ---------------------------------------------------------------------------
// Backend availability probe — cached per page session so we only hit
// the network once and never surface raw "TypeError: Failed to fetch" noise.
// ---------------------------------------------------------------------------
let _backendAvailable: boolean | null = null;

const isBackendAvailable = async (): Promise<boolean> => {
  if (_backendAvailable !== null) return _backendAvailable;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000); // 2 s timeout
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    _backendAvailable = res.ok;
  } catch {
    _backendAvailable = false;
  }
  if (!_backendAvailable) {
    console.info(
      '[YourStop Studio] Backend server is offline — running in preview/demo mode with mock data.'
    );
  }
  return _backendAvailable;
};

// ---------------------------------------------------------------------------
// Mock data — returned as a fallback when the backend is unreachable
// ---------------------------------------------------------------------------
const MOCK_BOOKINGS: BookingRecord[] = [
  {
    id: '1',
    booking_id: 'YSS-2026-A8F2K',
    customer_name: 'David Vance',
    business_name: 'Apex Digital Labs',
    email: 'david@apexdigital.com',
    phone: '+1 555-019-2834',
    whatsapp: '+1 555-019-2834',
    instagram_handle: '@apexdigital',
    website: 'https://apexdigital.com',
    selected_service: 'Website Development',
    budget: '$3,000 – $5,000',
    deadline: '2 Weeks',
    project_description:
      'We need a flagship single-page website with Framer Motion, glassmorphic UI cards, and responsive layout for our AI startup.',
    preferred_communication: 'WhatsApp',
    reference_file_name: 'brief_specification.pdf',
    status: 'New',
    internal_notes: 'Urgent project launch. Client wants immediate call.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    booking_id: 'YSS-2026-C4B9M',
    customer_name: 'Elena Rostova',
    business_name: 'Vogue Motion Studio',
    email: 'elena@voguemotion.co',
    phone: '+44 7700 900077',
    whatsapp: '+44 7700 900077',
    instagram_handle: '@vogue_motion',
    website: '',
    selected_service: 'Reel Making',
    budget: '$1,000 – $3,000',
    deadline: '1 Week',
    project_description:
      'Series of 10 fashion reels with colour grading and dynamic video editing.',
    preferred_communication: 'Email',
    status: 'In Progress',
    internal_notes: 'First draft delivered. Waiting for feedback on Reel #3.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    booking_id: 'YSS-2026-R7TQZ',
    customer_name: 'Arjun Mehta',
    business_name: 'GrowthPulse Agency',
    email: 'arjun@growthpulse.in',
    phone: '+91 98110 45678',
    whatsapp: '+91 98110 45678',
    instagram_handle: '@growthpulse',
    website: 'https://growthpulse.in',
    selected_service: 'UI/UX Designing',
    budget: '₹50,000 – ₹1,00,000',
    deadline: '3 Weeks',
    project_description:
      'Full redesign of our SaaS dashboard with modern dark-mode aesthetics and streamlined user flows.',
    preferred_communication: 'Email',
    status: 'Quotation Sent',
    internal_notes: 'Sent proposal on 01 Aug. Follow up by 04 Aug.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

// In-memory mock store so mutations (status updates, deletes) persist for the
// duration of the page session even in offline/demo mode.
let mockStore: BookingRecord[] = [...MOCK_BOOKINGS];

// ---------------------------------------------------------------------------
// Public API helpers
// ---------------------------------------------------------------------------

export const submitBookingForm = async (formData: FormData) => {
  const online = await isBackendAvailable();
  if (online) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit booking');
      return data;
    } catch (err: any) {
      // Server returned an error (not a network error) — surface it
      if (err.message !== 'Failed to fetch') throw err;
    }
  }

  // Offline / demo fallback
  const randomId = `YSS-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  return {
    success: true,
    message: 'Booking submitted successfully',
    data: {
      booking_id: randomId,
      customer_name: (formData.get('customer_name') as string) || 'Valued Client',
      selected_service: (formData.get('selected_service') as string) || 'Website Development',
      created_at: new Date().toISOString(),
      whatsapp_url: `https://wa.me/917995481098?text=Hi%20YourStop%20Studio!%20Following%20up%20on%20booking%20${randomId}`,
    },
  };
};

export const submitContactForm = async (contactData: any) => {
  const online = await isBackendAvailable();
  if (online) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send message');
      return data;
    } catch (err: any) {
      if (err.message !== 'Failed to fetch') throw err;
    }
  }
  return { success: true, message: 'Message sent successfully!' };
};

export const fetchAdminBookings = async (): Promise<BookingRecord[]> => {
  const online = await isBackendAvailable();
  if (online) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`);
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) return data.data;
      return [];
    } catch {
      // Fall through to mock data
    }
  }
  // Return a fresh copy of the in-memory mock store
  return [...mockStore];
};

export const updateBookingStatusOnServer = async (
  booking_id: string,
  status: string,
  notes?: string
) => {
  const online = await isBackendAvailable();
  if (online) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/${booking_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      return await response.json();
    } catch {
      // Fall through
    }
  }

  // Offline: mutate the mock store so the UI stays consistent
  const record = mockStore.find((b) => b.booking_id === booking_id);
  if (record) {
    record.status = status as any;
    if (notes !== undefined) record.internal_notes = notes;
    record.updated_at = new Date().toISOString();
  }
  return { success: true };
};

export const deleteBookingOnServer = async (
  booking_id: string
): Promise<{ success: boolean; error?: string }> => {
  const online = await isBackendAvailable();
  if (online) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/${booking_id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch {
      // Fall through
    }
  }

  // Offline: remove from the mock store so the row disappears in the UI
  mockStore = mockStore.filter((b) => b.booking_id !== booking_id);
  return { success: true };
};
