import { Suspense, type ReactNode } from 'react';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { ConsoleLayout } from '@/widgets/console-layout';

// 방어적 조치: robots.ts disallow에 더해 콘솔 하위 라우트가 색인되지 않도록 한다.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <ConsoleLayout>{children}</ConsoleLayout>
      </Suspense>
      <Toaster position="top-center" richColors />
    </>
  );
}
