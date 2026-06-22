import { Suspense } from 'react';
import { AdminInquiryTabsView } from '@/views/admin-inquiry';

export default function AdminInquiriesPage() {
  return (
    <Suspense fallback={null}>
      <AdminInquiryTabsView />
    </Suspense>
  );
}
