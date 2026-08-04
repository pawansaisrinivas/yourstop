export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  capabilities: string[];
  ctaText: string;
  iconName: string;
}

/* =========================================================
   PORTFOLIO
========================================================= */

export type PortfolioCategory =
  | 'Web'
  | 'Marketing'
  | 'Events';

export interface PortfolioProject {
  id: string;
  name: string;
  client: string;
  category: PortfolioCategory;
  challenge: string;
  solution: string;
  deliverables: string[];
  results: string[];
  image: string;
  tags: string[];
}

/* =========================================================
   TESTIMONIALS
========================================================= */

export interface TestimonialItem {
  id: string;
  name: string;
  organization: string;
  role: string;
  service: string;
  quote: string;
  rating: number;
  avatar: string;
}

/* =========================================================
   STATS
========================================================= */

export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  description: string;
}

/* =========================================================
   BOOKING FORM
========================================================= */

export interface BookingFormData {
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

  preferred_communication:
    | 'WhatsApp'
    | 'Phone'
    | 'Email'
    | 'Instagram';

  terms_accepted: boolean;

  reference_file?: FileList;
}

/* =========================================================
   BOOKING RECORD
========================================================= */

export type BookingStatus =
  | 'New'
  | 'Contacted'
  | 'Discussion'
  | 'Quotation Sent'
  | 'Confirmed'
  | 'In Progress'
  | 'Review'
  | 'Completed'
  | 'Cancelled';

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

  status: BookingStatus;

  internal_notes?: string;

  created_at: string;
  updated_at: string;
}
