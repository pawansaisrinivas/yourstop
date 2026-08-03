'use client';

import { motion } from 'framer-motion';
import { Search, Compass, Paintbrush, RefreshCw, Send, Headphones, ArrowRight } from 'lucide-react';

const processSteps = [
  {
    step: '01',
    title: 'Discover',
    description: 'We dive deep into your brand, target audience, technical requirements, and core business goals to establish a clear creative brief.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Strategize',
    description: 'We architect the technical blueprint, map user flows, outline script storyboards, and align on timeline and deliverables.',
    icon: Compass,
  },
  {
    step: '03',
    title: 'Create',
    description: 'Our team crafts your custom website, designs UI/UX interfaces, edits video reels, writes scripts, or records audio.',
    icon: Paintbrush,
  },
  {
    step: '04',
    title: 'Review',
    description: 'We present the initial draft/prototype for collaborative client feedback, testing, and fine-tuning until perfection.',
    icon: RefreshCw,
  },
  {
    step: '05',
    title: 'Deliver',
    description: 'We deploy the production application, export final video/audio assets, and hand over complete master files.',
    icon: Send,
  },
  {
    step: '06',
    title: 'Support',
    description: 'We assist with implementation, domain configuration, social publishing, and ongoing technical maintenance.',
    icon: Headphones,
  },
];

export default function Process() {
  return (
    <section id="process" className="py-24 bg-studio-charcoal/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-studio-orange/10 border border-studio-orange/30 text-studio-orange text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <span>Our Workflow</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight"
          >
            Six Steps to <span className="text-studio-orange">Digital Perfection</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm sm:text-base text-studio-muted"
          >
            A transparent, collaborative, and structured roadmap from first spark to final launch.
          </motion.p>
        </div>

        {/* Timeline Grid (6 Steps) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {processSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-glass-card rounded-3xl p-8 border border-studio-border hover:border-studio-orange/60 transition-all duration-300 relative group"
              >
                {/* Step Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-3xl font-extrabold text-studio-orange/40 group-hover:text-studio-orange transition-colors">
                    {item.step}
                  </span>
                  <div className="p-3 rounded-2xl bg-studio-black border border-white/10 text-studio-orange group-hover:bg-studio-orange group-hover:text-white transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-display font-bold text-white group-hover:text-studio-orange transition-colors">
                  {item.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-studio-muted leading-relaxed">
                  {item.description}
                </p>

                {/* Connecting indicator on desktop */}
                {idx < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-20 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-studio-orange" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
