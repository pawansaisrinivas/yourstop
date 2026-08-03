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

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      // =====================================================
      // 1. AUTHENTICATE EMAIL + PASSWORD WITH SUPABASE
      // =====================================================

      const {
        data,
        error,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user || !data.session) {
        console.error(
          '[Admin Login] Supabase authentication failed:',
          error?.message
        );

        setErrorMsg(
          'Invalid administrator email or password.'
        );

        return;
      }

      // =====================================================
      // 2. ASK BACKEND IF THIS USER IS THE ADMIN
      // =====================================================

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        'http://localhost:5000';

      const response = await fetch(
        `${apiUrl}/api/admin/stats`,
        {
          method: 'GET',

          headers: {
            Authorization:
              `Bearer ${data.session.access_token}`,

            'Content-Type': 'application/json',
          },
        }
      );

      // =====================================================
      // 3. BACKEND REJECTED USER
      // =====================================================

      if (!response.ok) {
        // Remove Supabase session immediately.
        await supabase.auth.signOut();

        if (response.status === 403) {
          setErrorMsg(
            'This account is not authorized as an administrator.'
          );
        } else if (response.status === 401) {
          setErrorMsg(
            'Authentication failed. Please sign in again.'
          );
        } else {
          setErrorMsg(
            'Unable to verify administrator access.'
          );
        }

        return;
      }

      // =====================================================
      // 4. AUTHENTICATION + ADMIN AUTHORIZATION SUCCESSFUL
      // =====================================================

      console.log(
        '[Admin Login] Administrator authenticated:',
        data.user.email
      );

      // No fake localStorage token required.
      // Supabase automatically stores the authenticated session.

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

  return (
    <div className="min-h-screen bg-studio-black text-studio-white flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-studio-orange/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full bg-studio-charcoal/90 backdrop-blur-2xl rounded-3xl p-8 border border-studio-border shadow-2xl relative z-10">

        {/* Brand Header */}
        <div className="text-center mb-8">

          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-studio-black border border-studio-orange/40 p-2 mx-auto mb-4">

            <Image
              src="/logo.png"
              alt="YourStop Studio Logo"
              fill
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

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">

            <AlertCircle className="w-4 h-4 shrink-0" />

            <span>
              {errorMsg}
            </span>

          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          {/* Email */}
          <div>

            <label className="block text-xs font-semibold text-studio-white mb-1.5">
              Admin Email Address
            </label>

            <div className="relative">

              <Mail className="w-4 h-4 text-studio-muted absolute left-3.5 top-3.5" />

              <input
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

          {/* Password */}
          <div>

            <label className="block text-xs font-semibold text-studio-white mb-1.5">
              Password
            </label>

            <div className="relative">

              <Lock className="w-4 h-4 text-studio-muted absolute left-3.5 top-3.5" />

              <input
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

          {/* Submit */}
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

            <ArrowRight className="w-4 h-4" />

          </button>

        </form>

        {/* Security Footer */}
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