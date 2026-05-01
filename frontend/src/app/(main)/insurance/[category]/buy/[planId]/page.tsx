'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle2, Upload, CreditCard, FileText, ChevronRight,
  ChevronLeft, Shield, AlertCircle, Lock, User, Car,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const STEPS = [
  { id: 1, label: 'Vehicle Details', icon: Car },
  { id: 2, label: 'Owner Details', icon: User },
  { id: 3, label: 'KYC Upload', icon: Upload },
  { id: 4, label: 'Payment', icon: CreditCard },
  { id: 5, label: 'Policy', icon: FileText },
];

interface StepData {
  // Step 1
  registrationNumber?: string;
  engineNumber?: string;
  chassisNumber?: string;
  previousPolicyNumber?: string;
  ncbPercent?: string;
  // Step 2
  name?: string;
  dob?: string;
  email?: string;
  phone?: string;
  address?: string;
  nominee?: string;
  nomineeRelation?: string;
  // Step 3
  panNumber?: string;
  aadhaarNumber?: string;
  panFile?: File;
  aadhaarFile?: File;
  // Step 4
  paymentMethod?: string;
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.slice(0, total).map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                i + 1 < current
                  ? 'bg-green-500 border-green-500 text-white'
                  : i + 1 === current
                  ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
              }`}
              animate={{ scale: i + 1 === current ? 1.1 : 1 }}
            >
              {i + 1 < current ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <step.icon className="w-4 h-4" />
              )}
            </motion.div>
            <span className={`text-xs mt-1.5 font-medium hidden sm:block ${
              i + 1 === current ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
          {i < total - 1 && (
            <div className={`w-12 sm:w-20 h-0.5 mx-1 sm:mx-2 mb-5 transition-colors duration-500 ${
              i + 1 < current ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function BuyInsurancePage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<StepData>({});
  const [uploading, setUploading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [policyGenerated, setPolicyGenerated] = useState(false);
  const { category, planId } = useParams() as { category: string; planId: string };
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<StepData>();

  const next = (stepData?: Partial<StepData>) => {
    if (stepData) setData((d) => ({ ...d, ...stepData }));
    if (step < 5) setStep((s) => s + 1);
  };

  const prev = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handlePayment = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setStep(5);
      setPolicyGenerated(true);
    }, 3000);
  };

  const onSubmitStep = (values: StepData) => {
    next(values);
  };

  // Mock plan details
  const plan = {
    name: 'HDFC Ergo Smart Protect',
    premium: 8499,
    gst: 1530,
    total: 10029,
    addOns: [
      { name: 'Zero Depreciation', price: 1200 },
      { name: 'Engine Protection', price: 800 },
    ],
    validity: '1 Year',
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {plan.name} · ₹{plan.total.toLocaleString('en-IN')}/year
          </p>
        </div>

        <StepIndicator current={step} total={5} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1 — Vehicle Details */}
            {step === 1 && (
              <form onSubmit={handleSubmit(onSubmitStep)}>
                <Card padding="lg">
                  <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Car className="w-5 h-5 text-primary-600" /> Vehicle Details
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="label">Registration Number *</label>
                      <input {...register('registrationNumber', { required: 'Required' })} className="input" placeholder="MH02AB1234" />
                      {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber.message}</p>}
                    </div>
                    <div>
                      <label className="label">Engine Number *</label>
                      <input {...register('engineNumber', { required: 'Required' })} className="input" placeholder="Engine number" />
                    </div>
                    <div>
                      <label className="label">Chassis Number *</label>
                      <input {...register('chassisNumber', { required: 'Required' })} className="input" placeholder="Chassis number" />
                    </div>
                    <div>
                      <label className="label">Previous Policy Number</label>
                      <input {...register('previousPolicyNumber')} className="input" placeholder="Optional" />
                    </div>
                    <div>
                      <label className="label">NCB Percentage</label>
                      <select {...register('ncbPercent')} className="input">
                        <option value="0">0% (New/No NCB)</option>
                        <option value="20">20%</option>
                        <option value="25">25%</option>
                        <option value="35">35%</option>
                        <option value="45">45%</option>
                        <option value="50">50%</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button type="submit" variant="gradient" size="lg" icon={<ChevronRight className="w-5 h-5" />} iconPosition="right">
                      Continue
                    </Button>
                  </div>
                </Card>
              </form>
            )}

            {/* Step 2 — Owner Details */}
            {step === 2 && (
              <form onSubmit={handleSubmit(onSubmitStep)}>
                <Card padding="lg">
                  <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary-600" /> Owner Details
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full Name *</label>
                      <input {...register('name', { required: 'Required' })} className="input" placeholder="As per RC" />
                    </div>
                    <div>
                      <label className="label">Date of Birth *</label>
                      <input {...register('dob', { required: 'Required' })} type="date" className="input" />
                    </div>
                    <div>
                      <label className="label">Email Address *</label>
                      <input {...register('email', { required: 'Required' })} type="email" className="input" placeholder="email@example.com" />
                    </div>
                    <div>
                      <label className="label">Phone Number *</label>
                      <input {...register('phone', { required: 'Required' })} className="input" placeholder="+91 9999999999" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label">Address *</label>
                      <textarea {...register('address', { required: 'Required' })} className="input min-h-[80px] resize-none" placeholder="Full address" />
                    </div>
                    <div>
                      <label className="label">Nominee Name</label>
                      <input {...register('nominee')} className="input" placeholder="Optional" />
                    </div>
                    <div>
                      <label className="label">Nominee Relation</label>
                      <select {...register('nomineeRelation')} className="input">
                        <option value="">Select</option>
                        <option>Spouse</option>
                        <option>Father</option>
                        <option>Mother</option>
                        <option>Son</option>
                        <option>Daughter</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" size="lg" icon={<ChevronLeft className="w-5 h-5" />} onClick={prev}>Back</Button>
                    <Button type="submit" variant="gradient" size="lg" icon={<ChevronRight className="w-5 h-5" />} iconPosition="right">Continue</Button>
                  </div>
                </Card>
              </form>
            )}

            {/* Step 3 — KYC */}
            {step === 3 && (
              <Card padding="lg">
                <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary-600" /> KYC Documents
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Upload your PAN and Aadhaar to complete KYC. Documents are encrypted and secure.
                </p>
                <div className="space-y-6">
                  {/* PAN */}
                  <div>
                    <label className="label">PAN Number *</label>
                    <input className="input" placeholder="ABCDE1234F" maxLength={10} />
                    <label className="label mt-3">PAN Card Upload *</label>
                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload or drag & drop</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF up to 5MB</p>
                    </div>
                  </div>

                  {/* Aadhaar */}
                  <div>
                    <label className="label">Aadhaar Number *</label>
                    <input className="input" placeholder="XXXX XXXX XXXX" maxLength={14} />
                    <label className="label mt-3">Aadhaar Card Upload *</label>
                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload or drag & drop</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF up to 5MB</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <Lock className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Your documents are encrypted with 256-bit SSL and stored securely. We comply with IRDAI data protection guidelines.
                    </p>
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <Button variant="outline" size="lg" icon={<ChevronLeft className="w-5 h-5" />} onClick={prev}>Back</Button>
                  <Button variant="gradient" size="lg" icon={<ChevronRight className="w-5 h-5" />} iconPosition="right" onClick={() => next()}>
                    Continue to Payment
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 4 — Payment */}
            {step === 4 && (
              <div className="grid sm:grid-cols-5 gap-5">
                <div className="sm:col-span-3">
                  <Card padding="lg">
                    <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary-600" /> Payment
                    </h2>
                    <div className="space-y-3">
                      {['UPI', 'Credit/Debit Card', 'Net Banking', 'EMI'].map((method) => (
                        <label key={method} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary-400 transition-colors">
                          <input type="radio" name="payment" className="accent-primary-600" />
                          <span className="font-medium text-gray-900 dark:text-white text-sm">{method}</span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600 shrink-0" />
                      <p className="text-xs text-green-700 dark:text-green-300">Payments are 100% secure and encrypted</p>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" size="lg" icon={<ChevronLeft className="w-5 h-5" />} onClick={prev}>Back</Button>
                      <Button
                        variant="gradient"
                        size="lg"
                        loading={paymentProcessing}
                        onClick={handlePayment}
                        icon={<Lock className="w-4 h-4" />}
                      >
                        Pay ₹{plan.total.toLocaleString('en-IN')}
                      </Button>
                    </div>
                  </Card>
                </div>

                {/* Order Summary */}
                <div className="sm:col-span-2">
                  <Card padding="md">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Base Premium</span>
                        <span className="font-medium">₹{plan.premium.toLocaleString('en-IN')}</span>
                      </div>
                      {plan.addOns.map((ao) => (
                        <div key={ao.name} className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">{ao.name}</span>
                          <span className="font-medium">₹{ao.price.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">GST (18%)</span>
                        <span className="font-medium">₹{plan.gst.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-gray-800">
                        <span>Total</span>
                        <span className="text-primary-600 dark:text-primary-400">₹{plan.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 5 — Policy Generated */}
            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
              >
                <Card padding="lg" className="text-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="font-display font-black text-3xl text-gray-900 dark:text-white mb-2">
                    Policy Issued! 🎉
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    Your policy document has been sent to your email.
                  </p>
                  <p className="font-bold text-primary-600 dark:text-primary-400 text-lg mb-8">
                    Policy No: TIL-CAR-2024-{Math.floor(Math.random() * 900000 + 100000)}
                  </p>

                  <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
                    {[
                      { label: 'Plan', value: plan.name },
                      { label: 'Validity', value: plan.validity },
                      { label: 'Premium Paid', value: `₹${plan.total.toLocaleString('en-IN')}` },
                    ].map((item) => (
                      <div key={item.label} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="gradient" size="lg" icon={<FileText className="w-5 h-5" />}>
                      Download Policy PDF
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => router.push('/dashboard')}>
                      Go to Dashboard
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
