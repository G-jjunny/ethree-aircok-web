import { GlobalCta } from '@/widgets/global-cta';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <GlobalCta />
    </>
  );
}
