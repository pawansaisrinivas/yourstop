'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Calendar, ChevronUp } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function FloatingButtons() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('floating_button_click', 'Floating', 'Scroll to top');
  };

  const scrollToBook = () => {
    const bookSection = document.getElementById('book');
    if (bookSection) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = bookSection.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      trackEvent('floating_button_click', 'Floating', 'Book Service');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end pointer-events-none">
      
      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="p-3 rounded-full bg-studio-charcoal/90 border border-studio-border text-white shadow-xl backdrop-blur-md hover:bg-studio-orange hover:border-studio-orange transition-all duration-300 pointer-events-auto"
            aria-label="Back to Top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Book Service Floating CTA */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={scrollToBook}
        className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-studio-charcoal border border-studio-orange/40 text-xs font-bold text-white shadow-glow backdrop-blur-md hover:bg-studio-orange transition-colors pointer-events-auto"
      >
        <Calendar className="w-4 h-4 text-studio-orange group-hover:text-white" />
        <span>Book Service</span>
      </motion.button>

      {/* Direct WhatsApp Chat */}
      <motion.a
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        href="https://wa.me/917995481098?text=Hi%20YourStop%20Studio,%20I'm%20interested%20in%20your%20services!"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('floating_button_click', 'Floating', 'WhatsApp Chat')}
        className="p-3.5 rounded-full bg-emerald-600 text-white shadow-2xl hover:bg-emerald-500 transition-colors pointer-events-auto flex items-center justify-center"
        aria-label="Contact on WhatsApp"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.a>

    </div>
  );
}
