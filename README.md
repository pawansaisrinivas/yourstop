# YourStop Studio — Full-Stack Web Application

**Motto**: We Write • We Design • We Build  
**Architecture**: Split Full-Stack Directory (`frontend/` & `backend/`)  
**Single-Page Public Experience**: Everything exists on one single page (`/`) with smooth-scrolling section hashes (`#home`, `#about`, `#services`, `#why-us`, `#portfolio`, `#process`, `#stats`, `#testimonials`, `#book`, `#contact`, `#footer`).  
**Protected Admin Portal**: Server-authorized administration routes (`/admin` and `/admin/dashboard`).

---

## 🎨 Color Palette & Branding System
- **Obsidian Black**: `#090909`
- **Charcoal Surface**: `#141414`
- **Electric Studio Orange**: `#FF7A00`
- **Snow White**: `#F8F8F8`

---

## 📂 Project Structure

```text
yourstop-studio/
├── frontend/                     # Next.js 15 App Router + React 19 + Tailwind + Framer Motion
│   ├── app/
│   │   ├── page.tsx              # Single-page public website (11 sections)
│   │   ├── layout.tsx            # Global fonts, metadata, OpenGraph, JSON-LD Schema
│   │   ├── globals.css           # Glassmorphism utilities & CSS variables
│   │   ├── admin/
│   │   │   ├── page.tsx          # Admin Sign-In Portal
│   │   │   └── dashboard/page.tsx # Admin Booking Management System
│   ├── components/
│   │   ├── navigation/Navbar.tsx # Sticky glassmorphism header with scroll-spy
│   │   ├── sections/             # All 11 single-page sections
│   │   ├── ui/                   # Floating controls & Cookie banner
│   ├── public/                   # Logo and PWA assets
│   ├── types/                    # TypeScript interfaces
│   └── package.json
└── backend/                      # Node.js + Express + Supabase + Resend + Meta WhatsApp
    ├── src/
    │   ├── server.ts             # Express API entry point
    │   ├── routes/               # API routes (/api/bookings, /api/contacts, /api/admin)
    │   ├── services/             # Supabase, Resend, WhatsApp, Turnstile, Storage
    │   └── config/               # Environment variables configuration
    ├── db/
    │   └── schema.sql            # Supabase PostgreSQL migrations, RLS & Bucket specs
    └── package.json
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies

```bash
# Install Frontend Dependencies
cd frontend
npm install

# Install Backend Dependencies
cd ../backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` in both folders:

In `frontend/.env.local`:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

In `backend/.env`:
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=YourStop Studio <notifications@yourstopstudio.com>
STUDIO_RECIPIENT_EMAIL=yourstopstudio@gmail.com
META_WHATSAPP_ACCESS_TOKEN=EAAG...
META_WHATSAPP_PHONE_NUMBER_ID=1006...
META_WHATSAPP_ADMIN_NUMBER=+919876543210
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

### 3. Run Supabase Migrations

Execute the SQL script located in `backend/db/schema.sql` inside the Supabase SQL Editor. This will create:
- Tables: `bookings`, `contacts`, `admin_profiles`, `booking_status_history`, `notification_logs`
- Private Storage Bucket: `booking-references`
- Row Level Security (RLS) policies

### 4. Launch Development Servers

```bash
# Start Backend API (Port 5000)
cd backend
npm run dev

# In a separate terminal, start Frontend App (Port 3000)
cd frontend
npm run dev
```

---

## ⚡ Key Workflows & Features

1. **Single Page Architecture (`/`)**:
   - Navigation links smooth scroll to section targets (`#home`, `#about`, `#services`, `#why-us`, `#portfolio`, `#process`, `#stats`, `#testimonials`, `#book`, `#contact`, `#footer`).
   - Clicking any Service card automatically smooth scrolls to `#book` and preselects that service in the booking form with visual highlight.

2. **Booking Submission (`#book`)**:
   - Zod validation on client & server.
   - Unique human-readable booking ID generation (`YSS-2026-A8F2K`).
   - Safe file upload up to 10MB to private Supabase Storage bucket.
   - Automated HTML emails dispatched via Resend to studio (`yourstopstudio@gmail.com`) and customer.
   - WhatsApp notification alert dispatched to studio lead & customer.
   - Celebratory in-page success confirmation state with confetti.

3. **Admin Dashboard (`/admin/dashboard`)**:
   - Protected authentication route.
   - Real-time metric cards (Total, New Leads, Active, Completed).
   - Search by ID, customer name, email, phone.
   - Filter by status & service category.
   - Update booking status with internal notes audit trail.
   - CSV export functionality.

---

## 🛡️ Vercel & Supabase Deployment Instructions

1. Push `frontend/` to Vercel.
2. Set Environment Variables in Vercel project settings.
3. Deploy `backend/` to Vercel Serverless API, Render, or Railway.
4. Verify SSL & custom domain configuration.
