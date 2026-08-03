// backend/config/env.ts

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

export const env = {
  // =====================================================
  // SERVER
  // =====================================================

  PORT: process.env.PORT || '5000',

  FRONTEND_URL:
    process.env.FRONTEND_URL ||
    'http://localhost:3000',

  // =====================================================
  // SUPABASE
  // =====================================================

  SUPABASE_URL:
    process.env.SUPABASE_URL ||
    'https://placeholder-project.supabase.co',

  SUPABASE_SERVICE_ROLE_KEY:
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'placeholder-service-role-key',

  SUPABASE_ANON_KEY:
    process.env.SUPABASE_ANON_KEY ||
    'placeholder-anon-key',

  // =====================================================
  // ADMIN
  // =====================================================

  // UUID of the ONE Supabase Auth user allowed
  // to access the admin dashboard.
  ADMIN_USER_ID:
    process.env.ADMIN_USER_ID || '',

  // =====================================================
  // RESEND EMAIL
  // =====================================================

  RESEND_API_KEY:
    process.env.RESEND_API_KEY ||
    're_demo_key',

  RESEND_FROM_EMAIL:
    process.env.RESEND_FROM_EMAIL ||
    'YourStop Studio <onboarding@resend.dev>',

  STUDIO_RECIPIENT_EMAIL:
    process.env.STUDIO_RECIPIENT_EMAIL ||
    'yourstopstudio@gmail.com',

  // =====================================================
  // META WHATSAPP
  // =====================================================

  META_WHATSAPP_ACCESS_TOKEN:
    process.env.META_WHATSAPP_ACCESS_TOKEN || '',

  META_WHATSAPP_PHONE_NUMBER_ID:
    process.env.META_WHATSAPP_PHONE_NUMBER_ID || '',

  META_WHATSAPP_BUSINESS_ACCOUNT_ID:
    process.env.META_WHATSAPP_BUSINESS_ACCOUNT_ID || '',

  META_WHATSAPP_ADMIN_NUMBER:
    process.env.META_WHATSAPP_ADMIN_NUMBER ||
    '+917995481098',

  // =====================================================
  // CLOUDFLARE TURNSTILE
  // =====================================================

  TURNSTILE_SECRET_KEY:
    process.env.TURNSTILE_SECRET_KEY ||
    '1x0000000000000000000000000000000AA',
};

// =====================================================
// SUPABASE CONFIG CHECK
// =====================================================

export const isSupabaseConfigured = () => {
  const urlValid =
    env.SUPABASE_URL.includes('.supabase.co') &&
    !env.SUPABASE_URL.includes(
      'placeholder-project'
    );

  const keyValid =
    env.SUPABASE_SERVICE_ROLE_KEY.length > 20 &&
    !env.SUPABASE_SERVICE_ROLE_KEY.includes(
      'placeholder'
    );

  return urlValid && keyValid;
};

// =====================================================
// ADMIN CONFIG CHECK
// =====================================================

export const isAdminConfigured = () => {
  return Boolean(
    env.ADMIN_USER_ID &&
    env.ADMIN_USER_ID.length > 20
  );
};

// =====================================================
// RESEND CONFIG CHECK
// =====================================================

export const isResendConfigured = () => {
  return (
    env.RESEND_API_KEY.startsWith('re_') &&
    !env.RESEND_API_KEY.includes('demo_key')
  );
};

// =====================================================
// WHATSAPP CONFIG CHECK
// =====================================================

export const isWhatsAppConfigured = () => {
  return Boolean(
    env.META_WHATSAPP_ACCESS_TOKEN &&
    env.META_WHATSAPP_PHONE_NUMBER_ID
  );
};