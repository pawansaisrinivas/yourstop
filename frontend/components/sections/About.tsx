'use client';

import { motion } from 'framer-motion';
import { Feather, Compass, Target, Code, PenTool, Flame, Layers } from 'lucide-react';

const pillars = [
  {
    title: 'WE WRITE',
    subtitle: 'Storytelling & Communication',
    description: 'Engaging website copy, promotional scripts, social captions, and brand communication tailored to resonate with target audiences.',
    icon: Feather,
    tag: 'Content & Scripting',
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
  },
  {
    title: 'WE DESIGN',
    subtitle: 'UI/UX & Digital Visuals',
    description: 'Intuitive user experiences, wireframes, high-fidelity interfaces, branding assets, and social visuals engineered for aesthetic impact.',
    icon: PenTool,
    tag: 'UI/UX & Graphics',
    color: 'from-orange-500/20 to-rose-500/10 border-studio-orange/40 text-studio-orange',
  },
  {
    title: 'WE BUILD',
    subtitle: 'Websites & Engineering',
    description: 'High-performance websites, web applications, landing pages, and institutional solutions built with Next.js, Tailwind, and Supabase.',
    icon: Code,
    tag: 'Web & Technology',
    color: 'from-orange-600/20 to-amber-600/10 border-orange-500/30 text-orange-300',
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-studio-charcoal/50 relative overflow-hidden">
      
      {/* Background Accent Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-studio-orange/10 border border-studio-orange/30 text-studio-orange text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>About YourStop Studio</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight"
          >
            One Studio. <span className="text-studio-orange">Complete Execution.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-studio-muted leading-relaxed"
          >
            YourStop Studio is a student-founded creative and technology studio built around bringing multiple digital capabilities under one single destination.
          </motion.p>
        </div>

        {/* Philosophy Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-glass-card rounded-3xl p-8 sm:p-10 border border-studio-border relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-studio-orange uppercase tracking-widest mb-3">
                <Layers className="w-4 h-4" />
                <span>Our Core Philosophy</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
                No more juggling five different freelancers or disconnected agencies.
              </h3>
              <p className="mt-4 text-sm sm:text-base text-studio-muted leading-relaxed">
                Instead of coordinating with separate developers, designers, editors, copywriters, and voice artists, YourStop Studio unifies all five pillars under one roof with synchronized direction and seamless delivery.
              </p>
            </div>
            
            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-studio-black/60 border border-white/5 text-center">
                <div className="text-3xl font-display font-bold text-studio-orange">1</div>
                <div className="text-xs text-studio-muted mt-1 font-medium">Single Point of Contact</div>
              </div>
              <div className="p-4 rounded-2xl bg-studio-black/60 border border-white/5 text-center">
                <div className="text-3xl font-display font-bold text-studio-orange">100%</div>
                <div className="text-xs text-studio-muted mt-1 font-medium">In-House Alignment</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3 Pillars Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className={`bg-gradient-to-b ${pillar.color} bg-studio-charcoal rounded-3xl p-8 border hover:border-studio-orange/60 transition-all duration-300 group`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-studio-black border border-white/10 text-white group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-studio-orange" />
                  </div>
                  <span className="text-[11px] font-mono tracking-wider uppercase px-3 py-1 rounded-full bg-white/5 border border-white/10 text-studio-muted">
                    {pillar.tag}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-display font-extrabold text-white group-hover:text-studio-orange transition-colors">
                  {pillar.title}
                </h3>
                <h4 className="text-xs font-mono font-medium text-studio-orange mt-1 uppercase tracking-wider">
                  {pillar.subtitle}
                </h4>
                <p className="mt-4 text-sm text-studio-muted leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Mission, Vision & Story Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-studio-black/80 border border-studio-border">
            <div className="flex items-center gap-2 text-studio-orange font-bold text-sm mb-2">
              <Compass className="w-4 h-4" />
              <span>Our Story</span>
            </div>
            <p className="text-xs sm:text-sm text-studio-muted leading-relaxed">
              Founded by passionate university innovators, YourStop Studio was born to bridge the gap between creative design, strategic writing, and modern web development.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-studio-black/80 border border-studio-border">
            <div className="flex items-center gap-2 text-studio-orange font-bold text-sm mb-2">
              <Target className="w-4 h-4" />
              <span>Mission</span>
            </div>
            <p className="text-xs sm:text-sm text-studio-muted leading-relaxed">
              To empower brands, creators, events, and businesses with high-converting, aesthetically stunning, and technologically sound digital solutions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-studio-black/80 border border-studio-border">
            <div className="flex items-center gap-2 text-studio-orange font-bold text-sm mb-2">
              <Layers className="w-4 h-4" />
              <span>Vision</span>
            </div>
            <p className="text-xs sm:text-sm text-studio-muted leading-relaxed">
              To become the premier youth-led creative technology studio recognized globally for speed, craftsmanship, and multidisciplinary excellence.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
