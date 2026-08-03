'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TestimonialItem } from '@/types';
import { Quote, Star, ChevronLeft, ChevronRight, MessageSquareQuote } from 'lucide-react';

const testimonials: TestimonialItem[] = [
  {
    id: '1',
    name: 'Vikramaditya Roy',
    role: 'Founder',
    organization: 'Apex Tech Ventures (Sample Review)',
    service: 'Website Development',
    quote: 'YourStop Studio delivered our entire landing page in record time. The dark theme design system, smooth motion physics, and clean code exceeded our expectations!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '2',
    name: 'Ananya Deshmukh',
    role: 'Creative Lead',
    organization: 'Lumina Media (Sample Review)',
    service: 'Reel Making & Voice Over',
    quote: 'The short-form reels and multilingual voice-overs gave our campaign massive reach on social media. Working with a student-led team brought incredible fresh energy.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '3',
    name: 'Rohan Verma',
    role: 'Marketing Director',
    organization: 'Krypton Events (Sample Review)',
    service: 'UI/UX & Content Writing',
    quote: 'Having copy, UI design, and development handled by one single studio saved us weeks of back-and-forth communication. Exceptional execution across all fronts.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const activeTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-24 bg-studio-charcoal/50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-studio-orange/10 border border-studio-orange/30 text-studio-orange text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Client Feedback</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight"
          >
            What Creators & Teams <span className="text-studio-orange">Say About Us</span>
          </motion.h2>
        </div>

        {/* Carousel Container */}
        <div className="relative bg-glass-card rounded-3xl p-8 sm:p-12 border border-studio-border shadow-2xl">
          <Quote className="absolute top-8 left-8 w-12 h-12 text-studio-orange/20 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-studio-orange mb-6">
                {[...Array(activeTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-lg sm:text-2xl font-display text-white leading-relaxed font-medium italic">
                "{activeTestimonial.quote}"
              </p>

              {/* Client Info */}
              <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <img
                    src={activeTestimonial.avatar}
                    alt={activeTestimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-studio-orange"
                  />
                  <div>
                    <h4 className="text-base font-bold text-white">{activeTestimonial.name}</h4>
                    <p className="text-xs text-studio-muted">
                      {activeTestimonial.role} • {activeTestimonial.organization}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-studio-orange/10 text-studio-orange">
                      Service: {activeTestimonial.service}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-studio-black border border-white/10 text-white hover:bg-studio-orange transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-studio-black border border-white/10 text-white hover:bg-studio-orange transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === idx ? 'w-8 bg-studio-orange' : 'w-2 bg-white/20'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
