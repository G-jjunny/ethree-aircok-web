import { Suspense } from 'react';
import { Nav } from '@/widgets/nav';
import { Footer } from '@/widgets/footer';
import { GlobalCta } from '@/widgets/global-cta';
import { Toaster } from 'sonner';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Suspense fallback={<div className="min-h-[280px] bg-brand" />}>
        <GlobalCta />
      </Suspense>
      <Suspense fallback={<div className="min-h-[280px] bg-navy-deep" />}>
        <Footer />
      </Suspense>
      <Toaster position="top-center" richColors />
    </>
  );
}
