'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/shared/ui';
import { useDeleteNewsMutation } from '@/features/news-editor';

interface Props {
  id: string;
}

export function DeleteButton({ id }: Props) {
  const [open, setOpen] = useState(false);
  const deleteMutation = useDeleteNewsMutation();

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('뉴스가 삭제되었습니다');
      setOpen(false);
    } catch {
      toast.error('삭제 중 오류가 발생했습니다');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[13px] text-error hover:underline font-medium"
      >
        삭제
      </button>
      <ConfirmDialog
        open={open}
        variant="destructive"
        title="뉴스 삭제"
        description="이 뉴스를 삭제하시겠습니까? 삭제 후 되돌릴 수 없습니다."
        confirmLabel="삭제"
        loading={deleteMutation.isPending}
        onConfirm={handleConfirm}
        onCancel={() => {
          if (!deleteMutation.isPending) setOpen(false);
        }}
      />
    </>
  );
}
