'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Process', href: '#process' },
  { name: 'Book', href: '#book' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      // Toggle Glassmorphism on scroll
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Scroll Spy logic
      const sections = navLinks.map(link => link.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      window.history.pushState(null, '', href);
      trackEvent('navbar_click', 'Navigation', href);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-studio-charcoal/80 backdrop-blur-xl border-b border-studio-border shadow-glass py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <Link
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-studio-charcoal border border-studio-border p-1 group-hover:border-studio-orange transition-all duration-300">
              <Image
                src="/logo.png"
                alt="YourStop Studio Logo"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg text-white tracking-tight group-hover:text-studio-orange transition-colors">
                YourStop <span className="text-studio-orange">Studio</span>
              </span>
              <span className="text-[10px] text-studio-muted font-mono tracking-wider hidden sm:block">
                We Write • We Design • We Build
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-studio-charcoal/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-studio-border">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-studio-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-studio-orange/20 border border-studio-orange/40 rounded-full"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              );
            })}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="#book"
              onClick={(e) => handleNavClick(e, '#book')}
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold rounded-full bg-studio-orange text-white shadow-glow hover:bg-orange-600 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Book Now</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-studio-charcoal border border-studio-border text-studio-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-studio-orange" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Animated Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-studio-charcoal/95 backdrop-blur-2xl border-b border-studio-border overflow-hidden"
          >
            <div className="px-6 pt-4 pb-8 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="flex items-center justify-between py-2.5 text-sm font-medium text-studio-white border-b border-white/5 hover:text-studio-orange transition-colors"
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-studio-muted" />
                </a>
              ))}
              <div className="pt-4">
                <a
                  href="#book"
                  onClick={(e) => handleNavClick(e, '#book')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-studio-orange font-bold text-sm text-white shadow-glow"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Book a Service</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
