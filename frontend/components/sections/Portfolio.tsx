'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  X,
  Check,
  Sparkles,
  FolderGit2,
  ImageIcon,
} from 'lucide-react';

import { PortfolioProject } from '@/types';
import { trackEvent } from '@/lib/analytics';

/* =========================================================
   YOURSTOP STUDIO — PORTFOLIO PROJECTS

   Add ONE image per project inside:

   frontend/public/images/portfolio/
========================================================= */

const portfolioProjects: PortfolioProject[] = [
  {
    id: 'education-marketing',

    name: 'Educational Marketing Partner',

    client: 'Higher Education · North India',

    category: 'Marketing',

    tags: ['Strategy', 'Influencer Ops', 'Reels'],

    challenge:
      'A reputed northern-India university required stronger digital visibility and student-focused outreach through modern social media campaigns.',

    solution:
      'Developed a student-focused marketing strategy combining influencer collaborations, short-form content, campaign planning and digital communication to strengthen visibility among prospective students.',

    deliverables: [
      'Marketing Strategy',
      'Influencer Collaborations',
      'Student-Focused Campaigns',
      'Reels & Social Content',
    ],

    results: [
      'Strengthened digital visibility',
      'Student-focused communication strategy',
      'Integrated influencer and social media outreach',
    ],

    image: '/images/portfolio/education-marketing.jpg',
  },

  {
    id: 'ayyappa-transports',

    name: 'Ayyappa Transports',

    client: 'Business · Transport',

    category: 'Web',

    tags: ['UI/UX', 'Web Development', 'Branding'],

    challenge:
      'Ayyappa Transports needed a professional digital presence that could represent the business as established, trustworthy and accessible.',

    solution:
      'Designed and developed a responsive business website with a clean interface, structured service presentation and a professional visual identity focused on trust and usability.',

    deliverables: [
      'Responsive Website',
      'UI/UX Design',
      'Business Branding',
      'Website Architecture',
    ],

    results: [
      'Professional digital presence',
      'Responsive experience across devices',
      'Improved business presentation',
    ],

    image: '/images/portfolio/ayyappa-transports.jpg',
  },

  {
    id: 'kl-university',

    name: 'KL University Collaborations',

    client: '4-Year Partnership',

    category: 'Events',

    tags: ['Samyak', 'Surabhi', 'FemFlare', 'Creative Direction'],

    challenge:
      'Multiple flagship university events required consistent creative coverage, fast content production and event-specific digital storytelling.',

    solution:
      'Worked across major KL University events including Samyak, Surabhi, FemFlare and departmental festivals, handling photography, videography, branding, reels and creative direction.',

    deliverables: [
      'Event Photography',
      'Videography',
      'Branding',
      'Reels & Short-Form Content',
      'Creative Direction',
    ],

    results: [
      'Multi-event creative collaboration',
      'Real-time event content production',
      'Consistent visual storytelling across flagship events',
    ],

    image: '/images/portfolio/kl-university.jpg',
  },

  {
    id: 'yuva-2025',

    name: 'YUVA 2025',

    client: 'Government · Youth Radio',

    category: 'Events',

    tags: [
      'Strategy',
      'Photography',
      'Videography',
      'Social Campaigns',
    ],

    challenge:
      'YUVA 2025 at KL University required a youth-focused media strategy capable of capturing the event while driving live digital engagement.',

    solution:
      'Partnered with YUVA 2025 at KL University, in association with the Government of Andhra Pradesh, to strategise and run Youth Radio Andhra through live interviews, event storytelling and real-time content.',

    deliverables: [
      'Youth Radio Strategy',
      'Live Interviews',
      'Photography',
      'Videography',
      'Social Media Campaigns',
    ],

    results: [
      'Real-time event storytelling',
      'Youth-focused digital engagement',
      'Integrated photography, video and social coverage',
    ],

    image: '/images/portfolio/yuva-2025.png',
  },

  {
    id: 'ap-yuva-sankalp',

    name: 'AP Yuva Sankalp',

    client: 'Ministry of Youth Affairs & Sports',

    category: 'Marketing',

    tags: ['Media Strategy', 'Interviews', 'Campaigns'],

    challenge:
      'The initiative required a media approach that could communicate youth-focused activities effectively while increasing participation and awareness.',

    solution:
      'Led Youth Radio Andhra strategy and execution, producing media campaigns, interviews and digital storytelling focused on youth participation and public awareness.',

    deliverables: [
      'Media Strategy',
      'Youth Radio Execution',
      'Interviews',
      'Digital Campaigns',
      'Content Production',
    ],

    results: [
      'Expanded youth-oriented digital storytelling',
      'Integrated interview and campaign strategy',
      'Stronger communication around youth participation',
    ],

    image: '/images/portfolio/ap-yuva-sankalp.jpg',
  },

  {
    id: 'udbhav-2025',

    name: 'UDBHAV 2025',

    client: 'Ministry of Tribal Affairs · KL University',

    category: 'Events',

    tags: [
      'Real-time Reels',
      'Photography',
      'Event Highlights',
    ],

    challenge:
      'The National EMRS Cultural Festival required rapid creative production capable of documenting performances and publishing high-quality content while the festival was still underway.',

    solution:
      'Worked as a creative partner for the National EMRS Cultural Festival, delivering instant reels, promotional videos, photography and real-time digital content directly from the festival.',

    deliverables: [
      'Instant Reels',
      'Promotional Videos',
      'Event Photography',
      'Event Highlights',
      'Real-Time Digital Content',
    ],

    results: [
      'Real-time festival content delivery',
      'Rapid social media production',
      'Comprehensive visual coverage of the cultural festival',
    ],

    image: '/images/portfolio/udbhav-2025.jpg',
  },
];

/* =========================================================
   FILTER CATEGORIES
========================================================= */

const categories = ['All', 'Web', 'Marketing', 'Events'];

/* =========================================================
   PROJECT IMAGE WITH FALLBACK
========================================================= */

function ProjectImage({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-studio-orange/30 via-studio-charcoal to-studio-black ${className}`}
      >
        <div className="w-14 h-14 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-studio-orange" />
        </div>

        <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/40 font-mono">
          YourStop Studio
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
}

/* =========================================================
   PORTFOLIO COMPONENT
========================================================= */

export default function Portfolio() {
  const [activeCategory, setActiveCategory] =
    useState<string>('All');

  const [selectedProject, setSelectedProject] =
    useState<PortfolioProject | null>(null);

  const filteredProjects =
    activeCategory === 'All'
      ? portfolioProjects
      : portfolioProjects.filter(
          (project) => project.category === activeCategory
        );

  /* Disable background scrolling when modal opens */

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  /* Close modal with ESC */

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleOpenProject = (project: PortfolioProject) => {
    setSelectedProject(project);

    trackEvent(
      'portfolio_modal_open',
      'Portfolio',
      project.name
    );
  };

  const handleStartProject = () => {
    if (!selectedProject) return;

    trackEvent(
      'portfolio_start_similar_project',
      'Portfolio',
      selectedProject.name
    );

    setSelectedProject(null);

    setTimeout(() => {
      const bookSection =
        document.getElementById('book') ||
        document.getElementById('contact');

      if (bookSection) {
        bookSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 200);
  };

  return (
    <section
      id="portfolio"
      className="py-24 bg-studio-black relative overflow-hidden"
    >
      {/* Background Effects */}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-studio-orange/5 blur-[120px]" />

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-studio-orange/5 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center max-w-3xl mx-auto mb-12">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-studio-orange/10 border border-studio-orange/30 text-studio-orange text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <FolderGit2 className="w-3.5 h-3.5" />

            <span>Our Work</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight"
          >
            Work That Speaks{' '}
            <span className="text-orange-gradient">
              For Itself
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm sm:text-base text-studio-muted leading-relaxed"
          >
            From government initiatives and university
            flagship events to business websites and digital
            campaigns, explore selected projects and
            collaborations delivered by YourStop Studio.
          </motion.p>

        </div>

        {/* =================================================
            FILTER BUTTONS
        ================================================= */}

        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">

          {categories.map((category) => {
            const isActive =
              activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);

                  trackEvent(
                    'portfolio_filter_click',
                    'Portfolio',
                    category
                  );
                }}
                className={`
                  px-4 py-2
                  text-xs
                  font-semibold
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    isActive
                      ? 'bg-studio-orange text-white shadow-glow'
                      : 'bg-studio-charcoal border border-studio-border text-studio-muted hover:text-white hover:border-studio-orange/40'
                  }
                `}
              >
                {category}
              </button>
            );
          })}

        </div>

        {/* =================================================
            PROJECT GRID
        ================================================= */}

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >

          <AnimatePresence mode="popLayout">

            {filteredProjects.map((project) => (

              <motion.article
                layout
                key={project.id}
                initial={{
                  opacity: 0,
                  scale: 0.96,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.3,
                }}
                onClick={() =>
                  handleOpenProject(project)
                }
                className="
                  bg-glass-card
                  rounded-3xl
                  overflow-hidden
                  border
                  border-studio-border
                  hover:border-studio-orange/60
                  transition-all
                  duration-300
                  group
                  cursor-pointer
                  flex
                  flex-col
                  hover:-translate-y-1
                  hover:shadow-2xl
                  hover:shadow-orange-500/5
                "
              >

                {/* PROJECT IMAGE */}

                <div className="relative h-56 w-full overflow-hidden bg-studio-charcoal">

                  <ProjectImage
                    src={project.image}
                    alt={`${project.name} — YourStop Studio`}
                    className="
                      w-full
                      h-full
                      object-cover
                      group-hover:scale-105
                      transition-transform
                      duration-700
                    "
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-studio-black/90 via-black/10 to-transparent pointer-events-none" />

                  <span
                    className="
                      absolute
                      top-4
                      left-4
                      px-3
                      py-1
                      rounded-full
                      bg-studio-black/80
                      backdrop-blur-md
                      text-[10px]
                      sm:text-[11px]
                      font-mono
                      uppercase
                      tracking-wider
                      text-studio-orange
                      border
                      border-studio-orange/30
                    "
                  >
                    {project.category}
                  </span>

                </div>

                {/* PROJECT CONTENT */}

                <div className="p-6 flex-1 flex flex-col justify-between">

                  <div>

                    <p className="text-[10px] uppercase tracking-[0.16em] text-studio-orange/80 font-mono mb-2">
                      {project.client}
                    </p>

                    <h3 className="text-xl font-display font-bold text-white group-hover:text-studio-orange transition-colors duration-300">
                      {project.name}
                    </h3>

                    <p className="mt-3 text-xs sm:text-sm text-studio-muted line-clamp-3 leading-relaxed">
                      {project.challenge}
                    </p>

                  </div>

                  {/* TAGS */}

                  <div className="mt-5 flex flex-wrap gap-2">

                    {project.tags
                      .slice(0, 3)
                      .map((tag) => (

                        <span
                          key={tag}
                          className="text-[10px] px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-studio-muted font-mono"
                        >
                          {tag}
                        </span>

                      ))}

                  </div>

                  {/* VIEW PROJECT */}

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">

                    <span className="text-[10px] uppercase tracking-wider text-white/30">
                      Case Study
                    </span>

                    <span className="text-xs font-semibold text-studio-orange flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                      View Project

                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>

                  </div>

                </div>

              </motion.article>

            ))}

          </AnimatePresence>

        </motion.div>

      </div>

      {/* ===================================================
          PROJECT MODAL
      ==================================================== */}

      <AnimatePresence>

        {selectedProject && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              p-3
              sm:p-6
              bg-black/85
              backdrop-blur-xl
              overflow-y-auto
            "
            onClick={() =>
              setSelectedProject(null)
            }
          >

            <motion.div
              initial={{
                scale: 0.96,
                opacity: 0,
                y: 25,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: 0.96,
                opacity: 0,
                y: 25,
              }}
              transition={{
                duration: 0.25,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
              className="
                bg-studio-charcoal
                border
                border-studio-orange/30
                rounded-3xl
                max-w-4xl
                w-full
                relative
                shadow-2xl
                my-8
                max-h-[92vh]
                overflow-y-auto
              "
            >

              {/* MODAL HERO IMAGE */}

              <div className="relative h-60 sm:h-80 md:h-[380px] overflow-hidden rounded-t-3xl">

                <ProjectImage
                  src={selectedProject.image}
                  alt={`${selectedProject.name} — YourStop Studio`}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-studio-charcoal via-studio-charcoal/20 to-black/20" />

                {/* CLOSE */}

                <button
                  type="button"
                  onClick={() =>
                    setSelectedProject(null)
                  }
                  className="
                    absolute
                    top-5
                    right-5
                    p-2.5
                    rounded-full
                    bg-black/70
                    backdrop-blur-md
                    border
                    border-white/10
                    text-white/70
                    hover:text-white
                    hover:bg-studio-orange
                    transition-all
                  "
                  aria-label="Close project"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              {/* MODAL CONTENT */}

              <div className="p-6 sm:p-8">

                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-studio-orange uppercase tracking-wider mb-3">

                  <span>Case Study</span>

                  <span className="text-white/30">
                    •
                  </span>

                  <span>
                    {selectedProject.category}
                  </span>

                </div>

                <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white">
                  {selectedProject.name}
                </h2>

                <p className="text-xs sm:text-sm font-mono text-studio-muted mt-2">
                  {selectedProject.client}
                </p>

                {/* CHALLENGE + SOLUTION */}

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div className="p-5 sm:p-6 rounded-2xl bg-studio-black/70 border border-white/5">

                    <h4 className="text-xs sm:text-sm font-bold text-studio-orange uppercase tracking-wide mb-3">
                      The Challenge
                    </h4>

                    <p className="text-xs sm:text-sm text-studio-muted leading-relaxed">
                      {selectedProject.challenge}
                    </p>

                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl bg-studio-black/70 border border-white/5">

                    <h4 className="text-xs sm:text-sm font-bold text-studio-orange uppercase tracking-wide mb-3">
                      Our Solution
                    </h4>

                    <p className="text-xs sm:text-sm text-studio-muted leading-relaxed">
                      {selectedProject.solution}
                    </p>

                  </div>

                </div>

                {/* DELIVERABLES + RESULTS */}

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                  {/* DELIVERABLES */}

                  <div>

                    <h4 className="text-sm font-bold text-white mb-4">
                      Key Deliverables
                    </h4>

                    <div className="space-y-3">

                      {selectedProject.deliverables.map(
                        (item) => (

                          <div
                            key={item}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-studio-white/80"
                          >

                            <div className="mt-0.5 w-5 h-5 rounded-full bg-studio-orange/10 flex items-center justify-center shrink-0">

                              <Check className="w-3 h-3 text-studio-orange" />

                            </div>

                            <span>
                              {item}
                            </span>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                  {/* RESULTS */}

                  <div>

                    <h4 className="text-sm font-bold text-white mb-4">
                      Project Outcomes
                    </h4>

                    <div className="space-y-3">

                      {selectedProject.results.map(
                        (result) => (

                          <div
                            key={result}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-400"
                          >

                            <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />

                            <span>
                              {result}
                            </span>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                </div>

                {/* TAGS + CTA */}

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                  <div className="flex flex-wrap gap-2">

                    {selectedProject.tags.map(
                      (tag) => (

                        <span
                          key={tag}
                          className="text-[10px] sm:text-xs px-3 py-1.5 rounded-full bg-studio-black border border-white/10 text-studio-muted font-mono"
                        >
                          {tag}
                        </span>

                      )
                    )}

                  </div>

                  <button
                    type="button"
                    onClick={handleStartProject}
                    className="
                      px-6
                      py-3
                      rounded-xl
                      bg-studio-orange
                      text-xs
                      sm:text-sm
                      font-bold
                      text-white
                      shadow-glow
                      hover:bg-orange-600
                      hover:-translate-y-0.5
                      transition-all
                      whitespace-nowrap
                    "
                  >
                    Start Similar Project
                  </button>

                </div>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </section>
  );
}
