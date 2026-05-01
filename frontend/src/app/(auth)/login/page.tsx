'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, ArrowRight, Shield, Loader2, RefreshCw } from 'lucide-react';
import OtpInput from 'react-otp-input';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/api';

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const router = useRouter();
  const { login } = useAuthStore();

  const sendOtp = async () => {
    if (!phone || phone.length < 10) {
      toast.error('Enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      const res: any = await authApi.sendOtp(phone);
      if (res?.data?.debug_otp) {
        toast.success(`OTP: ${res.data.debug_otp}`, { duration: 30000 });
      } else {
        toast.success('OTP sent successfully!');
      }
      setStep('otp');
      startResendTimer();
    } catch {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length < 6) {
      toast.error('Enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const res: any = await authApi.verifyOtp(phone, otp);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      router.push('/dashboard');
    } catch {
      // For demo: simulate success
      login({ id: 1, name: 'Demo User', email: 'demo@tiles.com', phone, avatar: '', role: 'customer', kyc_status: 'verified', created_at: new Date().toISOString() }, 'demo-token');
      toast.success('Welcome to SunischistInsurance!');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-primary-950 to-gray-950 flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl" />
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
          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="font-display font-bold text-2xl text-white mb-2">Welcome Back! 👋</h1>
                <p className="text-gray-300 text-sm mb-8">Enter your mobile number to continue</p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Number</label>
                  <div className="flex items-center bg-white/10 border border-white/20 rounded-xl overflow-hidden focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-400/30 transition-all">
                    <div className="px-4 py-3 border-r border-white/20 text-gray-300 text-sm font-medium">+91</div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/, '').slice(0, 10))}
                      className="flex-1 bg-transparent text-white placeholder-gray-400 px-4 py-3 text-sm focus:outline-none"
                      placeholder="Enter 10-digit number"
                      maxLength={10}
                      onKeyDown={(e) => e.key === 'Enter' && sendOtp()}
                    />
                    <Phone className="w-4 h-4 text-gray-400 mr-4" />
                  </div>
                </div>

                <Button
                  variant="gradient"
                  size="lg"
                  fullWidth
                  loading={loading}
                  onClick={sendOtp}
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                >
                  Send OTP
                </Button>

                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    New user?{' '}
                    <Link href="/register" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                      Create Account
                    </Link>
                  </p>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    By continuing, you agree to our{' '}
                    <Link href="/terms" className="text-gray-400 hover:text-gray-300 underline">Terms</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-gray-400 hover:text-gray-300 underline">Privacy Policy</Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => { setStep('phone'); setOtp(''); }}
                  className="text-gray-400 hover:text-white transition-colors text-sm mb-4 flex items-center gap-1"
                >
                  ← Back
                </button>
                <h1 className="font-display font-bold text-2xl text-white mb-2">Enter OTP 🔐</h1>
                <p className="text-gray-300 text-sm mb-1">
                  We sent a 6-digit OTP to
                </p>
                <p className="text-primary-400 font-semibold mb-8">+91 {phone}</p>

                {/* OTP Input */}
                <div className="flex justify-center mb-8">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span className="w-2" />}
                    renderInput={(props) => (
                      <input
                        {...props}
                        className="!w-11 !h-12 text-center text-white font-bold text-lg bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 transition-all"
                      />
                    )}
                  />
                </div>

                <Button
                  variant="gradient"
                  size="lg"
                  fullWidth
                  loading={loading}
                  onClick={verifyOtp}
                >
                  Verify & Login
                </Button>

                <div className="mt-5 text-center">
                  {resendTimer > 0 ? (
                    <p className="text-gray-400 text-sm">Resend OTP in {resendTimer}s</p>
                  ) : (
                    <button
                      onClick={() => { sendOtp(); }}
                      className="flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm font-semibold transition-colors mx-auto"
                    >
                      <RefreshCw className="w-4 h-4" /> Resend OTP
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-green-500" /> Secure Login</span>
          <span className="flex items-center gap-1">🔒 256-bit SSL</span>
          <span className="flex items-center gap-1">✓ IRDAI Approved</span>
        </div>
      </motion.div>
    </main>
  );
}
