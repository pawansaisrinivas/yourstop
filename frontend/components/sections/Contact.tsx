'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import { submitContactForm } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    trackEvent('contact_form_submit', 'Contact', formData.subject);

    try {
      const res = await submitContactForm({
        ...formData,
        turnstileToken: 'XXXX.DUMMY.TOKEN.XXXX',
      });

      if (res.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setErrorMsg(res.error || 'Failed to send message.');
      }
    } catch (err: any) {
      setErrorMsg('Error submitting contact message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-studio-charcoal/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-studio-orange/10 border border-studio-orange/30 text-studio-orange text-xs font-semibold uppercase tracking-wider mb-4">
                <span>Get In Touch</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
                Let's Start a <span className="text-studio-orange">Conversation</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-studio-muted leading-relaxed">
                Have a question or custom project query? Reach out directly via email, Instagram, or fill out the inquiry form.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              <a
                href="mailto:yourstopstudio@gmail.com"
                className="flex items-center gap-4 p-5 rounded-2xl bg-glass-card border border-white/10 hover:border-studio-orange/50 transition-colors group"
              >
                <div className="p-3 rounded-xl bg-studio-black text-studio-orange group-hover:bg-studio-orange group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-studio-muted font-mono uppercase">Direct Email</div>
                  <div className="text-sm font-bold text-white group-hover:text-studio-orange transition-colors">
                    yourstopstudio@gmail.com
                  </div>
                </div>
              </a>

              <a
                href="https://instagram.com/yourstop.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-glass-card border border-white/10 hover:border-studio-orange/50 transition-colors group"
              >
                <div className="p-3 rounded-xl bg-studio-black text-studio-orange group-hover:bg-studio-orange group-hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-studio-muted font-mono uppercase">Instagram</div>
                  <div className="text-sm font-bold text-white group-hover:text-studio-orange transition-colors">
                    @yourstop.studio
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-5 rounded-2xl bg-glass-card border border-white/10">
                <div className="p-3 rounded-xl bg-studio-black text-studio-orange">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-studio-muted font-mono uppercase">Studio Hours</div>
                  <div className="text-sm font-bold text-white">Mon – Sat (9:00 AM – 9:00 PM IST)</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-glass-card rounded-3xl p-6 sm:p-8 border border-studio-border shadow-2xl">
              <h3 className="text-xl font-display font-bold text-white mb-6">
                Send Us a Direct Message
              </h3>

              {success ? (
                <div className="p-8 text-center bg-studio-black/80 rounded-2xl border border-studio-orange/40">
                  <CheckCircle2 className="w-12 h-12 text-studio-orange mx-auto mb-3" />
                  <h4 className="text-xl font-bold text-white">Message Sent Successfully!</h4>
                  <p className="text-xs text-studio-muted mt-2">
                    Thank you for reaching out. We will get back to you within 12 business hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 px-6 py-2 rounded-xl bg-studio-orange text-xs font-bold text-white"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-studio-white mb-1">Your Name *</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-studio-black border border-white/10 text-sm text-white placeholder-studio-muted focus:border-studio-orange focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-studio-white mb-1">Email Address *</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-studio-black border border-white/10 text-sm text-white placeholder-studio-muted focus:border-studio-orange focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-studio-white mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-studio-black border border-white/10 text-sm text-white placeholder-studio-muted focus:border-studio-orange focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-studio-white mb-1">Subject *</label>
                      <input
                        type="text"
                        placeholder="Project Inquiry"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-studio-black border border-white/10 text-sm text-white placeholder-studio-muted focus:border-studio-orange focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-studio-white mb-1">Message *</label>
                    <textarea
                      rows={4}
                      placeholder="How can YourStop Studio assist your team?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-studio-black border border-white/10 text-sm text-white placeholder-studio-muted focus:border-studio-orange focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-studio-orange text-xs font-bold text-white shadow-glow hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
