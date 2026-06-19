'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/shared/ui';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface Props {
  id: string;
}

export function DeleteButton({ id }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/news/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('삭제 실패');
      toast.success('뉴스가 삭제되었습니다');
      setOpen(false);
      router.refresh();
    } catch {
      toast.error('삭제 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-error text-sm hover:opacity-70 transition-opacity"
      >
        삭제
      </button>
      <ConfirmDialog
        open={open}
        variant="destructive"
        title="뉴스 삭제"
        description="이 뉴스를 삭제하시겠습니까? 삭제 후 되돌릴 수 없습니다."
        confirmLabel="삭제"
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => {
          if (!loading) setOpen(false);
        }}
      />
    </>
  );
}
