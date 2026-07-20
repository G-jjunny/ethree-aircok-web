import { Suspense } from 'react';
import { AdminDiagnosisView } from '@/views/admin-diagnosis';

export default function AdminDiagnosisPage() {
  return (
    <Suspense fallback={null}>
      <AdminDiagnosisView />
    </Suspense>
  );
}
