'use client';

import { useRouter } from 'next/navigation';
import { AdminNewsForm } from '@/widgets/admin-news-form';
import type { NewsPost } from '@/entities/news';

interface Props {
  initialData?: NewsPost;
}

export function AdminNewsFormWrapper({ initialData }: Props) {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/console/news');
  };

  return (
    <AdminNewsForm
      key={initialData?.id ?? 'new'}
      initialData={
        initialData
          ? {
              id: initialData.id,
              title: initialData.title,
              description: initialData.description,
              content: initialData.content,
              date: initialData.date,
              location: initialData.location,
              published: initialData.published,
              coverImage: initialData.coverImage,
            }
          : undefined
      }
      onSuccess={handleSuccess}
    />
  );
}
