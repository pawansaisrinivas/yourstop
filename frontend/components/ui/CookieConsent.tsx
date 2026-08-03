'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Check, X } from 'lucide-react';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ys_cookie_consent');
    if (!saved) {
      const timer = setTimeout(() => setShowConsent(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('ys_cookie_consent', 'granted');
    setShowConsent(false);
  };

  const declineCookies = () => {
    localStorage.setItem('ys_cookie_consent', 'essential_only');
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-6 z-50 max-w-md w-[calc(100%-3rem)] bg-studio-charcoal/95 backdrop-blur-xl border border-studio-border p-5 rounded-2xl shadow-glass"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-studio-orange/10 text-studio-orange shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cookie & Analytics Preference</h4>
              <p className="text-xs text-studio-muted mt-1 leading-relaxed">
                We use essential storage for booking operations and anonymous analytics to improve studio performance.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={acceptCookies}
                  className="px-4 py-1.5 rounded-lg bg-studio-orange text-xs font-bold text-white shadow-glow hover:bg-orange-600 transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={declineCookies}
                  className="px-4 py-1.5 rounded-lg bg-studio-black border border-white/10 text-xs font-medium text-studio-muted hover:text-white transition-colors"
                >
                  Essential Only
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
