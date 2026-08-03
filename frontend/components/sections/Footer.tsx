'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, Instagram, MessageSquare, ArrowUpRight } from 'lucide-react';

export default function Footer() {
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
    <footer id="footer" className="bg-studio-charcoal border-t border-studio-border pt-16 pb-12 text-studio-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/5">
          
          {/* Studio Brand */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-studio-black border border-studio-orange/40 p-1">
                <Image src="/logo.png" alt="YourStop Studio Logo" fill className="object-contain" />
              </div>
              <span className="font-display font-extrabold text-xl text-white">
                YourStop <span className="text-studio-orange">Studio</span>
              </span>
            </div>
            
            <p className="text-xs font-mono text-studio-orange tracking-widest uppercase">
              We Write • We Design • We Build.
            </p>
            
            <p className="text-xs text-studio-muted leading-relaxed max-w-sm">
              Transforming ideas into powerful digital experiences. A student-founded creative & technology studio bringing content, UI/UX, voice, video, and web engineering together.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { name: 'Home', id: 'home' },
                { name: 'About Us', id: 'about' },
                { name: 'Services', id: 'services' },
                { name: 'Portfolio', id: 'portfolio' },
                { name: 'Creative Process', id: 'process' },
                { name: 'Book a Service', id: 'book' },
                { name: 'Contact', id: 'contact' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="text-studio-muted hover:text-studio-orange transition-colors flex items-center gap-1"
                  >
                    <span>{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & Social */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
              Connect With Us
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:yourstopstudio@gmail.com"
                className="flex items-center gap-3 p-3 rounded-xl bg-studio-black border border-white/10 hover:border-studio-orange text-xs text-studio-muted hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-studio-orange" />
                <span>yourstopstudio@gmail.com</span>
              </a>

              <a
                href="https://instagram.com/yourstop.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-studio-black border border-white/10 hover:border-studio-orange text-xs text-studio-muted hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4 text-studio-orange" />
                <span>@yourstop.studio</span>
              </a>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-studio-black border border-white/10 hover:border-studio-orange text-xs text-studio-muted hover:text-white transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-studio-orange" />
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Admin Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-studio-muted">
          <div>
            © {new Date().getFullYear()} YourStop Studio. All rights reserved. Built with Next.js 15 & Supabase.
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1 font-mono">
              <span>Admin Portal</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
