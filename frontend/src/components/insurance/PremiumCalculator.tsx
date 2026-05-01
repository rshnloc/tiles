'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Car, Bike, Heart, Activity, ChevronRight, Calculator,
  Sparkles, Shield, TrendingDown, Users, Star, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

type Category = 'car' | 'bike' | 'health' | 'life';

interface FormData {
  make?: string;
  model?: string;
  year?: string;
  fuel?: string;
  registration?: string;
  memberType?: string;
  age?: string;
  coverAmount?: string;
  dob?: string;
  annualIncome?: string;
  tenure?: string;
  sumAssured?: string;
}

const categories = [
  {
    id: 'car' as Category,
    label: 'Car',
    icon: Car,
    gradient: 'from-blue-500 to-blue-700',
    light: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-600 dark:text-blue-400',
    glow: 'shadow-blue-500/25',
    estimate: [4800, 18000],
    unit: '/year',
    tagline: 'Comprehensive & Third Party plans',
    insured: '1.2M+ cars insured',
  },
  {
    id: 'bike' as Category,
    label: 'Bike',
    icon: Bike,
    gradient: 'from-orange-500 to-orange-700',
    light: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-600 dark:text-orange-400',
    glow: 'shadow-orange-500/25',
    estimate: [1200, 4800],
    unit: '/year',
    tagline: 'OD + TP + Zero Depreciation',
    insured: '800K+ bikes covered',
  },
  {
    id: 'health' as Category,
    label: 'Health',
    icon: Heart,
    gradient: 'from-rose-500 to-pink-700',
    light: 'bg-rose-50 dark:bg-rose-900/20',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-600 dark:text-rose-400',
    glow: 'shadow-rose-500/25',
    estimate: [6000, 28000],
    unit: '/year',
    tagline: 'Cashless at 10,000+ hospitals',
    insured: '600K+ families protected',
  },
  {
    id: 'life' as Category,
    label: 'Life',
    icon: Activity,
    gradient: 'from-emerald-500 to-green-700',
    light: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-600 dark:text-emerald-400',
    glow: 'shadow-emerald-500/25',
    estimate: [8000, 45000],
    unit: '/year',
    tagline: 'Term life cover up to 1 Crore',
    insured: '400K+ lives secured',
  },
];

const carMakes = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Honda', 'Kia', 'Toyota', 'Mahindra', 'Volkswagen'];
const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric'];
const years = Array.from({ length: 20 }, (_, i) => String(new Date().getFullYear() - i));
const memberTypes = ['Individual', 'Self + Spouse', 'Self + Spouse + 1 Child', 'Self + Spouse + 2 Children', 'Family Floater'];
const coverAmounts = ['₹3 Lakh', '₹5 Lakh', '₹10 Lakh', '₹15 Lakh', '₹25 Lakh', '₹50 Lakh', '₹1 Crore'];
const sumAssuredOptions = ['₹25 Lakh', '₹50 Lakh', '₹75 Lakh', '₹1 Crore', '₹1.5 Crore', '₹2 Crore', '₹5 Crore'];
const tenures = ['10 years', '15 years', '20 years', '25 years', '30 years', '40 years'];

/* Animated number counter using framer-motion spring */
function AnimatedNumber({ value }: { value: number }) {
  const motionVal = useMotionValue(value);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 14 });
  const [text, setText] = useState(value.toLocaleString('en-IN'));

  useEffect(() => { motionVal.set(value); }, [value, motionVal]);
  useEffect(() => spring.on('change', (v) => setText(Math.round(v).toLocaleString('en-IN'))), [spring]);

  return <span>{text}</span>;
}

/* Floating background orb */
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.7, 0.45] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export function PremiumCalculator() {
  const [activeCategory, setActiveCategory] = useState<Category>('car');
  const [formData, setFormData] = useState<FormData>({});
  const [filledFields, setFilledFields] = useState(0);
  const router = useRouter();

  const cat = categories.find((c) => c.id === activeCategory)!;
  const [minEst, maxEst] = cat.estimate as [number, number];
  const estimatedPremium = Math.round(
    minEst + ((maxEst - minEst) * Math.min(filledFields, 4)) / 4
  );

  const update = (key: keyof FormData, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      setFilledFields(Object.values(next).filter(Boolean).length);
      return next;
    });
  };

  const handleTabChange = (id: Category) => {
    setActiveCategory(id);
    setFormData({});
    setFilledFields(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ ...formData } as Record<string, string>);
    router.push(`/insurance/${activeCategory}?${params.toString()}`);
  };

  const inputCls =
    'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600';
  const labelCls = 'block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5';

  return (
    <section className="relative py-24 bg-white dark:bg-gray-950 overflow-hidden">
      {/* Background orbs */}
      <Orb className="w-96 h-96 bg-primary-200 dark:bg-primary-900/40 -top-20 -left-20 opacity-50" />
      <Orb className="w-80 h-80 bg-blue-200 dark:bg-blue-900/30 bottom-0 right-0 opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-widest mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Calculator className="w-3.5 h-3.5" />
            Premium Calculator
          </motion.span>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-gray-900 dark:text-white mb-4 leading-tight">
            Calculate Your{' '}
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className={`bg-gradient-to-r ${cat.gradient} bg-clip-text text-transparent`}
                >
                  Premium
                </motion.span>
              </AnimatePresence>
              <motion.span
                className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r ${cat.gradient} rounded-full`}
                layoutId="title-underline"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </span>{' '}
            Instantly
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Real quotes from 30+ top insurers — no spam, no hidden fees.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="grid lg:grid-cols-5 gap-0 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {/* ── LEFT PANEL ── */}
          <div className="lg:col-span-2 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>

            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute top-1/2 right-6 w-20 h-20 rounded-full bg-white/5" />

            <div className="relative p-8 lg:p-10 flex flex-col h-full min-h-[420px] justify-between">
              {/* Category icon */}
              <motion.div
                key={activeCategory + '-icon'}
                initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl"
              >
                <cat.icon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Estimate display */}
              <div>
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">
                  Estimated Premium
                </p>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-white/60 text-2xl font-bold">₹</span>
                  <span className="text-white font-black text-5xl leading-none">
                    <AnimatedNumber value={estimatedPremium} />
                  </span>
                  <span className="text-white/70 text-sm mb-1">{cat.unit}</span>
                </div>

                {/* Accuracy progress bar */}
                <div className="mt-4 mb-2">
                  <div className="flex justify-between text-white/60 text-xs mb-1.5">
                    <span>Quote accuracy</span>
                    <span>{Math.min(Math.round((filledFields / 4) * 100), 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-white"
                      animate={{ width: `${Math.min((filledFields / 4) * 100, 100)}%` }}
                      transition={{ type: 'spring', stiffness: 80 }}
                    />
                  </div>
                </div>
                <p className="text-white/70 text-xs mt-3">{cat.tagline}</p>
              </div>

              {/* Trust badges */}
              <div className="space-y-2.5">
                {[
                  { icon: TrendingDown, text: 'Save up to 40% on premium' },
                  { icon: Shield, text: 'IRDAI certified insurers only' },
                  { icon: Zap, text: cat.insured },
                ].map(({ icon: Icon, text }) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2.5"
                  >
                    <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-white/80 text-xs font-medium">{text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="lg:col-span-3 flex flex-col">
            {/* Category tabs */}
            <div className="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
              {categories.map((c) => {
                const isActive = activeCategory === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleTabChange(c.id)}
                    className={`relative flex-1 flex flex-col items-center gap-2 py-4 px-2 text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    <motion.div
                      className={`p-2.5 rounded-xl transition-all duration-200 ${
                        isActive
                          ? `bg-gradient-to-br ${c.gradient} shadow-lg`
                          : 'bg-gray-100 dark:bg-gray-700/60'
                      }`}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <c.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                    </motion.div>
                    <span className="hidden sm:block">{c.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="tab-bar"
                        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${c.gradient}`}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 p-6 lg:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="flex-1"
                >
                  {(activeCategory === 'car' || activeCategory === 'bike') && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Vehicle Make</label>
                        <select className={inputCls} value={formData.make || ''} onChange={(e) => update('make', e.target.value)}>
                          <option value="">Select Brand</option>
                          {carMakes.map((m) => <option key={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Vehicle Model</label>
                        <input className={inputCls} placeholder="e.g. Swift, Creta, Activa" value={formData.model || ''} onChange={(e) => update('model', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Year of Manufacture</label>
                        <select className={inputCls} value={formData.year || ''} onChange={(e) => update('year', e.target.value)}>
                          <option value="">Select Year</option>
                          {years.map((y) => <option key={y}>{y}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Fuel Type</label>
                        <div className="grid grid-cols-2 gap-2">
                          {fuelTypes.map((f) => (
                            <label key={f} className={`flex items-center justify-center py-2.5 rounded-xl border-2 cursor-pointer text-xs font-bold transition-all ${
                              formData.fuel === f
                                ? `border-transparent bg-gradient-to-r ${cat.gradient} text-white shadow-md`
                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}>
                              <input type="radio" name="fuel" className="sr-only" value={f} onChange={() => update('fuel', f)} />
                              {f}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Registration Number <span className="normal-case text-gray-400 font-normal">(optional)</span></label>
                        <input className={inputCls} placeholder="e.g. MH02AB1234" value={formData.registration || ''} onChange={(e) => update('registration', e.target.value.toUpperCase())} />
                      </div>
                    </div>
                  )}

                  {activeCategory === 'health' && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Cover For</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {memberTypes.map((m) => (
                            <label key={m} className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-2 cursor-pointer text-xs font-semibold transition-all ${
                              formData.memberType === m
                                ? `border-transparent bg-gradient-to-r ${cat.gradient} text-white`
                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                            }`}>
                              <input type="radio" name="memberType" className="sr-only" value={m} onChange={() => update('memberType', m)} />
                              <Users className="w-3.5 h-3.5 flex-shrink-0" />
                              {m}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Age (Primary Member)</label>
                        <input className={inputCls} type="number" min="18" max="80" placeholder="e.g. 35" value={formData.age || ''} onChange={(e) => update('age', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Cover Amount</label>
                        <select className={inputCls} value={formData.coverAmount || ''} onChange={(e) => update('coverAmount', e.target.value)}>
                          <option value="">Select Cover</option>
                          {coverAmounts.map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {activeCategory === 'life' && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Date of Birth</label>
                        <input className={inputCls} type="date" value={formData.dob || ''} onChange={(e) => update('dob', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Annual Income</label>
                        <input className={inputCls} placeholder="e.g. ₹8,00,000" value={formData.annualIncome || ''} onChange={(e) => update('annualIncome', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Sum Assured</label>
                        <select className={inputCls} value={formData.sumAssured || ''} onChange={(e) => update('sumAssured', e.target.value)}>
                          <option value="">Select Cover</option>
                          {sumAssuredOptions.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Policy Tenure</label>
                        <select className={inputCls} value={formData.tenure || ''} onChange={(e) => update('tenure', e.target.value)}>
                          <option value="">Select Tenure</option>
                          {tenures.map((t) => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* CTA */}
              <motion.div
                className="mt-8 flex flex-col sm:flex-row items-center gap-4"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r ${cat.gradient} text-white font-bold text-base shadow-xl hover:opacity-90 transition-opacity overflow-hidden group`}
                >
                  {/* Shimmer */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                  />
                  <Sparkles className="w-4 h-4" />
                  View {cat.label} Insurance Quotes
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </motion.button>

                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-600 dark:text-gray-300">4.8/5</span>
                  from 50,000+ users
                </div>
              </motion.div>

              {/* Trust strip */}
              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-x-5 gap-y-2">
                {['100% Free', 'No spam calls', 'Instant PDF policy', 'IRDAI regulated'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
