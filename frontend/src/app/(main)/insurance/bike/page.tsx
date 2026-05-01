import { InsuranceList } from '@/components/insurance/InsuranceList';
import { Bike } from 'lucide-react';

export const metadata = { title: 'Bike Insurance – Compare Plans' };

export default function BikeInsurancePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 py-16 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 text-white mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Bike className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-display font-black text-3xl sm:text-4xl">Bike Insurance</h1>
              <p className="text-orange-200 text-sm mt-1">Protect your two-wheeler. Starting ₹714/year.</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-orange-200">
            <span>✓ Third-party & Comprehensive</span>
            <span>✓ Zero Depreciation</span>
            <span>✓ Instant Policy</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <InsuranceList category="bike" categoryLabel="Bike Insurance" />
      </div>
    </main>
  );
}
