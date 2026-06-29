import { Suspense } from 'react';
import { AdminNewsFormView } from '@/views/admin-news';

export default function AdminNewsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-secondary-dark text-sm">불러오는 중...</div>}>
      <AdminNewsFormViewLoader params={params} />
    </Suspense>
  );
}

async function AdminNewsFormViewLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminNewsFormView id={id} />;
}
