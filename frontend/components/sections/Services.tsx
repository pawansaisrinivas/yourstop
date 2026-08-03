'use client';

import { motion } from 'framer-motion';
import { Layout, Palette, Film, Video, Mic, PenTool, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export const servicesData = [
  {
    id: 'website-development',
    number: '01',
    title: 'Website Development',
    serviceKey: 'Website Development',
    description: 'Modern, responsive and high-performance websites tailored to brands, businesses, organizations, events and individuals.',
    capabilities: [
      'Business Websites',
      'Portfolio Websites',
      'Landing Pages',
      'Event Websites',
      'Institutional Websites',
      'Custom Web Experiences',
    ],
    ctaText: 'Book Website Development',
    icon: Layout,
  },
  {
    id: 'ui-ux-designing',
    number: '02',
    title: 'UI/UX Designing',
    serviceKey: 'UI/UX Designing',
    description: 'Beautiful and intuitive digital experiences combining aesthetics, usability, accessibility and conversion-focused thinking.',
    capabilities: [
      'Wireframes',
      'User Flows',
      'Prototypes',
      'Website UI',
      'Mobile UI',
      'Design Systems',
    ],
    ctaText: 'Book UI/UX Design',
    icon: Palette,
  },
  {
    id: 'video-editing',
    number: '03',
    title: 'Video Editing',
    serviceKey: 'Video Editing',
    description: 'Transform raw footage into polished and engaging visual stories with seamless cuts, motion graphics, and audio sync.',
    capabilities: [
      'Promotional Videos',
      'Event Videos',
      'Corporate Videos',
      'Educational Videos',
      'Social Media Videos',
      'Brand Content',
    ],
    ctaText: 'Book Video Editing',
    icon: Film,
  },
  {
    id: 'reel-making',
    number: '04',
    title: 'Reel Making',
    serviceKey: 'Reel Making',
    description: 'Create high-impact short-form content designed for modern social platforms like Instagram, YouTube Shorts, and TikTok.',
    capabilities: [
      'Promotional Reels',
      'Event Reels',
      'Trend-Based Edits',
      'Brand Reels',
      'Social Campaigns',
      'Storytelling Reels',
    ],
    ctaText: 'Book Reel Making',
    icon: Video,
  },
  {
    id: 'voice-over-services',
    number: '05',
    title: 'Voice Over Services',
    serviceKey: 'Voice Over Services',
    description: 'Provide professional multilingual voice-over services across English, Telugu, Hindi, Tamil, and Odia with studio quality clarity.',
    capabilities: [
      'English, Telugu, Hindi, Tamil & Odia',
      'Reels & Advertisements',
      'Explainer Videos',
      'Corporate Content',
      'Event Promotions',
      'Educational Content',
    ],
    ctaText: 'Book Voice Over',
    icon: Mic,
  },
  {
    id: 'content-writing',
    number: '06',
    title: 'Content Writing',
    serviceKey: 'Content Writing',
    description: 'Professional content tailored to target audience, brand voice, platform and communication objectives.',
    capabilities: [
      'Website Copy',
      'Scripts & Storyboards',
      'Social Captions',
      'Promotional Content',
      'Blogs & Articles',
      'Campaign Copy',
    ],
    ctaText: 'Book Content Writing',
    icon: PenTool,
  },
];

interface ServicesProps {
  onSelectService?: (serviceName: string) => void;
}

export default function Services({ onSelectService }: ServicesProps) {
  const handleBookService = (serviceKey: string) => {
    trackEvent('service_card_click', 'Services', serviceKey);
    
    if (onSelectService) {
      onSelectService(serviceKey);
    } else {
      // Dispatch custom event for global booking form listener
      const event = new CustomEvent('selectStudioService', { detail: { service: serviceKey } });
      window.dispatchEvent(event);
    }

    // Smooth scroll to #book
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
    <section id="services" className="py-24 bg-studio-black relative overflow-hidden">
      
      {/* Background Subtle Glow */}
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-studio-orange/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-studio-orange/10 border border-studio-orange/30 text-studio-orange text-xs font-semibold uppercase tracking-wider mb-4"
            >
              <span>Our Core Capabilities</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight"
            >
              Services Built to <span className="text-orange-gradient">Scale Your Vision</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-studio-muted max-w-md"
          >
            Select any service to instantly scroll to booking with your choice preselected.
          </motion.p>
        </div>

        {/* Services Grid (6 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                onClick={() => handleBookService(service.serviceKey)}
                className="bg-glass-card rounded-3xl p-8 border border-studio-border hover:border-studio-orange/60 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-bold text-studio-orange">
                      {service.number}
                    </span>
                    <div className="p-3 rounded-2xl bg-studio-charcoal border border-white/10 text-white group-hover:bg-studio-orange group-hover:text-white transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-6 text-2xl font-display font-bold text-white group-hover:text-studio-orange transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm text-studio-muted leading-relaxed">
                    {service.description}
                  </p>

                  {/* Capabilities List */}
                  <div className="mt-6 pt-6 border-t border-white/5 space-y-2">
                    {service.capabilities.map((cap) => (
                      <div key={cap} className="flex items-center gap-2 text-xs text-studio-white/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-studio-orange shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-8 pt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookService(service.serviceKey);
                    }}
                    className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-studio-charcoal border border-white/10 text-xs font-bold text-white group-hover:bg-studio-orange group-hover:border-studio-orange transition-all duration-300 shadow-sm"
                  >
                    <span>{service.ctaText}</span>
                    <ArrowUpRight className="w-4 h-4 text-studio-orange group-hover:text-white transition-colors" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
