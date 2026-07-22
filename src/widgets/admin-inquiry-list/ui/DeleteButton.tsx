'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/shared/ui';
import { deleteInquiry, adminInquiryKeys } from '@/entities/inquiry';

interface Props {
  id: string;
}

export function DeleteButton({ id }: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await deleteInquiry(id);
      toast.success('문의가 삭제되었습니다');
      setOpen(false);
      await queryClient.invalidateQueries({ queryKey: adminInquiryKeys.all });
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
        title="문의 삭제"
        description="이 문의를 삭제하시겠습니까? 삭제 후 되돌릴 수 없습니다."
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
