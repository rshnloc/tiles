'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  motion, AnimatePresence, useInView, useMotionValue, useSpring,
  useTransform, useMotionTemplate,
} from 'framer-motion';
import Link from 'next/link';
import {
  Car, Bike, Heart, Activity, ArrowRight, Star, Shield, Clock, Phone,
  CheckCircle2, Users, FileText, Award, ChevronRight, Zap, TrendingUp,
  MessageCircle, Search, Quote, ThumbsUp, HeartHandshake, BadgeCheck,
  Sparkles, TrendingDown, ChevronLeft, Headphones, IndianRupee, Flame,
} from 'lucide-react';
import CountUp from 'react-countup';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { fadeUpVariants, staggerContainer } from '@/components/ui/PageTransition';
import { PremiumCalculator } from '@/components/insurance/PremiumCalculator';
import { CompareSection } from '@/components/insurance/CompareSection';

// ==================== HERO ====================

// ── Floating particles data ──
const ORBS = [
  { x: '8%',  y: '15%', size: 420, delay: 0,   color: 'from-primary-600/20 to-primary-400/5' },
  { x: '70%', y: '5%',  size: 340, delay: 1.2, color: 'from-secondary-500/15 to-secondary-300/5' },
  { x: '45%', y: '60%', size: 260, delay: 2.5, color: 'from-blue-600/12 to-blue-400/3' },
  { x: '-5%', y: '55%', size: 220, delay: 1.8, color: 'from-violet-500/10 to-violet-300/3' },
  { x: '80%', y: '55%', size: 180, delay: 0.6, color: 'from-cyan-500/10 to-cyan-300/3' },
];

const MINI_PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 5,
  dur: Math.random() * 6 + 6,
}));

const TICKER_ITEMS = [
  { emoji: '🚗', text: 'Car insurance from ₹2,094/yr', color: 'text-blue-300' },
  { emoji: '❤️', text: 'Health from ₹3,399/yr', color: 'text-rose-300' },
  { emoji: '⚡', text: 'Instant policy issuance', color: 'text-yellow-300' },
  { emoji: '🏆', text: '4.8★ rated by 5L+ users', color: 'text-amber-300' },
  { emoji: '🏍️', text: 'Bike insurance from ₹714/yr', color: 'text-orange-300' },
  { emoji: '🛡️', text: '98% claim settlement ratio', color: 'text-green-300' },
];

const CATEGORIES = [
  {
    id: 'car', label: 'Car Insurance', icon: Car,
    color: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/30',
    href: '/insurance/car', price: '₹2,094/yr', badge: 'Most Popular',
    features: ['Zero Depreciation', 'Roadside Assist', 'Engine Cover'],
  },
  {
    id: 'bike', label: 'Bike Insurance', icon: Bike,
    color: 'from-orange-500 to-amber-500', glow: 'shadow-orange-500/30',
    href: '/insurance/bike', price: '₹714/yr', badge: 'Best Value',
    features: ['OD + Third Party', 'Cashless Repair', 'PA Cover'],
  },
  {
    id: 'health', label: 'Health Insurance', icon: Heart,
    color: 'from-rose-500 to-pink-600', glow: 'shadow-rose-500/30',
    href: '/insurance/health', price: '₹3,399/yr', badge: '500+ Hospitals',
    features: ['Cashless Claims', 'No Room Rent Limit', 'Day Care'],
  },
  {
    id: 'life', label: 'Life Insurance', icon: Activity,
    color: 'from-emerald-500 to-teal-500', glow: 'shadow-emerald-500/30',
    href: '/insurance/life', price: '₹490/yr', badge: '₹1Cr Cover',
    features: ['Tax Benefit', 'Accidental Rider', 'Critical Illness'],
  },
];

const HERO_WORDS_1 = ['Protect', 'What'];
const HERO_WORDS_2 = ['Matters', 'Most'];

// ── Magnetic cursor card ──
function MagneticCard({
  cat, isActive, onEnter, onLeave,
}: {
  cat: typeof CATEGORIES[0];
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
    onLeave();
  };

  const Icon = cat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileTap={{ scale: 0.96 }}
      onMouseMove={handleMouse}
      onMouseEnter={onEnter}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className="cursor-pointer"
    >
      <Link href={cat.href}>
        <div className={`relative group p-5 rounded-2xl border overflow-hidden transition-all duration-300 ${
          isActive
            ? `bg-white/15 border-white/35 shadow-2xl ${cat.glow}`
            : 'bg-white/6 border-white/12 hover:bg-white/10'
        }`}>
          {/* Background gradient glow */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${cat.color} rounded-2xl`}
            animate={{ opacity: isActive ? 0.14 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Shimmer sweep on hover */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                key="shimmer"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-12"
                initial={{ x: '-150%' }}
                animate={{ x: '250%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
              />
            )}
          </AnimatePresence>

          {/* Badge */}
          <div className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${cat.color} text-white shadow`}>
            {cat.badge}
          </div>

          {/* Icon */}
          <motion.div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 shadow-xl`}
            animate={isActive ? { scale: 1.15, rotate: 6 } : { scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 16 }}
            style={{ translateZ: 20 }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>

          <h3 className="font-bold text-white text-sm mb-0.5">{cat.label}</h3>
          <p className={`text-xs font-black mb-3 bg-gradient-to-r ${cat.color} bg-clip-text text-transparent`}>
            {cat.price}
          </p>

          {/* Features */}
          <ul className="space-y-1 mb-4">
            {cat.features.map((f) => (
              <li key={f} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <motion.div
            className="flex items-center gap-1 text-xs font-semibold text-white/70 group-hover:text-white transition-colors"
            animate={isActive ? { x: 3 } : { x: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Get Instant Quote <ArrowRight className="w-3.5 h-3.5" />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Floating stat bubble ──
function StatBubble({ value, label, delay, className }: { value: string; label: string; delay: number; className: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 180, damping: 16 }}
      className={`absolute ${className} bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-center z-10 pointer-events-none`}
    >
      <motion.p
        className="font-black text-white text-lg leading-none"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: delay + 1 }}
      >
        {value}
      </motion.p>
      <p className="text-gray-400 text-[10px] mt-0.5 font-medium">{label}</p>
    </motion.div>
  );
}

// ── Live ticker ──
function HeroTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % TICKER_ITEMS.length), 2600);
    return () => clearInterval(t);
  }, []);
  const item = TICKER_ITEMS[idx];
  return (
    <div className="inline-flex items-center gap-3 bg-white/8 border border-white/15 rounded-xl px-4 py-2.5 overflow-hidden max-w-xs">
      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-green-400 shrink-0">
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        LIVE
      </span>
      <div className="w-px h-3 bg-white/20 shrink-0" />
      <div className="flex-1 overflow-hidden h-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`text-xs whitespace-nowrap ${item.color}`}
          >
            {item.emoji} {item.text}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Main hero section ──
function HeroSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    mouseX.set(nx);
    mouseY.set(ny);
    setMousePos({ x: nx, y: ny });
  }, [mouseX, mouseY]);

  // Spotlight effect coordinates
  const spotX = useTransform(smoothX, [0, 1], ['10%', '90%']);
  const spotY = useTransform(smoothY, [0, 1], ['10%', '90%']);
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${spotX} ${spotY}, rgba(99,102,241,0.12), transparent 70%)`;

  // Stagger for headline words
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };
  const wordVariants = {
    hidden: { opacity: 0, y: 60, rotateX: -30, filter: 'blur(8px)' },
    visible: {
      opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
      transition: { type: 'spring' as const, stiffness: 120, damping: 16 },
    },
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#080c14]"
    >
      {/* ── BACKGROUND LAYER ── */}
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1628] via-[#0a0f1e] to-[#080c14]" />

      {/* Mouse spotlight */}
      <motion.div className="absolute inset-0 z-0" style={{ background: spotlight }} />

      {/* Animated orbs */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-radial ${orb.color} blur-3xl`}
          style={{ left: orb.x, top: orb.y, width: orb.size, height: orb.size }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10 + i * 2.5, repeat: Infinity, delay: orb.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Floating mini particles */}
      {MINI_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── CONTENT ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 pt-36 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ═══════ LEFT COLUMN ═══════ */}
          <div className="text-white space-y-7">

            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/8 border border-white/18 text-xs font-semibold text-primary-300 backdrop-blur-sm"
            >
              <motion.span
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_2px_rgba(74,222,128,0.5)]"
              />
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              India&apos;s #1 Insurance Marketplace — 5M+ customers
            </motion.div>

            {/* ── HEADLINE ── */}
            <div className="overflow-visible">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ perspective: 1000 }}
              >
                {/* Line 1 */}
                <div className="flex flex-wrap gap-x-4">
                  {HERO_WORDS_1.map((w, i) => (
                    <motion.span
                      key={i}
                      variants={wordVariants}
                      className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white inline-block"
                    >
                      {w}
                    </motion.span>
                  ))}
                </div>
                {/* Line 2 — gradient + underline */}
                <div className="flex flex-wrap gap-x-4 mt-1 relative">
                  {HERO_WORDS_2.map((w, i) => (
                    <motion.span
                      key={i}
                      variants={wordVariants}
                      className="font-display font-black text-5xl sm:text-6xl lg:text-7xl inline-block bg-gradient-to-r from-primary-400 via-violet-400 to-secondary-400 bg-clip-text text-transparent"
                    >
                      {w}
                    </motion.span>
                  ))}
                  {/* Animated SVG underline */}
                  <motion.svg
                    viewBox="0 0 400 14"
                    className="absolute -bottom-3 left-0 w-3/4"
                    fill="none"
                  >
                    <motion.path
                      d="M4 10 C60 2, 130 14, 200 7 C270 0, 340 12, 396 6"
                      stroke="url(#uGrad)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="uGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="50%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                </div>
              </motion.div>
            </div>

            {/* Sub-copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-base text-gray-400 leading-relaxed max-w-lg"
            >
              Compare &amp; buy insurance from <span className="text-white font-semibold">30+ trusted insurers</span> in seconds.
              Paperless, instant, and backed by <span className="text-primary-400 font-semibold">expert advisors</span>.
            </motion.p>

            {/* ── SEARCH BAR ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.82 }}
            >
              <div className="relative flex items-center bg-white/8 backdrop-blur-lg border border-white/18 rounded-2xl p-1.5 max-w-lg focus-within:border-primary-500/60 focus-within:bg-white/12 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] transition-all duration-300 group">
                <Search className="w-4.5 h-4.5 text-gray-500 ml-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search car, health, life insurance..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 px-3 py-2.5 text-sm focus:outline-none"
                />
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="gradient" size="sm" className="rounded-xl px-5">
                    Search
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Live ticker */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.94 }}
            >
              <HeroTicker />
            </motion.div>

            {/* ── CTA BUTTONS ── */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/advisors">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 24px 4px rgba(99,102,241,0.45)' }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-semibold text-sm px-7 py-3.5 rounded-xl shadow-lg transition-all"
                >
                  <Phone className="w-4 h-4" /> Get Free Advice
                </motion.button>
              </Link>
              <Link href="/insurance">
                <motion.button
                  whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.12)' }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 bg-white/8 border border-white/20 text-white font-semibold text-sm px-7 py-3.5 rounded-xl transition-all"
                >
                  Explore Plans <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>

            {/* ── TRUST PILLS ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex flex-wrap items-center gap-3"
            >
              {[
                { icon: Shield, text: 'IRDAI Approved', color: 'text-blue-400' },
                { icon: Zap, text: 'Instant Issuance', color: 'text-yellow-400' },
                { icon: Star, text: '4.8★ Rated', color: 'text-amber-400' },
                { icon: BadgeCheck, text: '98% Claim Rate', color: 'text-green-400' },
              ].map(({ icon: Icon, text, color }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.25 + i * 0.08, type: 'spring' }}
                  whileHover={{ scale: 1.06, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white/6 border border-white/12 text-gray-300 cursor-default transition-all"
                >
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  {text}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ═══════ RIGHT COLUMN — 3-D Tilt Cards ═══════ */}
          <div className="relative">
            {/* Floating stat bubbles */}
            <StatBubble value="5M+" label="Happy Customers" delay={1.2} className="-top-4 -left-6 hidden lg:block" />
            <StatBubble value="98%" label="Claim Settlement" delay={1.5} className="-bottom-4 -right-4 hidden lg:block" />
            <StatBubble value="2min" label="Avg Buy Time" delay={1.8} className="top-1/2 -right-8 hidden xl:block" />

            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 50, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.13, type: 'spring', stiffness: 130, damping: 18 }}
                >
                  <MagneticCard
                    cat={cat}
                    isActive={activeCategory === cat.id}
                    onEnter={() => setActiveCategory(cat.id)}
                    onLeave={() => setActiveCategory(null)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Decorative ring behind cards */}
            <motion.div
              className="absolute inset-[-10%] rounded-3xl border border-white/5 pointer-events-none"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-[-20%] rounded-3xl border border-primary-500/8 pointer-events-none"
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>
      </div>

      {/* ── BOTTOM WAVE ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <motion.svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
          className="w-full"
        >
          <path
            d="M0 90L1440 90L1440 45C1320 80 1080 20 900 42C720 64 540 10 360 38C180 66 60 18 0 45Z"
            className="fill-white dark:fill-gray-950"
          />
        </motion.svg>
      </div>
    </section>
  );
}

// ==================== STATS ====================
function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    { value: 5000000, label: 'Happy Customers', suffix: '+', prefix: '', icon: Users, color: 'text-blue-600' },
    { value: 10000000, label: 'Policies Sold', suffix: '+', prefix: '', icon: FileText, color: 'text-green-600' },
    { value: 30, label: 'Insurer Partners', suffix: '+', prefix: '', icon: Award, color: 'text-purple-600' },
    { value: 98, label: 'Claim Settlement', suffix: '%', prefix: '', icon: CheckCircle2, color: 'text-orange-600' },
  ];

  return (
    <section ref={ref} className="py-16 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className={`inline-flex p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 mb-3 ${stat.color}`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="text-3xl font-display font-black text-gray-900 dark:text-white mb-1">
                {stat.prefix}
                {isInView && (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    separator=","
                    delay={i * 0.1}
                    formattingFn={(v) =>
                      v >= 10000000
                        ? `${(v / 10000000).toFixed(1)}Cr`
                        : v >= 100000
                        ? `${(v / 100000).toFixed(1)}L`
                        : v.toLocaleString('en-IN')
                    }
                  />
                )}
                {stat.suffix}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== HOW IT WORKS ====================
function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Compare Plans',
      desc: 'Enter your vehicle or personal details and instantly compare plans from 30+ top insurers side-by-side.',
      icon: Search,
      color: 'from-blue-500 to-blue-700',
      glow: 'shadow-blue-200 dark:shadow-blue-900',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      accent: 'text-blue-600 dark:text-blue-400',
      highlight: 'border-blue-200 dark:border-blue-800',
      features: ['30+ insurers', 'Instant quotes', 'Side-by-side compare'],
    },
    {
      number: '02',
      title: 'Pick Your Plan',
      desc: 'Filter by premium, claim ratio, and add-ons. Our AI recommends the best fit for your needs and budget.',
      icon: CheckCircle2,
      color: 'from-purple-500 to-purple-700',
      glow: 'shadow-purple-200 dark:shadow-purple-900',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      accent: 'text-purple-600 dark:text-purple-400',
      highlight: 'border-purple-200 dark:border-purple-800',
      features: ['AI recommendations', 'Smart filters', 'Transparent pricing'],
    },
    {
      number: '03',
      title: 'Buy in Minutes',
      desc: 'Complete paperless KYC with Aadhaar OTP, make payment via UPI or card, and get policy PDF instantly.',
      icon: Zap,
      color: 'from-green-500 to-emerald-700',
      glow: 'shadow-green-200 dark:shadow-green-900',
      bg: 'bg-green-50 dark:bg-green-900/20',
      accent: 'text-green-600 dark:text-green-400',
      highlight: 'border-green-200 dark:border-green-800',
      features: ['Paperless KYC', 'UPI / Card / EMI', 'Instant PDF policy'],
    },
    {
      number: '04',
      title: 'Manage & Claim',
      desc: 'Track all your policies in one dashboard, file claims online, and get expert advisor support 24/7.',
      icon: Shield,
      color: 'from-orange-500 to-orange-700',
      glow: 'shadow-orange-200 dark:shadow-orange-900',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      accent: 'text-orange-600 dark:text-orange-400',
      highlight: 'border-orange-200 dark:border-orange-800',
      features: ['Online claims', 'Real-time tracking', '24/7 support'],
    },
  ];

  const active = steps[activeStep];

  return (
    <section ref={ref} className="py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-4">
            HOW IT WORKS
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white mb-4">
            Get Insured in 4 Simple Steps
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            From comparison to policy — completely online, completely paperless.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Step Tabs */}
          <div className="space-y-3">
            {steps.map((step, i) => (
              <motion.button
                key={step.number}
                onClick={() => setActiveStep(i)}
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className={`w-full text-left flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-300 ${
                  activeStep === i
                    ? `bg-white dark:bg-gray-800 ${step.highlight} shadow-lg`
                    : 'bg-white/60 dark:bg-gray-800/40 border-transparent hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'
                }`}
              >
                {/* Number + Icon */}
                <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  activeStep === i
                    ? `bg-gradient-to-br ${step.color} shadow-lg ${step.glow}`
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <step.icon className={`w-5 h-5 ${activeStep === i ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                  <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center transition-all ${
                    activeStep === i
                      ? `bg-gradient-to-br ${step.color} text-white`
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                  }`}>
                    {i + 1}
                  </span>
                </div>
                {/* Text */}
                <div className="flex-1">
                  <h3 className={`font-bold text-base transition-colors ${
                    activeStep === i ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                  }`}>{step.title}</h3>
                  {activeStep === i && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`text-xs mt-0.5 ${step.accent}`}
                    >
                      {step.features.join(' · ')}
                    </motion.p>
                  )}
                </div>
                {/* Arrow */}
                {activeStep === i && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Right: Active Step Detail Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Background glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${active.color} opacity-10 rounded-3xl blur-2xl scale-110`} />

            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl"
            >
              {/* Step badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${active.color} flex items-center justify-center shadow-lg ${active.glow}`}>
                  <active.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className={`text-xs font-bold uppercase tracking-widest ${active.accent}`}>Step {activeStep + 1} of 4</span>
                  <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">{active.title}</h3>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{active.desc}</p>

              {/* Features list */}
              <div className="space-y-2.5 mb-6">
                {active.features.map((f, fi) => (
                  <motion.div
                    key={f}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: fi * 0.08 }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl ${active.bg}`}
                  >
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${active.accent}`} />
                    <span className={`text-sm font-medium ${active.accent}`}>{f}</span>
                  </motion.div>
                ))}
              </div>

              {/* Progress dots */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {steps.map((_, di) => (
                    <button
                      key={di}
                      onClick={() => setActiveStep(di)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        di === activeStep
                          ? `w-6 bg-gradient-to-r ${active.color}`
                          : 'w-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
                    disabled={activeStep === 0}
                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                  <button
                    onClick={() => setActiveStep((p) => Math.min(steps.length - 1, p + 1))}
                    disabled={activeStep === steps.length - 1}
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${active.color} flex items-center justify-center text-white disabled:opacity-30 transition-opacity`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ==================== FEATURES ====================
function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const features = [
    {
      icon: TrendingUp, color: 'bg-blue-500',
      title: 'AI-Based Recommendations',
      desc: 'Our AI analyzes your profile and recommends the best insurance plans tailored just for you.',
    },
    {
      icon: Zap, color: 'bg-green-500',
      title: 'Instant Policy Issuance',
      desc: 'Get your policy document in your inbox within minutes of payment.',
    },
    {
      icon: Shield, color: 'bg-purple-500',
      title: 'Paperless KYC',
      desc: 'Complete KYC with Aadhaar OTP and PAN — no physical documents needed.',
    },
    {
      icon: MessageCircle, color: 'bg-orange-500',
      title: 'Expert Advisor Support',
      desc: 'Connect with certified insurance advisors via chat, call, or video anytime.',
    },
    {
      icon: CheckCircle2, color: 'bg-red-500',
      title: 'Hassle-free Claims',
      desc: 'File claims online, track status in real-time, and get assistance throughout.',
    },
    {
      icon: Clock, color: 'bg-teal-500',
      title: 'Smart Renewal Reminders',
      desc: 'Never miss a renewal. Get reminders via SMS, email, and WhatsApp well in advance.',
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-3">
            WHY CHOOSE US
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white mb-4">
            Everything You Need, In One Place
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              className="group p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-gray-900"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className={`w-12 h-12 ${feat.color} rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <feat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feat.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== WHY US ====================
const WHY_US = [
  {
    icon: BadgeCheck,
    title: 'IRDAI Certified',
    desc: 'All our insurer partners are fully licensed by IRDAI — India\'s insurance regulator. 100% safe & compliant.',
    gradient: 'from-blue-500 to-blue-700',
    stat: '30+',
    statLabel: 'Certified Insurers',
  },
  {
    icon: TrendingDown,
    title: 'Best Price Guarantee',
    desc: 'Our algorithm scans every insurer in real-time. If you find a lower premium anywhere, we\'ll match it.',
    gradient: 'from-emerald-500 to-green-700',
    stat: '40%',
    statLabel: 'Avg. Savings',
  },
  {
    icon: Zap,
    title: 'Instant Issuance',
    desc: 'Complete KYC with Aadhaar OTP, pay via UPI and receive your policy PDF — all in under 5 minutes.',
    gradient: 'from-yellow-500 to-orange-600',
    stat: '5 min',
    statLabel: 'Policy Issuance',
  },
  {
    icon: HeartHandshake,
    title: 'Dedicated Claims Support',
    desc: 'Our claims concierge team tracks every claim from filing to settlement. 98% of claims settled on time.',
    gradient: 'from-rose-500 to-pink-700',
    stat: '98%',
    statLabel: 'Claims Settled',
  },
  {
    icon: Headphones,
    title: '24/7 Expert Advisors',
    desc: 'Talk to certified advisors anytime via chat, call, or video. No bots — real humans who care.',
    gradient: 'from-purple-500 to-violet-700',
    stat: '24/7',
    statLabel: 'Support',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Recommendations',
    desc: 'Our AI analyses your profile, lifestyle, and budget to recommend the exact plan that fits you best.',
    gradient: 'from-cyan-500 to-sky-700',
    stat: '99%',
    statLabel: 'Accuracy',
  },
];

function WhyUsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-24 bg-white dark:bg-gray-950 overflow-hidden">
      {/* Background accents */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/40 to-transparent"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2 }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary-50 dark:bg-primary-900/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary-50 dark:bg-secondary-900/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-widest mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
          >
            <Shield className="w-3.5 h-3.5" />
            Why Choose SunischistInsurance
          </motion.span>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-gray-900 dark:text-white mb-4">
            Insurance that works{' '}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              for you
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            We&apos;re not just another comparison site. We&apos;re your insurance partner from day one — through comparison, purchase, and claim.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_US.map((item, i) => {
            const Icon = item.icon;
            const isHov = hovered === i;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.55, type: 'spring', stiffness: 120, damping: 20 }}
                whileHover={{ y: -8 }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                className="relative group"
              >
                <div className={`relative h-full bg-white dark:bg-gray-900 rounded-2xl border-2 p-6 overflow-hidden transition-all duration-300 ${
                  isHov ? 'border-transparent shadow-2xl' : 'border-gray-100 dark:border-gray-800 shadow-sm'
                }`}>
                  {/* Hover gradient bg */}
                  <AnimatePresence>
                    {isHov && (
                      <motion.div
                        key="hov-bg"
                        className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.07 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon */}
                  <motion.div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 shadow-lg`}
                    animate={isHov ? { scale: 1.12, rotate: 8 } : { scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>

                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">{item.desc}</p>

                  {/* Stat pill */}
                  <motion.div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r ${item.gradient}`}
                    animate={isHov ? { scale: 1.05 } : { scale: 1 }}
                  >
                    <span className="text-white font-black text-base">{item.stat}</span>
                    <span className="text-white/80 text-xs font-medium">{item.statLabel}</span>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats strip */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            Join <span className="font-bold text-gray-900 dark:text-white">5 million+</span> Indians who trust SunischistInsurance.
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[
              { label: '5M+', sub: 'Happy Customers' },
              { label: '10Cr+', sub: 'Policies Issued' },
              { label: '₹500Cr+', sub: 'Claims Settled' },
              { label: '4.8★', sub: 'App Rating' },
            ].map((s, si) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 + si * 0.08 }}
                className="text-center"
              >
                <div className="font-black text-2xl text-gray-900 dark:text-white">{s.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==================== TESTIMONIALS CAROUSEL ====================
const ALL_TESTIMONIALS = [
  { name: 'Priya Sharma',  avatar: 'PS', location: 'Mumbai',    rating: 5, policy: 'Health Insurance', gradient: 'from-rose-500 to-pink-700',    text: 'Got a comprehensive health plan for my family at 20% less than what I was paying. The comparison tool is absolutely brilliant!' },
  { name: 'Rahul Gupta',   avatar: 'RG', location: 'Delhi',     rating: 5, policy: 'Car Insurance',    gradient: 'from-blue-500 to-blue-700',    text: 'Renewed my car insurance in literally 5 minutes. The process was so smooth and the price was the best I could find anywhere online.' },
  { name: 'Anita Verma',   avatar: 'AV', location: 'Bangalore', rating: 5, policy: 'Life Insurance',   gradient: 'from-emerald-500 to-green-700', text: 'The advisor helped me understand term insurance properly. Bought a ₹1Cr cover at just ₹8,000/year! Couldn\'t believe it was this affordable.' },
  { name: 'Kiran Patel',   avatar: 'KP', location: 'Ahmedabad', rating: 5, policy: 'Bike Insurance',   gradient: 'from-orange-500 to-amber-700',  text: 'Claim was settled in just 48 hours. Never expected insurance to be this hassle-free. The support team was incredibly responsive.' },
  { name: 'Deepa Nair',    avatar: 'DN', location: 'Chennai',   rating: 5, policy: 'Health Insurance', gradient: 'from-purple-500 to-violet-700', text: 'Switched from my old insurer and saved ₹4,200 annually. The cashless hospital feature saved us during an emergency surgery.' },
  { name: 'Vikram Singh',  avatar: 'VS', location: 'Pune',      rating: 5, policy: 'Car Insurance',    gradient: 'from-cyan-500 to-sky-700',      text: 'Three cars insured through SunischistInsurance now. The multi-vehicle discount is amazing and the app makes tracking renewals effortless.' },
];

function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragX = useMotionValue(0);
  const VISIBLE = 3; // cards visible at once on desktop
  const total = ALL_TESTIMONIALS.length;

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + total) % total);
  }, [total]);

  // Auto-advance
  useEffect(() => {
    if (isDragging) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next, isDragging]);

  // Drag end handler
  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    setIsDragging(false);
    if (info.offset.x < -50) next();
    else if (info.offset.x > 50) prev();
  };

  // Visible indices (wrap around)
  const visibleIndices = Array.from({ length: VISIBLE }, (_, i) => (current + i) % total);

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:  (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0, scale: 0.95 }),
  };

  return (
    <section ref={ref} className="py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-widest mb-4">
            <ThumbsUp className="w-3.5 h-3.5" /> Testimonials
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-gray-900 dark:text-white mb-4">
            Loved by Millions of Indians
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Real stories from real customers who switched to smarter insurance.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Cards track */}
          <motion.div
            className="cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            style={{ x: dragX }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 select-none">
              <AnimatePresence mode="popLayout" custom={direction}>
                {visibleIndices.map((idx) => {
                  const t = ALL_TESTIMONIALS[idx];
                  return (
                    <motion.div
                      key={`${idx}-${current}`}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                    >
                      {/* Top accent bar */}
                      <div className={`h-1.5 bg-gradient-to-r ${t.gradient}`} />

                      <div className="p-6">
                        {/* Quote icon */}
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center mb-4 shadow-md`}>
                          <Quote className="w-5 h-5 text-white" />
                        </div>

                        {/* Stars */}
                        <div className="flex gap-0.5 mb-3">
                          {[...Array(t.rating)].map((_, j) => (
                            <motion.div
                              key={j}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: j * 0.06 }}
                            >
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            </motion.div>
                          ))}
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5 italic">
                          &quot;{t.text}&quot;
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-black shadow-md`}>
                            {t.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t.location} · {t.policy}</p>
                          </div>
                          <div className="ml-auto">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${t.gradient} text-white`}>Verified</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-10">
            {/* Prev button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
              onClick={prev}
              className="w-11 h-11 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-2">
              {ALL_TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}>
                  <motion.div
                    animate={{
                      width: i === current ? 24 : 8,
                      backgroundColor: i === current ? '#4f46e5' : '#d1d5db',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="h-2 rounded-full"
                  />
                </button>
              ))}
            </div>

            {/* Next button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
              onClick={next}
              className="w-11 h-11 rounded-full bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Swipe hint */}
          <p className="text-center text-xs text-gray-400 mt-4">Drag to swipe · Auto-advances every 4s</p>
        </motion.div>
      </div>
    </section>
  );
}

// ==================== CTA SECTION ====================
function CTASection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 rounded-3xl p-10 md:p-14 text-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Bg decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold mb-4">
              <Phone className="w-3.5 h-3.5" /> FREE EXPERT CONSULTATION
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-4">
              Not sure which insurance to buy?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
              Talk to our certified insurance advisors for free. Get personalized recommendations in 15 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/advisors">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Phone className="w-5 h-5" />}
                  className="bg-white text-primary-700 hover:bg-gray-100 border-0 shadow-xl"
                >
                  Get Free Advice
                </Button>
              </Link>
              <Link href="/advisors/find">
                <Button
                  variant="ghost"
                  size="lg"
                  icon={<Search className="w-5 h-5" />}
                  className="text-white border border-white/30 hover:bg-white/10"
                >
                  Find Advisor Nearby
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==================== MAIN PAGE ====================
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PremiumCalculator />
      <CompareSection />
      <WhyUsSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
