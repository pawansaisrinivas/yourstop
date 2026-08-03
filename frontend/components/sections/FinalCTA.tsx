'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FinalCTA() {
  const scrollToBook = () => {
    const bookSection = document.getElementById('book');
    if (bookSection) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = bookSection.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-studio-black relative overflow-hidden border-t border-studio-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="bg-gradient-to-b from-studio-charcoal to-studio-black p-10 sm:p-16 rounded-3xl border border-studio-orange/40 shadow-glow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-studio-orange/10 rounded-full blur-[120px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-studio-orange/20 text-studio-orange text-xs font-mono font-bold uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready to Transform Your Project?</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight"
          >
            Have an idea? <br className="hidden sm:block" />
            <span className="text-orange-gradient">Let's bring it to life.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-studio-muted max-w-2xl mx-auto leading-relaxed"
          >
            From words and visuals to complete digital experiences — YourStop Studio is ready to build with you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-10"
          >
            <button
              onClick={scrollToBook}
              className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-studio-orange text-white font-bold text-sm shadow-glow hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
