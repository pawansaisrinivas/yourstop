'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, Check, Sparkles, FolderGit2 } from 'lucide-react';
import { PortfolioProject } from '@/types';
import { trackEvent } from '@/lib/analytics';

const portfolioProjects: PortfolioProject[] = [
  {
    id: 'proj-1',
    name: 'Aura Nexus Platform',
    client: 'Demo Showcase Project',
    category: 'Web',
    tags: ['Next.js 15', 'Tailwind', 'Supabase', 'Framer Motion'],
    challenge: 'Needed a modern, high-speed single-page website to launch a creative SaaS tool with responsive dark aesthetics and smooth scrolling.',
    solution: 'Designed and engineered an obsidian-themed web application with real-time API integrations, glassmorphism cards, and zero-latency page transitions.',
    deliverables: ['Custom Web Architecture', 'UI/UX Design System', 'Supabase Backend Setup', 'Performance Optimization'],
    results: ['99/100 Google Lighthouse Score', 'Sub-second initial render', '100% Mobile Responsive'],
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'proj-2',
    name: 'Vortex Mobile Experience',
    client: 'Demo Showcase Project',
    category: 'UI/UX',
    tags: ['Figma', 'Prototyping', 'User Flows', 'Design System'],
    challenge: 'Creating an intuitive fintech mobile app interface focused on speed, micro-interactions, and high contrast accessibility.',
    solution: 'Constructed an end-to-end design system featuring dark mode palettes, interactive wireframes, component libraries, and user journey maps.',
    deliverables: ['Interactive Figma Prototypes', 'Mobile Design System', 'User Flow Maps', 'Asset Exports'],
    results: ['Streamlined 4-step transaction workflow', 'WCAG AA contrast compliant design'],
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'proj-3',
    name: 'Cinematic Brand Reel Series',
    client: 'Demo Showcase Project',
    category: 'Reels',
    tags: ['Short-Form', 'Color Grading', 'Motion Graphics', 'Sound Design'],
    challenge: 'Transforming raw horizontal event footage into high-impact vertical Instagram reels optimized for social engagement.',
    solution: 'Edited 6 dynamic 15-second reels with beat-synced visual cuts, custom text animations, and vibrant audio mixing.',
    deliverables: ['6 Vertical Reels (9:16)', 'Custom Thumbnail Covers', 'Captions & Hashtags', 'Audio Master Files'],
    results: ['3x average viewer retention rate', 'Optimized for mobile social feeds'],
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'proj-4',
    name: 'Multilingual Explainer Voice Over',
    client: 'Demo Showcase Project',
    category: 'Voice',
    tags: ['English & Regional', 'Studio Audio', 'Mastering', 'Commercial'],
    challenge: 'Recording crystal-clear, professional voice-overs in English and Hindi for a product launch campaign.',
    solution: 'Produced studio-quality voice tracks with noise suppression, EQ balancing, and precise timing matching the visual storyboard.',
    deliverables: ['WAV Studio Masters', 'English & Hindi Track Sync', 'Commercial Usage Rights'],
    results: ['Broadcast quality sound', 'Perfect pace and tone alignment'],
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'proj-5',
    name: 'Brand Storytelling & Website Copy',
    client: 'Demo Showcase Project',
    category: 'Content',
    tags: ['Copywriting', 'SEO', 'Brand Script', 'Landing Page Copy'],
    challenge: 'Drafting high-converting website messaging for a tech startup needing concise and punchy communication.',
    solution: 'Authored complete landing page copy, value propositions, feature breakdowns, and CTA button scripts.',
    deliverables: ['Website Copy Deck', 'Taglines & Slogans', 'Microcopy & CTA Scripts'],
    results: ['Clear value positioning', 'Improved landing page clarity'],
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'proj-6',
    name: 'Corporate Documentary Video Edit',
    client: 'Demo Showcase Project',
    category: 'Video',
    tags: ['Premiere Pro', 'DaVinci Resolve', 'Sound Editing', '4K'],
    challenge: 'Editing 2 hours of multi-camera corporate event footage into a polished 3-minute recap film.',
    solution: 'Synthesized speeches, b-roll shots, ambient soundscapes, and graphic lower-thirds into a cohesive visual story.',
    deliverables: ['4K Final Render', 'Social Teaser Trailer', 'Project Archival Files'],
    results: ['Engaging narrative flow', 'Seamless multi-cam cuts'],
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
  },
];

const categories = ['All', 'Web', 'UI/UX', 'Video', 'Reels', 'Voice', 'Content'];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const filteredProjects = activeCategory === 'All'
    ? portfolioProjects
    : portfolioProjects.filter((p) => p.category === activeCategory);

  const handleOpenProject = (project: PortfolioProject) => {
    setSelectedProject(project);
    trackEvent('portfolio_modal_open', 'Portfolio', project.name);
  };

  return (
    <section id="portfolio" className="py-24 bg-studio-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-studio-orange/10 border border-studio-orange/30 text-studio-orange text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Showcase & Work</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight"
          >
            Crafted With <span className="text-orange-gradient">Precision & Passion</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm sm:text-base text-studio-muted"
          >
            Explore selected demo projects demonstrating our multi-disciplinary execution. Click any project to open detailed case study modal.
          </motion.p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                trackEvent('portfolio_filter_click', 'Portfolio', cat);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-studio-orange text-white shadow-glow'
                  : 'bg-studio-charcoal border border-studio-border text-studio-muted hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Cards Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleOpenProject(project)}
                className="bg-glass-card rounded-3xl overflow-hidden border border-studio-border hover:border-studio-orange/60 transition-all duration-300 group cursor-pointer flex flex-col"
              >
                {/* Image Box */}
                <div className="relative h-56 w-full overflow-hidden bg-studio-charcoal">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-studio-black via-transparent to-transparent opacity-80" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-studio-black/80 backdrop-blur-md text-[11px] font-mono text-studio-orange border border-studio-orange/30">
                    {project.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white group-hover:text-studio-orange transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-xs text-studio-muted mt-1 font-mono">{project.client}</p>
                    <p className="mt-3 text-xs text-studio-white/70 line-clamp-2 leading-relaxed">
                      {project.challenge}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-studio-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-studio-orange group-hover:underline flex items-center gap-1">
                      View Case Study <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Interactive Case Study Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-studio-charcoal border border-studio-orange/40 rounded-3xl max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl overflow-hidden my-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 p-2.5 rounded-full bg-studio-black text-studio-muted hover:text-white hover:bg-studio-orange transition-all"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-2 text-xs font-mono text-studio-orange uppercase tracking-wider mb-2">
                <span>Case Study</span> • <span>{selectedProject.category}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white">
                {selectedProject.name}
              </h2>
              <p className="text-xs font-mono text-studio-muted mt-1">{selectedProject.client}</p>

              {/* Main Banner Image */}
              <div className="mt-6 rounded-2xl overflow-hidden h-64 sm:h-80 w-full relative">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Challenge & Solution */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-studio-black/80 border border-white/5">
                  <h4 className="text-sm font-bold text-studio-orange uppercase tracking-wide mb-2">
                    The Challenge
                  </h4>
                  <p className="text-xs sm:text-sm text-studio-muted leading-relaxed">
                    {selectedProject.challenge}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-studio-black/80 border border-white/5">
                  <h4 className="text-sm font-bold text-studio-orange uppercase tracking-wide mb-2">
                    Our Solution
                  </h4>
                  <p className="text-xs sm:text-sm text-studio-muted leading-relaxed">
                    {selectedProject.solution}
                  </p>
                </div>
              </div>

              {/* Deliverables & Results */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-white mb-3">Key Deliverables</h4>
                  <div className="space-y-2">
                    {selectedProject.deliverables.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-studio-white/80">
                        <Check className="w-4 h-4 text-studio-orange shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white mb-3">Project Results</h4>
                  <div className="space-y-2">
                    {selectedProject.results.map((res) => (
                      <div key={res} className="flex items-center gap-2 text-xs text-emerald-400">
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gallery Images if present */}
              {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-sm font-bold text-white mb-4">Project Gallery</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProject.gallery.map((imgUrl, i) => (
                      <div key={i} className="rounded-xl overflow-hidden h-36">
                        <img src={imgUrl} alt="Gallery item" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Action */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((t) => (
                    <span key={t} className="text-xs px-3 py-1 rounded-full bg-studio-black border border-white/10 text-studio-muted">
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    const bookSection = document.getElementById('book');
                    if (bookSection) bookSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-studio-orange text-xs font-bold text-white shadow-glow hover:bg-orange-600 transition-colors"
                >
                  Start Similar Project
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
