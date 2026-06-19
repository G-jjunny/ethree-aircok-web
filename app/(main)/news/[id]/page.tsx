import { Suspense } from 'react';
import { NewsDetailView } from '@/views/news';

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-white" />}>
      <NewsDetailView params={params} />
    </Suspense>
  );
}
