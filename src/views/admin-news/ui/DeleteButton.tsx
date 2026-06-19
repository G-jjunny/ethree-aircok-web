'use client';

import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface Props {
  id: string;
}

export function DeleteButton({ id }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('삭제하시겠습니까?')) return;
    await fetch(`${API_BASE}/api/news/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-error text-sm hover:opacity-70 transition-opacity"
    >
      삭제
    </button>
  );
}
