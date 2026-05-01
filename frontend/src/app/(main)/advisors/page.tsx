'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Star, Phone, MessageCircle,
  Shield, ChevronRight, Award, Users, CheckCircle2,
  Calendar, Filter, X,
} from 'lucide-react';

const advisors = [
  {
    id: 1,
    name: 'Priya Sharma',
    avatar: 'PS',
    color: 'from-pink-500 to-rose-600',
    specialization: ['Health', 'Life'],
    city: 'Mumbai',
    rating: 4.9,
    reviews: 128,
    policiesSold: 840,
    experience: '8 years',
    languages: ['Hindi', 'English', 'Marathi'],
    badge: 'Top Advisor',
    bio: 'Specialist in family health and term life insurance. Helped 800+ families get the right coverage.',
    available: true,
  },
  {
    id: 2,
    name: 'Arjun Mehta',
    avatar: 'AM',
    color: 'from-blue-500 to-indigo-600',
    specialization: ['Car', 'Bike'],
    city: 'Bangalore',
    rating: 4.8,
    reviews: 96,
    policiesSold: 620,
    experience: '6 years',
    languages: ['English', 'Kannada', 'Hindi'],
    badge: 'Motor Expert',
    bio: 'Motor insurance specialist. Excellent claim support track record with 95%+ settlement rate.',
    available: true,
  },
  {
    id: 3,
    name: 'Sunita Reddy',
    avatar: 'SR',
    color: 'from-emerald-500 to-teal-600',
    specialization: ['Health', 'Travel'],
    city: 'Hyderabad',
    rating: 4.7,
    reviews: 74,
    policiesSold: 430,
    experience: '5 years',
    languages: ['Telugu', 'Hindi', 'English'],
    badge: 'Verified',
    bio: 'Corporate health and travel insurance expert. Works with SMEs and individual clients alike.',
    available: false,
  },
  {
    id: 4,
    name: 'Rahul Kapoor',
    avatar: 'RK',
    color: 'from-violet-500 to-purple-700',
    specialization: ['Life', 'Investment'],
    city: 'Delhi',
    rating: 4.9,
    reviews: 210,
    policiesSold: 1200,
    experience: '12 years',
    languages: ['Hindi', 'English', 'Punjabi'],
    badge: 'Elite Advisor',
    bio: 'Wealth & insurance planning expert. Specialises in ULIP, term, and retirement planning.',
    available: true,
  },
  {
    id: 5,
    name: 'Deepa Nair',
    avatar: 'DN',
    color: 'from-amber-500 to-orange-600',
    specialization: ['Health', 'Life', 'Car'],
    city: 'Chennai',
    rating: 4.6,
    reviews: 55,
    policiesSold: 310,
    experience: '4 years',
    languages: ['Tamil', 'English', 'Hindi'],
    badge: 'Verified',
    bio: 'All-lines advisor covering health, life, and motor insurance. Friendly approach to complex plans.',
    available: true,
  },
  {
    id: 6,
    name: 'Vikram Singh',
    avatar: 'VS',
    color: 'from-cyan-500 to-sky-700',
    specialization: ['Car', 'Health'],
    city: 'Pune',
    rating: 4.8,
    reviews: 88,
    policiesSold: 560,
    experience: '7 years',
    languages: ['Hindi', 'English', 'Marathi'],
    badge: 'Top Advisor',
    bio: 'Trusted by thousands of Pune residents for car and health insurance. Claims helpdesk pro.',
    available: true,
  },
];

const cities = ['All Cities', 'Mumbai', 'Bangalore', 'Hyderabad', 'Delhi', 'Chennai', 'Pune'];
const categories = ['All', 'Health', 'Life', 'Car', 'Bike', 'Travel', 'Investment'];

const specializationColors: Record<string, string> = {
  Health: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  Life: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  Car: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  Bike: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  Travel: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
  Investment: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
};

export default function AdvisorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookAdvisor, setBookAdvisor] = useState<typeof advisors[0] | null>(null);
  const [bookingDone, setBookingDone] = useState(false);

  const filtered = advisors.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.specialization.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCity = selectedCity === 'All Cities' || a.city === selectedCity;
    const matchCat = selectedCategory === 'All' || a.specialization.includes(selectedCategory);
    return matchSearch && matchCity && matchCat;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-primary-100 text-xs font-semibold uppercase tracking-widest mb-4">
              Expert Advisors
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white mb-4">
              Find Your Insurance Advisor
            </h1>
            <p className="text-primary-200 max-w-2xl mx-auto text-lg mb-10">
              Connect with IRDAI-certified advisors who guide you to the right plan, handle paperwork, and support your claims.
            </p>

            {/* Search bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
              />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex justify-center gap-8 mt-10"
          >
            {[
              { label: 'Certified Advisors', value: '5,000+' },
              { label: 'Cities Covered', value: '150+' },
              { label: 'Happy Clients', value: '2L+' },
              { label: 'Claims Assisted', value: '98%' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-primary-300 text-xs">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap gap-3 items-center">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="flex gap-2 flex-wrap">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedCity === city
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {city !== 'All Cities' && <MapPin className="w-2.5 h-2.5" />}
                {city}
              </button>
            ))}
          </div>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advisor Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-sm text-gray-400 mb-6">{filtered.length} advisor{filtered.length !== 1 ? 's' : ''} found</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((advisor, i) => (
              <motion.div
                key={advisor.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${advisor.color} p-5 relative`}>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black text-lg">
                      {advisor.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{advisor.name}</h3>
                      <div className="flex items-center gap-1 text-white/80 text-xs">
                        <MapPin className="w-3 h-3" />
                        {advisor.city}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-0.5">
                    <Award className="w-3 h-3 text-yellow-300" />
                    <span className="text-xs font-bold text-white">{advisor.badge}</span>
                  </div>
                  {advisor.available && (
                    <span className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5">
                  {/* Specializations */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {advisor.specialization.map((s) => (
                      <span key={s} className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${specializationColors[s]}`}>
                        {s}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{advisor.bio}</p>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-0.5 text-yellow-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold text-sm text-gray-900 dark:text-white">{advisor.rating}</span>
                      </div>
                      <div className="text-[10px] text-gray-400">{advisor.reviews} reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-sm text-gray-900 dark:text-white">{advisor.policiesSold}</div>
                      <div className="text-[10px] text-gray-400">Policies</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-sm text-gray-900 dark:text-white">{advisor.experience}</div>
                      <div className="text-[10px] text-gray-400">Experience</div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {advisor.languages.map((lang) => (
                      <span key={lang} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                        {lang}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setBookAdvisor(advisor); setBookingDone(false); }}
                      className={`flex-1 py-2.5 rounded-xl bg-gradient-to-r ${advisor.color} text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-md`}
                    >
                      <Calendar className="w-4 h-4" />
                      Book Appointment
                    </motion.button>
                    <button className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary-600 hover:border-primary-300 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary-600 hover:border-primary-300 transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No advisors found for this filter.</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCity('All Cities'); setSelectedCategory('All'); }} className="mt-3 text-primary-600 text-sm font-semibold hover:underline">
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookAdvisor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setBookAdvisor(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${bookAdvisor.color} p-6 flex items-center justify-between`}>
                <div>
                  <h2 className="text-xl font-bold text-white">Book with {bookAdvisor.name}</h2>
                  <p className="text-white/70 text-sm">{bookAdvisor.city} · {bookAdvisor.specialization.join(', ')}</p>
                </div>
                <button onClick={() => setBookAdvisor(null)} className="text-white/70 hover:text-white text-2xl font-light">&times;</button>
              </div>

              {!bookingDone ? (
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 block mb-1.5">Preferred Date</label>
                    <input type="date" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 block mb-1.5">Time Slot</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '5:00 PM', '6:30 PM'].map((t) => (
                        <label key={t} className="flex items-center justify-center py-2 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400 text-xs font-medium text-gray-600 dark:text-gray-400 transition-colors">
                          <input type="radio" name="time" className="sr-only" />
                          {t}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 block mb-1.5">Insurance Type</label>
                    <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm">
                      {bookAdvisor.specialization.map((s) => <option key={s}>{s} Insurance</option>)}
                    </select>
                  </div>
                  <button
                    onClick={() => setBookingDone(true)}
                    className={`w-full py-3 rounded-xl bg-gradient-to-r ${bookAdvisor.color} text-white font-bold shadow-md hover:opacity-90 transition-opacity`}
                  >
                    Confirm Appointment
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Appointment Booked!</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    {bookAdvisor.name} will contact you within 2 hours to confirm the slot.
                  </p>
                  <button onClick={() => setBookAdvisor(null)} className="text-primary-600 font-bold text-sm hover:underline">
                    Back to Advisors
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
