import { GlobalCta } from '@/widgets/global-cta';
import { Toaster } from 'sonner';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <GlobalCta />
      <Toaster position="top-center" richColors />
    </>
  );
}
