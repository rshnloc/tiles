import { InsuranceList } from '@/components/insurance/InsuranceList';
import { Heart } from 'lucide-react';

export const metadata = { title: 'Health Insurance – Compare Plans' };

export default function HealthInsurancePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-r from-green-600 to-emerald-800 py-16 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 text-white mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-display font-black text-3xl sm:text-4xl">Health Insurance</h1>
              <p className="text-green-200 text-sm mt-1">Comprehensive health coverage for you & your family.</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-green-200">
            <span>✓ Cashless Hospitalisation</span>
            <span>✓ Pre & Post Care</span>
            <span>✓ No Claim Bonus</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <InsuranceList category="health" categoryLabel="Health Insurance" />
      </div>
    </main>
  );
}
