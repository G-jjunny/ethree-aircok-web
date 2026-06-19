import { Suspense } from 'react';
import { AdminNewsListView } from '@/views/admin-news';

export default function AdminNewsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-secondary-dark text-sm">불러오는 중...</div>}>
      <AdminNewsListView />
    </Suspense>
  );
}
