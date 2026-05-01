import { InsuranceList } from '@/components/insurance/InsuranceList';
import { Car } from 'lucide-react';

export const metadata = { title: 'Car Insurance – Compare Plans' };

export default function CarInsurancePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-16 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 text-white mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Car className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-display font-black text-3xl sm:text-4xl">Car Insurance</h1>
              <p className="text-blue-200 text-sm mt-1">Compare plans from 30+ insurers. Best prices, instant issuance.</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-blue-200">
            <span>✓ Paperless Policy</span>
            <span>✓ Cashless Claims</span>
            <span>✓ 24/7 Support</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <InsuranceList category="car" categoryLabel="Car Insurance" />
      </div>
    </main>
  );
}
