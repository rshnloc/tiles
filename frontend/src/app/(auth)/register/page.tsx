'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield, Loader2, User, Mail, Phone, Lock, Eye, EyeOff,
  ArrowRight, CheckCircle2, ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

const steps = ['Personal', 'Account', 'Verify'];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    password: '', confirm: '', otp: '',
  });
  const router = useRouter();
  const { login } = useAuthStore();

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const nextStep = async () => {
    if (step === 0) {
      if (!form.name.trim()) return toast.error('Full name is required');
      if (!form.email.includes('@')) return toast.error('Enter a valid email');
      if (form.phone.length < 10) return toast.error('Enter a valid 10-digit mobile');
      setStep(1);
    } else if (step === 1) {
      if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
      if (form.password !== form.confirm) return toast.error('Passwords do not match');
      if (!agreed) return toast.error('Please accept Terms & Conditions');
      setLoading(true);
      await new Promise((r) => setTimeout(r, 800));
      setLoading(false);
      setStep(2);
      toast.success('OTP sent to ' + form.phone);
    } else {
      if (form.otp.length < 6) return toast.error('Enter the 6-digit OTP');
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1000));
      login(
        {
          id: Date.now(),
          name: form.name,
          email: form.email,
          phone: form.phone,
          avatar: '',
          role: 'customer',
          kyc_status: 'pending',
          created_at: new Date().toISOString(),
        },
        'demo-token-' + Date.now()
      );
      toast.success(`Welcome to SunischistInsurance, ${form.name.split(' ')[0]}! 🎉`);
      router.push('/dashboard');
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 transition-all';

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-primary-950 to-gray-950 flex items-center justify-center px-4 py-12">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-violet-500/8 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">
              Sunischist<span className="text-primary-400">Insurance</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-glass">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <motion.div
                  animate={
                    i < step
                      ? { backgroundColor: '#22c55e', scale: 1 }
                      : i === step
                      ? { backgroundColor: '#6366f1', scale: 1.1 }
                      : { backgroundColor: 'rgba(255,255,255,0.15)', scale: 1 }
                  }
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                >
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </motion.div>
                <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-white' : 'text-gray-500'}`}>
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600 mx-1" />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 0 — Personal info */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="font-display font-bold text-2xl text-white mb-1">Create account ✨</h1>
                <p className="text-gray-400 text-sm mb-7">Let&apos;s get you started in 2 minutes</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="Raushan Kumar" value={form.name} onChange={set('name')}
                        className={inputClass + ' pl-10'} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" placeholder="raushan@email.com" value={form.email} onChange={set('email')}
                        className={inputClass + ' pl-10'} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Mobile Number</label>
                    <div className="flex items-center bg-white/10 border border-white/20 rounded-xl overflow-hidden focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-400/30 transition-all">
                      <div className="px-4 py-3 border-r border-white/20 text-gray-300 text-sm font-medium">+91</div>
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/, '').slice(0, 10) }))}
                        className="flex-1 bg-transparent text-white placeholder-gray-400 px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={nextStep} className="w-full mt-7 h-12 text-base font-semibold">
                  Continue <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            )}

            {/* Step 1 — Password */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="font-display font-bold text-2xl text-white mb-1">Secure your account 🔐</h1>
                <p className="text-gray-400 text-sm mb-7">Create a strong password to protect your account</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        placeholder="Minimum 8 characters"
                        value={form.password}
                        onChange={set('password')}
                        className={inputClass + ' pl-10 pr-11'}
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Strength bar */}
                    {form.password.length > 0 && (
                      <div className="mt-2 flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                            form.password.length >= (i + 1) * 2 + 2
                              ? i < 1 ? 'bg-red-500' : i < 2 ? 'bg-yellow-500' : i < 3 ? 'bg-blue-500' : 'bg-green-500'
                              : 'bg-white/10'
                          }`} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Repeat your password"
                        value={form.confirm}
                        onChange={set('confirm')}
                        className={inputClass + ' pl-10 pr-11'}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {form.confirm.length > 0 && (
                      <p className={`text-xs mt-1.5 ${form.password === form.confirm ? 'text-green-400' : 'text-red-400'}`}>
                        {form.password === form.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </p>
                    )}
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer mt-2">
                    <div
                      onClick={() => setAgreed(!agreed)}
                      className={`w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                        agreed ? 'bg-primary-500 border-primary-500' : 'bg-white/10 border-white/30'
                      }`}
                    >
                      {agreed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-sm text-gray-400 leading-relaxed">
                      I agree to the{' '}
                      <Link href="/terms" className="text-primary-400 hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-primary-400 hover:underline">Privacy Policy</Link>
                    </span>
                  </label>
                </div>

                <div className="flex gap-3 mt-7">
                  <Button variant="outline" onClick={() => setStep(0)} className="flex-1 h-12 border-white/20 text-white hover:bg-white/10">
                    Back
                  </Button>
                  <Button onClick={nextStep} disabled={loading} className="flex-1 h-12 text-base font-semibold">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send OTP <ArrowRight className="w-4 h-4 ml-1" /></>}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2 — OTP */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="font-display font-bold text-2xl text-white mb-1">Verify number 📱</h1>
                <p className="text-gray-400 text-sm mb-7">
                  Enter the 6-digit OTP sent to <span className="text-white font-semibold">+91 {form.phone}</span>
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">One-Time Password</label>
                  <div className="flex gap-2">
                    {[...Array(6)].map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        value={form.otp[i] || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/, '');
                          const arr = form.otp.split('');
                          arr[i] = val;
                          setForm((f) => ({ ...f, otp: arr.join('').slice(0, 6) }));
                          if (val && e.target.nextElementSibling) {
                            (e.target.nextElementSibling as HTMLInputElement).focus();
                          }
                        }}
                        className="flex-1 aspect-square text-center bg-white/10 border border-white/20 rounded-xl text-white text-lg font-bold focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 transition-all"
                      />
                    ))}
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Demo: use any 6 digits (e.g. 123456)
                  </p>
                </div>

                <Button onClick={nextStep} disabled={loading} className="w-full mt-7 h-12 text-base font-semibold">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4 ml-1" /></>}
                </Button>

                <div className="flex gap-3 mt-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-10 border-white/20 text-white hover:bg-white/10 text-sm">
                    Back
                  </Button>
                  <button className="flex-1 text-sm text-primary-400 hover:text-primary-300 transition-colors">
                    Resend OTP
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
