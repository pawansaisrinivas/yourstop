'use client';

import { motion } from 'framer-motion';
import { Cpu, Zap, Layers, Code2, Users, Sliders, MessageSquare, Eye, Sparkles, ShieldCheck } from 'lucide-react';

const reasons = [
  {
    title: 'Creative + Technical Expertise',
    description: 'We seamlessly combine design elegance with software engineering precision to craft digital products that stand out.',
    icon: Cpu,
  },
  {
    title: 'Fresh Student-Led Perspective',
    description: 'Brimming with high energy, contemporary digital trends, and out-of-the-box creative problem solving.',
    icon: Zap,
  },
  {
    title: 'Multi-Service Capability',
    description: 'Content, design, code, video, and voice under one single studio roof — zero multi-vendor friction.',
    icon: Layers,
  },
  {
    title: 'Modern Technology Stack',
    description: 'Engineered with Next.js 15, React 19, Tailwind CSS, Framer Motion, and Supabase for ultimate speed.',
    icon: Code2,
  },
  {
    title: 'Client-Focused Execution',
    description: 'We prioritize your specific goals, brand guidelines, target audience, and business outcomes.',
    icon: Users,
  },
  {
    title: 'Flexible & Tailored Solutions',
    description: 'Customized scope options tailored to accommodate startups, creators, events, and established institutions.',
    icon: Sliders,
  },
  {
    title: 'Fast & Direct Communication',
    description: 'Direct response via WhatsApp, Email, or Phone without corporate bureaucratic layers.',
    icon: MessageSquare,
  },
  {
    title: 'Meticulous Attention to Detail',
    description: 'From micro-animations to typographic alignment, every pixel and paragraph is polished.',
    icon: Eye,
  },
  {
    title: 'Creative Storytelling',
    description: 'We don’t just build tools — we tell compelling stories that captivate and convert.',
    icon: Sparkles,
  },
  {
    title: 'End-to-End Digital Support',
    description: 'From initial ideation to launch assistance and ongoing project refinements.',
    icon: ShieldCheck,
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="py-24 bg-studio-charcoal/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-studio-orange/10 border border-studio-orange/30 text-studio-orange text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <span>The YourStop Advantage</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight"
          >
            Why Brands & Creators <span className="text-studio-orange">Choose Us</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm sm:text-base text-studio-muted"
          >
            Uncompromising craftsmanship, youth-driven energy, and end-to-end execution.
          </motion.p>
        </div>

        {/* Reasons Grid (10 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-glass-card rounded-2xl p-6 border border-studio-border hover:border-studio-orange/40 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-studio-black border border-white/10 flex items-center justify-center text-studio-orange group-hover:scale-110 group-hover:bg-studio-orange group-hover:text-white transition-all duration-300 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-display font-bold text-white group-hover:text-studio-orange transition-colors">
                    {reason.title}
                  </h3>
                  <p className="mt-2 text-xs text-studio-muted leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
