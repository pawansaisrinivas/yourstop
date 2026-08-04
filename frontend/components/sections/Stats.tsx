'use client';

import { motion } from 'framer-motion';
import { StatItem } from '@/types';
import { Layers, Globe, Code, Sparkles } from 'lucide-react';

const statsList: StatItem[] = [
  { id: '1', label: 'Projects Delivered', value: 2, suffix: '+', description: 'Content & Video edits' },
  { id: '2', label: 'Creative Collaborations', value: 3, suffix: '+', description: 'Startups, creators & event teams' },
  { id: '3', label: 'Universities Served', value: 2, suffix: '', description: 'Reels, Video, Voice, Content' },
  { id: '3', label: 'Videos Produced', value: 15, suffix: '+', description: 'Reels, Video, Voice, Content' },
  { id: '4', label: 'Languages Supported', value: 5, suffix: '', description: 'English, Telugu, Hindi, Tamil, Odia' },
  { id: '3', label: 'Students Reached', value: 5000, suffix: '+', description: 'Reels, Video, Voice, Content' },
];

export default function Stats() {
  return (
    <section id="stats" className="py-20 bg-studio-black relative overflow-hidden border-y border-studio-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {statsList.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-glass-card rounded-2xl p-6 text-center border border-white/5 hover:border-studio-orange/40 transition-all duration-300 group"
            >
              <div className="text-4xl sm:text-5xl font-display font-extrabold text-white group-hover:text-studio-orange transition-colors">
                {stat.value}
                <span className="text-studio-orange">{stat.suffix}</span>
              </div>
              <h3 className="mt-2 text-sm font-bold text-white tracking-tight">
                {stat.label}
              </h3>
              <p className="mt-1 text-xs text-studio-muted">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
