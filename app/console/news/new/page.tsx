import { Suspense } from 'react';
import { AdminNewsFormView } from '@/views/admin-news';

export default function AdminNewsNewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-secondary-dark text-sm">불러오는 중...</div>}>
      <AdminNewsFormView />
    </Suspense>
  );
}
