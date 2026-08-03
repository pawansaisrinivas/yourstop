'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

// ============================================================================
// API CONFIGURATION
// ============================================================================

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  'https://yourstop-studio.onrender.com'
).replace(/\/+$/, '');

// ============================================================================
// ADMIN LOGIN PAGE
// ============================================================================

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  // ==========================================================================
  // LOGIN HANDLER
  // ==========================================================================

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // ======================================================================
      // 1. AUTHENTICATE WITH SUPABASE
      // ======================================================================

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

      if (error || !data.user || !data.session) {
        console.error(
          '[Admin Login] Supabase authentication failed:',
          error?.message || 'Session was not created.'
        );

        setErrorMsg(
          'Invalid administrator email or password.'
        );

        return;
      }

      // ======================================================================
      // 2. VERIFY ADMIN ACCESS WITH EXPRESS BACKEND
      // ======================================================================

      console.log(
        '[Admin Login] Verifying administrator access with:',
        `${API_BASE_URL}/api/admin/stats`
      );

      let response: Response;

      try {
        const controller = new AbortController();

        // Render may take a few seconds to wake up if the service was idle.
        const timeout = window.setTimeout(() => {
          controller.abort();
        }, 20000);

        try {
          response = await fetch(
            `${API_BASE_URL}/api/admin/stats`,
            {
              method: 'GET',

              headers: {
                Authorization: `Bearer ${data.session.access_token}`,
                Accept: 'application/json',
              },

              cache: 'no-store',
              signal: controller.signal,
            }
          );
        } finally {
          window.clearTimeout(timeout);
        }
      } catch (networkError) {
        console.error(
          '[Admin Login] Backend connection failed:',
          networkError
        );

        // Authentication succeeded, but backend verification failed.
        // Remove the Supabase session because we do not yet know whether
        // this account is authorized for the admin dashboard.
        await supabase.auth.signOut();

        if (
          networkError instanceof DOMException &&
          networkError.name === 'AbortError'
        ) {
          setErrorMsg(
            'The server is taking too long to respond. Please try again.'
          );
        } else {
          setErrorMsg(
            'Unable to connect to the admin server. Please try again.'
          );
        }

        return;
      }

      // ======================================================================
      // 3. HANDLE BACKEND REJECTION
      // ======================================================================

      if (!response.ok) {
        let backendMessage = '';

        try {
          const result = await response.json();

          backendMessage =
            result?.error ||
            result?.message ||
            '';
        } catch {
          // Backend did not return JSON.
        }

        console.error(
          '[Admin Login] Backend authorization failed:',
          response.status,
          backendMessage
        );

        // User authenticated successfully with Supabase,
        // but backend authorization failed.
        await supabase.auth.signOut();

        if (response.status === 401) {
          setErrorMsg(
            'Your authentication session is invalid or expired. Please sign in again.'
          );

          return;
        }

        if (response.status === 403) {
          setErrorMsg(
            'This account is not authorized as an administrator.'
          );

          return;
        }

        if (response.status >= 500) {
          setErrorMsg(
            'The admin server encountered an error. Please try again shortly.'
          );

          return;
        }

        setErrorMsg(
          backendMessage ||
            'Unable to verify administrator access.'
        );

        return;
      }

      // ======================================================================
      // 4. ADMIN AUTHORIZATION SUCCESS
      // ======================================================================

      console.log(
        '[Admin Login] Administrator authenticated successfully:',
        data.user.email
      );

      // Supabase persists the authenticated session automatically.
      // No custom localStorage admin token is required.

      router.replace('/admin/dashboard');
    } catch (err) {
      console.error(
        '[Admin Login] Unexpected error:',
        err
      );

      setErrorMsg(
        'Unable to sign in. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================================================
  // UI
  // ==========================================================================

  return (
    <div className="min-h-screen bg-studio-black text-studio-white flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-studio-orange/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full bg-studio-charcoal/90 backdrop-blur-2xl rounded-3xl p-8 border border-studio-border shadow-2xl relative z-10">

        {/* ================================================================
            BRAND HEADER
        ================================================================= */}

        <div className="text-center mb-8">

          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-studio-black border border-studio-orange/40 p-2 mx-auto mb-4">

            <Image
              src="/logo.png"
              alt="YourStop Studio Logo"
              fill
              priority
              sizes="64px"
              className="object-contain"
            />

          </div>

          <h1 className="text-2xl font-display font-bold text-white">
            Admin Portal Sign In
          </h1>

          <p className="text-xs text-studio-muted mt-1 font-mono">
            YourStop Studio Internal Management
          </p>

        </div>

        {/* ================================================================
            ERROR MESSAGE
        ================================================================= */}

        {errorMsg && (
          <div
            role="alert"
            className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
          >

            <AlertCircle className="w-4 h-4 shrink-0" />

            <span>
              {errorMsg}
            </span>

          </div>
        )}

        {/* ================================================================
            LOGIN FORM
        ================================================================= */}

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          {/* EMAIL */}

          <div>

            <label
              htmlFor="admin-email"
              className="block text-xs font-semibold text-studio-white mb-1.5"
            >
              Admin Email Address
            </label>

            <div className="relative">

              <Mail className="w-4 h-4 text-studio-muted absolute left-3.5 top-3.5 pointer-events-none" />

              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@yourstopstudio.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-studio-black border border-white/10 text-sm text-white placeholder-studio-muted focus:border-studio-orange focus:outline-none disabled:opacity-60"
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div>

            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold text-studio-white mb-1.5"
            >
              Password
            </label>

            <div className="relative">

              <Lock className="w-4 h-4 text-studio-muted absolute left-3.5 top-3.5 pointer-events-none" />

              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-studio-black border border-white/10 text-sm text-white placeholder-studio-muted focus:border-studio-orange focus:outline-none disabled:opacity-60"
              />

            </div>

          </div>

          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-studio-orange font-bold text-xs text-white shadow-glow hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
          >

            <span>
              {isSubmitting
                ? 'Authenticating...'
                : 'Sign In to Dashboard'}
            </span>

            {!isSubmitting && (
              <ArrowRight className="w-4 h-4" />
            )}

          </button>

        </form>

        {/* ================================================================
            SECURITY FOOTER
        ================================================================= */}

        <div className="mt-8 pt-6 border-t border-white/10 text-center flex items-center justify-center gap-2 text-[11px] text-studio-muted font-mono">

          <ShieldCheck className="w-3.5 h-3.5 text-studio-orange" />

          <span>
            Protected Area •
          </span>

        </div>

      </div>

    </div>
  );
}
