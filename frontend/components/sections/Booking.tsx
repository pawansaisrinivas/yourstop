'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Upload, CheckCircle2, MessageSquare, Phone, Mail, Instagram, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { submitBookingForm } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';

const bookingSchema = z.object({
  customer_name: z.string().min(2, 'Full name is required'),
  business_name: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(6, 'Valid contact number is required'),
  whatsapp: z.string().optional(),
  instagram_handle: z.string().optional(),
  website: z.string().optional(),
  selected_service: z.string().min(1, 'Please select a service'),
  budget: z.string().min(1, 'Please select your budget range'),
  deadline: z.string().min(1, 'Please select your preferred deadline'),
  project_description: z.string().min(10, 'Description must be at least 10 characters'),
  preferred_communication: z.enum(['WhatsApp', 'Phone', 'Email', 'Instagram']),
  terms_accepted: z.boolean().refine((val) => val === true, 'You must accept the terms to proceed'),
});

type BookingFormFields = z.infer<typeof bookingSchema>;

const servicesOptions = [
  'Website Development',
  'UI/UX Designing',
  'Video Editing',
  'Reel Making',
  'Voice Over Services',
  'Content Writing',
];

const budgetRanges = [
  'Under $1,000 / ₹25,000',
  '$1,000 - $3,000 / ₹25k - ₹75k',
  '$3,000 - $5,000 / ₹75k - ₹1.5L',
  '$5,000+ / ₹1.5L+',
];

const deadlineOptions = [
  'Within 1 Week (Urgent)',
  '2 Weeks',
  '3-4 Weeks',
  '1 Month+',
];

interface BookingProps {
  selectedServiceFromProp?: string;
}

export default function Booking({ selectedServiceFromProp }: BookingProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ booking_id: string; customer_name: string; service: string; whatsapp_url: string } | null>(null);
  const [serviceHighlighted, setServiceHighlighted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormFields>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      selected_service: selectedServiceFromProp || 'Website Development',
      budget: '$1,000 - $3,000 / ₹25k - ₹75k',
      deadline: '2 Weeks',
      preferred_communication: 'WhatsApp',
      terms_accepted: true,
    },
  });

  const watchSelectedService = watch('selected_service');

  // Preselect & visually highlight service when triggered from Services cards
  useEffect(() => {
    const handleServiceSelect = (e: CustomEvent<{ service: string }>) => {
      if (e.detail && e.detail.service) {
        setValue('selected_service', e.detail.service);
        setServiceHighlighted(true);
        setTimeout(() => setServiceHighlighted(false), 2000);
      }
    };

    window.addEventListener('selectStudioService' as any, handleServiceSelect as any);
    return () => window.removeEventListener('selectStudioService' as any, handleServiceSelect as any);
  }, [setValue]);

  useEffect(() => {
    if (selectedServiceFromProp) {
      setValue('selected_service', selectedServiceFromProp);
      setServiceHighlighted(true);
      setTimeout(() => setServiceHighlighted(false), 2000);
    }
  }, [selectedServiceFromProp, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedExts = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'doc', 'docx'];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      
      if (file.size > 10 * 1024 * 1024) {
        setFileError('File size exceeds 10MB limit.');
        return;
      }
      if (!allowedExts.includes(ext)) {
        setFileError('Allowed formats: PDF, PNG, JPG, JPEG, WEBP, DOC, DOCX.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const onSubmit = async (data: BookingFormFields) => {
    setIsSubmitting(true);
    setSubmitError(null);
    trackEvent('booking_form_submit_attempt', 'Booking', data.selected_service);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) => {
        formData.append(key, String(val));
      });

      if (selectedFile) {
        formData.append('reference_file', selectedFile);
      }

      // Add dummy Turnstile token for dev / preview server
      formData.append('turnstileToken', 'XXXX.DUMMY.TOKEN.XXXX');

      const response = await submitBookingForm(formData);

      if (response.success && response.data) {
        setSuccessData({
          booking_id: response.data.booking_id,
          customer_name: response.data.customer_name || data.customer_name,
          service: data.selected_service,
          whatsapp_url: response.data.whatsapp_url || `https://wa.me/919876543210?text=Hi%20YourStop%20Studio!%20Booking%20ID%20${response.data.booking_id}`,
        });

        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF7A00', '#FFFFFF', '#FF9E43'],
        });

        trackEvent('booking_form_success', 'Booking', response.data.booking_id);
      } else {
        setSubmitError(response.error || 'Failed to process booking. Please try again.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="book" className="py-24 bg-studio-black relative overflow-hidden">
      
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-studio-orange/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-studio-orange/10 border border-studio-orange/30 text-studio-orange text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Book a Service</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight"
          >
            Let's Build Something <span className="text-orange-gradient">Exceptional</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-sm sm:text-base text-studio-muted"
          >
            Fill in your project requirements below to receive a custom proposal within 24 hours.
          </motion.p>
        </div>

        {/* Main Form Container or In-Page Success Banner */}
        <div className="bg-glass-card rounded-3xl p-6 sm:p-10 border border-studio-border shadow-2xl relative">
          
          <AnimatePresence mode="wait">
            {!successData ? (
              <motion.form
                key="booking-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* SECTION 1: Personal Information */}
                <div>
                  <h3 className="text-sm font-mono font-bold text-studio-orange uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-studio-orange" />
                    1. Personal & Contact Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-studio-white mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Alex Morgan"
                        {...register('customer_name')}
                        className="w-full px-4 py-3 rounded-xl bg-studio-black border border-white/10 text-sm text-white placeholder-studio-muted focus:border-studio-orange focus:outline-none transition-colors"
                      />
                      {errors.customer_name && (
                        <p className="mt-1 text-xs text-red-400">{errors.customer_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-studio-white mb-1.5">
                        Business / Organization Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Innovations"
                        {...register('business_name')}
                        className="w-full px-4 py-3 rounded-xl bg-studio-black border border-white/10 text-sm text-white placeholder-studio-muted focus:border-studio-orange focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-studio-white mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="alex@example.com"
                        {...register('email')}
                        className="w-full px-4 py-3 rounded-xl bg-studio-black border border-white/10 text-sm text-white placeholder-studio-muted focus:border-studio-orange focus:outline-none transition-colors"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-studio-white mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210 / +1..."
                        {...register('phone')}
                        className="w-full px-4 py-3 rounded-xl bg-studio-black border border-white/10 text-sm text-white placeholder-studio-muted focus:border-studio-orange focus:outline-none transition-colors"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-studio-white mb-1.5">
                        WhatsApp Number (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="Same as phone or custom..."
                        {...register('whatsapp')}
                        className="w-full px-4 py-3 rounded-xl bg-studio-black border border-white/10 text-sm text-white placeholder-studio-muted focus:border-studio-orange focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-studio-white mb-1.5">
                        Instagram Handle (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="@yourhandle"
                        {...register('instagram_handle')}
                        className="w-full px-4 py-3 rounded-xl bg-studio-black border border-white/10 text-sm text-white placeholder-studio-muted focus:border-studio-orange focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Project Specifications */}
                <div>
                  <h3 className="text-sm font-mono font-bold text-studio-orange uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-studio-orange" />
                    2. Project Requirements
                  </h3>

                  {/* Service Selection Dropdown */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-studio-white mb-1.5">
                      Service Selection *
                    </label>
                    <div
                      className={`transition-all duration-500 rounded-xl ${
                        serviceHighlighted ? 'ring-2 ring-studio-orange shadow-glow scale-[1.01]' : ''
                      }`}
                    >
                      <select
                        {...register('selected_service')}
                        className="w-full px-4 py-3 rounded-xl bg-studio-black border border-white/10 text-sm text-white focus:border-studio-orange focus:outline-none transition-colors"
                      >
                        {servicesOptions.map((srv) => (
                          <option key={srv} value={srv} className="bg-studio-charcoal text-white">
                            {srv}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.selected_service && (
                      <p className="mt-1 text-xs text-red-400">{errors.selected_service.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-studio-white mb-1.5">
                        Estimated Budget *
                      </label>
                      <select
                        {...register('budget')}
                        className="w-full px-4 py-3 rounded-xl bg-studio-black border border-white/10 text-sm text-white focus:border-studio-orange focus:outline-none transition-colors"
                      >
                        {budgetRanges.map((b) => (
                          <option key={b} value={b} className="bg-studio-charcoal text-white">
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-studio-white mb-1.5">
                        Preferred Deadline *
                      </label>
                      <select
                        {...register('deadline')}
                        className="w-full px-4 py-3 rounded-xl bg-studio-black border border-white/10 text-sm text-white focus:border-studio-orange focus:outline-none transition-colors"
                      >
                        {deadlineOptions.map((d) => (
                          <option key={d} value={d} className="bg-studio-charcoal text-white">
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-studio-white mb-1.5">
                      Project Description & Objectives *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your brand, key features, target audience, and specific goals..."
                      {...register('project_description')}
                      className="w-full px-4 py-3 rounded-xl bg-studio-black border border-white/10 text-sm text-white placeholder-studio-muted focus:border-studio-orange focus:outline-none transition-colors"
                    />
                    {errors.project_description && (
                      <p className="mt-1 text-xs text-red-400">{errors.project_description.message}</p>
                    )}
                  </div>
                </div>

                {/* SECTION 3: Communication & File Upload */}
                <div>
                  <h3 className="text-sm font-mono font-bold text-studio-orange uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-studio-orange" />
                    3. Communication Preference & Attachments
                  </h3>

                  {/* Preferred Communication */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-studio-white mb-2">
                      Preferred Communication Channel *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { name: 'WhatsApp', icon: MessageSquare },
                        { name: 'Phone', icon: Phone },
                        { name: 'Email', icon: Mail },
                        { name: 'Instagram', icon: Instagram },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = watch('preferred_communication') === item.name;
                        return (
                          <button
                            type="button"
                            key={item.name}
                            onClick={() => setValue('preferred_communication', item.name as any)}
                            className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium transition-all ${
                              isSelected
                                ? 'bg-studio-orange text-white border-studio-orange shadow-glow'
                                : 'bg-studio-black border-white/10 text-studio-muted hover:text-white hover:border-white/20'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* File Upload Box */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-studio-white mb-1.5">
                      Reference File Upload (Optional — Max 10MB)
                    </label>
                    <div className="relative border-2 border-dashed border-white/10 hover:border-studio-orange/50 rounded-2xl p-6 text-center bg-studio-black/50 transition-colors">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="w-8 h-8 text-studio-orange mx-auto mb-2" />
                      <p className="text-xs text-studio-white font-medium">
                        {selectedFile ? (
                          <span className="text-studio-orange font-bold">{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                        ) : (
                          'Click or drag PDF, PNG, JPG, WEBP, DOC, DOCX files here'
                        )}
                      </p>
                      <p className="text-[10px] text-studio-muted mt-1">Maximum file size: 10MB</p>
                    </div>
                    {fileError && <p className="mt-1 text-xs text-red-400">{fileError}</p>}
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="flex items-start gap-3 mt-4">
                    <input
                      type="checkbox"
                      id="terms"
                      {...register('terms_accepted')}
                      className="mt-1 rounded bg-studio-black border-white/20 text-studio-orange focus:ring-studio-orange"
                    />
                    <label htmlFor="terms" className="text-xs text-studio-muted leading-relaxed">
                      I agree to allow YourStop Studio to contact me regarding this booking request and review attached project materials.
                    </label>
                  </div>
                  {errors.terms_accepted && (
                    <p className="mt-1 text-xs text-red-400">{errors.terms_accepted.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-studio-orange font-bold text-sm text-white shadow-glow hover:bg-orange-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing Booking...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Submit Booking Request</span>
                      </>
                    )}
                  </button>
                </div>

              </motion.form>
            ) : (
              /* IN-PAGE SUCCESS CONFIRMATION STATE */
              <motion.div
                key="booking-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 px-4"
              >
                <div className="w-20 h-20 rounded-full bg-studio-orange/20 border-2 border-studio-orange text-studio-orange mx-auto flex items-center justify-center shadow-glow mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                  Booking Successfully Submitted!
                </h2>

                <div className="mt-6 inline-block bg-studio-black px-6 py-3 rounded-2xl border border-studio-orange/30">
                  <span className="text-xs text-studio-muted uppercase tracking-wider block">Booking Reference ID</span>
                  <span className="font-mono text-2xl font-bold text-studio-orange">{successData.booking_id}</span>
                </div>

                <p className="mt-6 text-sm sm:text-base text-studio-muted max-w-lg mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{successData.customer_name}</strong>! Your request for <strong className="text-studio-orange">{successData.service}</strong> has been logged in our system. Our creative team will contact you shortly.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href={successData.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-lg hover:bg-emerald-500 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      setSuccessData(null);
                      setSelectedFile(null);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-studio-black border border-white/10 text-white font-semibold text-sm hover:border-studio-orange transition-colors"
                  >
                    <span>Submit Another Booking</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
