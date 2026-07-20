import { Suspense } from 'react';
import { AdminIndoorView } from '@/views/admin-indoor';

export default function AdminIndoorPage() {
  return (
    <Suspense fallback={null}>
      <AdminIndoorView />
    </Suspense>
  );
}
