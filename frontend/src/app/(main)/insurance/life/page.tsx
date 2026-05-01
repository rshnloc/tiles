import { InsuranceList } from '@/components/insurance/InsuranceList';
import { Shield } from 'lucide-react';

export const metadata = { title: 'Life Insurance – Compare Plans' };

export default function LifeInsurancePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 py-16 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 text-white mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-display font-black text-3xl sm:text-4xl">Life Insurance</h1>
              <p className="text-purple-200 text-sm mt-1">Secure your family's future. Term, ULIP & endowment plans.</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-purple-200">
            <span>✓ Up to ₹2Cr Cover</span>
            <span>✓ Tax Benefits u/s 80C</span>
            <span>✓ Claim Support</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <InsuranceList category="life" categoryLabel="Life Insurance" />
      </div>
    </main>
  );
}
