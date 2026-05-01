import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingAdvisorButton } from '@/components/ui/FloatingAdvisorButton';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <Footer />
      <FloatingAdvisorButton />
    </>
  );
}
