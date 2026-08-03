'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Code2, PenTool, Video, FileText, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const floatingPills = [
  { icon: Code2, label: 'Website Development', color: 'border-blue-500/30 text-blue-400 bg-blue-500/10', delay: 0 },
  { icon: PenTool, label: 'UI/UX Design', color: 'border-orange-500/30 text-studio-orange bg-studio-orange/10', delay: 0.2 },
  { icon: Video, label: 'Video & Reels', color: 'border-purple-500/30 text-purple-400 bg-purple-500/10', delay: 0.4 },
  { icon: FileText, label: 'Voice & Content', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10', delay: 0.6 },
];

export default function Hero() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden bg-studio-black">
      
      {/* Dynamic Background Light Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-studio-orange/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-studio-charcoal/80 border border-studio-orange/30 text-studio-orange text-xs font-semibold tracking-wide uppercase shadow-glow mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Multidisciplinary Creative & Technology Studio</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto"
        >
          Transforming Ideas Into <br className="hidden sm:block" />
          <span className="text-orange-gradient">Powerful Digital Experiences</span>
        </motion.h1>

        {/* Motto Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 inline-block bg-studio-charcoal/60 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/10"
        >
          <p className="text-lg sm:text-xl font-mono font-bold text-studio-orange tracking-widest uppercase">
            We Write • We Design • We Build
          </p>
        </motion.div>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-studio-muted max-w-3xl mx-auto leading-relaxed"
        >
          YourStop Studio brings content creation, UI/UX design, voice artistry, video editing, and modern web engineering together under one seamless destination for startups, creators, events, and businesses.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => scrollTo('book')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold rounded-2xl bg-studio-orange text-white shadow-glow hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Book a Service</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollTo('portfolio')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-semibold rounded-2xl bg-studio-charcoal border border-studio-border text-white hover:border-studio-orange/50 transition-all duration-300"
          >
            <span>Explore Our Work</span>
          </button>
        </motion.div>

        {/* Floating Capability Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-3"
        >
          {floatingPills.map((pill) => {
            const Icon = pill.icon;
            return (
              <motion.div
                key={pill.label}
                initial={{ y: 10 }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: pill.delay }}
                className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border backdrop-blur-md text-xs font-medium ${pill.color}`}
              >
                <Icon className="w-4 h-4" />
                <span>{pill.label}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-studio-muted">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-studio-orange" />
            <span>End-to-End Execution</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-studio-orange" />
            <span>Student-Led Innovation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-studio-orange" />
            <span>Fast Turnaround</span>
          </div>
        </div>

      </div>
    </section>
  );
}
