import { Suspense, type ReactNode } from 'react';
import { Toaster } from 'sonner';
import { ConsoleLayout } from '@/widgets/console-layout';

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
