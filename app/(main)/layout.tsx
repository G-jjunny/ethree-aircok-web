import { Nav } from '@/widgets/nav';
import { Footer } from '@/widgets/footer';
import { GlobalCta } from '@/widgets/global-cta';
import { Toaster } from 'sonner';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <GlobalCta />
      <Footer />
      <Toaster position="top-center" richColors />
    </>
  );
}
