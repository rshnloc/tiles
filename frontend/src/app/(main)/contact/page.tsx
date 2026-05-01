'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Phone, Mail, MapPin, Clock, MessageSquare, Send,
  Loader2, CheckCircle2, ChevronDown, Headphones,
  Building2, Users, Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

// ===================== DATA =====================
const OFFICES = [
  {
    city: 'Mumbai HQ',
    address: '123, Insurance Tower, Bandra Kurla Complex, Mumbai – 400051',
    phone: '+91 22 1234 5678',
    email: 'mumbai@sunischistinsurance.com',
    hours: 'Mon–Sat: 9:00 AM – 7:00 PM',
    gradient: 'from-blue-500 to-cyan-500',
    icon: Building2,
  },
  {
    city: 'Bangalore',
    address: '45, Brigade Gateway, Malleshwaram, Bangalore – 560003',
    phone: '+91 80 8765 4321',
    email: 'bangalore@sunischistinsurance.com',
    hours: 'Mon–Sat: 9:00 AM – 7:00 PM',
    gradient: 'from-violet-500 to-purple-600',
    icon: Building2,
  },
  {
    city: 'New Delhi',
    address: '7th Floor, Connaught Place, New Delhi – 110001',
    phone: '+91 11 9876 5432',
    email: 'delhi@sunischistinsurance.com',
    hours: 'Mon–Sat: 9:00 AM – 7:00 PM',
    gradient: 'from-orange-500 to-red-500',
    icon: Building2,
  },
];

const CHANNELS = [
  {
    icon: Headphones,
    title: 'Call Support',
    desc: '24×7 toll-free assistance',
    action: '1800-123-4567',
    href: 'tel:18001234567',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    desc: 'Average response < 2 min',
    action: 'Start Chat',
    href: '#',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Mail,
    title: 'Email Us',
    desc: 'Reply within 4 business hours',
    action: 'support@sunischistinsurance.com',
    href: 'mailto:support@sunischistinsurance.com',
    gradient: 'from-primary-500 to-secondary-500',
  },
];

const FAQS = [
  {
    q: 'How do I file a claim?',
    a: 'You can file a claim online via your dashboard under "My Policies → File Claim", through our app, or by calling our 24×7 helpline 1800-123-4567. Our claims team will guide you through every step.',
  },
  {
    q: 'How long does claim settlement take?',
    a: 'For cashless claims at network hospitals/garages, approval is typically within 2–4 hours. Reimbursement claims are settled within 7–10 business days after document submission.',
  },
  {
    q: 'Can I port my existing policy?',
    a: 'Yes! You can port your policy from any insurer to us at renewal time without losing No Claim Bonus. Use the Renew section or contact our advisors for a smooth port.',
  },
  {
    q: 'Is my data safe with SunischistInsurance?',
    a: 'Absolutely. We use 256-bit SSL encryption, are ISO 27001 certified, and are fully compliant with IRDAI data protection guidelines. Your data is never sold to third parties.',
  },
  {
    q: 'How do I get an advisor?',
    a: 'Visit our Advisors page to find verified insurance advisors near you. You can filter by city, language, and specialisation, and book a free consultation directly.',
  },
];

const SUBJECTS = [
  'General Inquiry', 'Claim Support', 'Policy Renewal', 'New Purchase',
  'Advisor Request', 'Billing / Payment', 'Technical Issue', 'Other',
];

// ===================== FAQ ITEM =====================
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.07 }}
      className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
      >
        <span className="font-semibold text-gray-900 dark:text-white pr-4">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-gray-50 dark:bg-gray-800/40"
          >
            <p className="px-5 pb-5 pt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ===================== MAIN PAGE =====================
export default function ContactPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Please enter your name');
    if (!form.email.includes('@')) return toast.error('Enter a valid email address');
    if (!form.message.trim()) return toast.error('Please enter your message');
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
    toast.success('Message sent! We\'ll get back to you within 4 hours.');
  };

  const inputClass =
    'w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* ───── Hero ───── */}
      <section
        ref={heroRef}
        className="relative pt-28 pb-20 bg-gradient-to-br from-gray-950 via-primary-950 to-gray-950 overflow-hidden"
      >
        {/* Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold uppercase tracking-widest mb-5"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Contact Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="font-display font-black text-5xl sm:text-6xl text-white mb-5"
          >
            We&apos;re here to{' '}
            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              help you
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-gray-400 text-lg max-w-xl mx-auto"
          >
            Questions, claims, renewals — reach our team via any channel, any time.
          </motion.p>

          {/* Channel cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="grid sm:grid-cols-3 gap-4 mt-14 max-w-3xl mx-auto"
          >
            {CHANNELS.map((ch) => {
              const Icon = ch.icon;
              return (
                <a
                  key={ch.title}
                  href={ch.href}
                  className="group bg-white/8 hover:bg-white/14 border border-white/15 hover:border-white/30 rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${ch.gradient} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-semibold text-white text-sm">{ch.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5 mb-2">{ch.desc}</p>
                  <p className="text-primary-400 text-xs font-medium truncate">{ch.action}</p>
                </a>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ───── Contact Form + Offices ───── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display font-black text-3xl sm:text-4xl text-gray-900 dark:text-white mb-2">
                Send us a message
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                Fill in the form and our team will respond within 4 business hours.
              </p>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                      We&apos;ve received your message and will get back to you within 4 hours.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                      className="mt-6"
                    >
                      Send Another
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 space-y-5 shadow-sm"
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                        <input type="text" placeholder="Raushan Kumar" value={form.name} onChange={set('name')} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address *</label>
                        <input type="email" placeholder="raushan@email.com" value={form.email} onChange={set('email')} className={inputClass} />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all bg-white dark:bg-gray-900">
                          <div className="px-3 py-3 border-r border-gray-200 dark:border-gray-700 text-gray-500 text-sm">+91</div>
                          <input
                            type="tel"
                            placeholder="9876543210"
                            value={form.phone}
                            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/, '').slice(0, 10) }))}
                            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 px-3 py-3 text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                        <select value={form.subject} onChange={set('subject')} className={inputClass}>
                          <option value="">Select a subject</option>
                          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                      <textarea
                        rows={5}
                        placeholder="Describe your query in detail..."
                        value={form.message}
                        onChange={set('message')}
                        className={inputClass + ' resize-none'}
                      />
                    </div>

                    <Button type="submit" disabled={submitting} className="w-full h-12 text-base font-semibold">
                      {submitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending…</>
                      ) : (
                        <><Send className="w-4 h-4 mr-2" /> Send Message</>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Offices */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display font-black text-3xl sm:text-4xl text-gray-900 dark:text-white mb-2">
                Our offices
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                Visit us at any of our branches — no appointment needed.
              </p>

              <div className="space-y-4">
                {OFFICES.map((office, i) => {
                  const Icon = office.icon;
                  return (
                    <motion.div
                      key={office.city}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${office.gradient} flex items-center justify-center shrink-0 shadow-md`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 dark:text-white mb-1">{office.city}</h3>
                          <div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary-500" />
                              <span>{office.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 shrink-0 text-primary-500" />
                              <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="hover:text-primary-500 transition-colors">{office.phone}</a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 shrink-0 text-primary-500" />
                              <a href={`mailto:${office.email}`} className="hover:text-primary-500 transition-colors truncate">{office.email}</a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 shrink-0 text-primary-500" />
                              <span>{office.hours}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Map placeholder */}
              <div className="mt-6 h-48 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-3">
                <MapPin className="w-8 h-8 text-primary-400" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Interactive map coming soon</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-widest mb-4">
              <Shield className="w-3.5 h-3.5" /> FAQs
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-gray-900 dark:text-white mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Can&apos;t find what you&apos;re looking for? <a href="mailto:support@sunischistinsurance.com" className="text-primary-600 dark:text-primary-400 hover:underline">Email us</a>.
            </p>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />)}
          </div>
        </div>
      </section>

      {/* ───── Bottom CTA ───── */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-500">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-4 text-center"
        >
          <Users className="w-10 h-10 text-white/80 mx-auto mb-4" />
          <h2 className="font-display font-black text-3xl text-white mb-3">
            Need a personal advisor?
          </h2>
          <p className="text-white/75 text-sm mb-7">
            Our IRDAI-certified advisors are available pan-India for free consultations.
          </p>
          <a
            href="/advisors"
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
          >
            Find an Advisor
          </a>
        </motion.div>
      </section>
    </div>
  );
}
