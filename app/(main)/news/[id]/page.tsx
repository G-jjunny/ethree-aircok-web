import { Suspense } from 'react';
import { NewsDetailView } from '@/views/news';

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-white" />}>
      <NewsDetailView id={id} />
    </Suspense>
  );
}
