'use client';

import { useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import WhyUs from '@/components/sections/WhyUs';
import Portfolio from '@/components/sections/Portfolio';
import Process from '@/components/sections/Process';
import Stats from '@/components/sections/Stats';
import Testimonials from '@/components/sections/Testimonials';
import Booking from '@/components/sections/Booking';
import Contact from '@/components/sections/Contact';
import FinalCTA from '@/components/sections/FinalCTA';
import Footer from '@/components/sections/Footer';
import FloatingButtons from '@/components/ui/FloatingButtons';
import CookieConsent from '@/components/ui/CookieConsent';

export default function SinglePageWebsite() {
  const [preselectedService, setPreselectedService] = useState<string>('Website Development');

  const handleSelectService = (serviceKey: string) => {
    setPreselectedService(serviceKey);
  };

  return (
    <div className="min-h-screen bg-studio-black text-studio-white selection:bg-studio-orange selection:text-white relative">
      
      {/* 1. Transparent to Glassmorphism Sticky Navbar */}
      <Navbar />

      {/* 2. Hero Section (#home) */}
      <Hero />

      {/* 3. About Section (#about) */}
      <About />

      {/* 4. Services Section (#services) */}
      <Services onSelectService={handleSelectService} />

      {/* 5. Why Choose Us Section (#why-us) */}
      <WhyUs />

      {/* 6. Portfolio Showcase Section (#portfolio) */}
      <Portfolio />

      {/* 7. Creative Process Timeline (#process) */}
      <Process />

      {/* 8. Configurable Statistics (#stats) */}
      <Stats />

      {/* 9. Client Testimonials Carousel (#testimonials) */}
      <Testimonials />

      {/* 10. Service Booking Form (#book) */}
      <Booking selectedServiceFromProp={preselectedService} />

      {/* 11. Contact Section (#contact) */}
      <Contact />

      {/* 12. Final High-Impact Conversion CTA */}
      <FinalCTA />

      {/* 13. Minimal Studio Footer (#footer) */}
      <Footer />

      {/* 14. Floating Action Controls */}
      <FloatingButtons />

      {/* 15. Cookie Consent Banner */}
      <CookieConsent />

    </div>
  );
}
