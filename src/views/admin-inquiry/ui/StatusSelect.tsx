'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  updateInquiryStatus,
  adminInquiryKeys,
  type InquiryStatus,
} from '@/entities/inquiry';

const STATUS_OPTIONS: { value: InquiryStatus; label: string }[] = [
  { value: 'NEW', label: '신규' },
  { value: 'IN_PROGRESS', label: '진행중' },
  { value: 'DONE', label: '완료' },
];

interface Props {
  id: string;
  status: InquiryStatus;
}

export function StatusSelect({ id, status }: Props) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState<InquiryStatus>(status);
  const [updating, setUpdating] = useState(false);

  const handleChange = async (next: InquiryStatus) => {
    const prev = value;
    setValue(next);
    setUpdating(true);
    try {
      await updateInquiryStatus(id, next);
      toast.success('상태가 변경되었습니다');
      await queryClient.invalidateQueries({ queryKey: adminInquiryKeys.all });
    } catch {
      setValue(prev);
      toast.error('상태 변경 중 오류가 발생했습니다');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <select
      value={value}
      disabled={updating}
      onChange={(e) => handleChange(e.target.value as InquiryStatus)}
      aria-label="문의 상태 변경"
      className="bg-surface-light text-body-dark text-sm font-body rounded-md px-2 py-1 border border-border-light focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
