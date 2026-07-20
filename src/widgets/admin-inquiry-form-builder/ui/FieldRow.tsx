'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/shared/ui'
import {
  updateInquiryField,
  deleteInquiryField,
  inquiryFieldKeys,
  type InquiryField,
} from '@/entities/inquiry-field'
import { InquiryFieldForm } from '@/features/inquiry-field-form'

const TYPE_LABELS: Record<InquiryField['type'], string> = {
  text: '한 줄 텍스트',
  textarea: '여러 줄 텍스트',
  email: '이메일',
  tel: '전화번호',
}

interface Props {
  field: InquiryField
  /** 위로 이동 대상(인접 상위 필드) — 없으면 맨 위 */
  prev?: InquiryField
  /** 아래로 이동 대상(인접 하위 필드) — 없으면 맨 아래 */
  next?: InquiryField
}

export function FieldRow({ field, prev, next }: Props) {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [reordering, setReordering] = useState(false)

  const swapOrder = async (target: InquiryField) => {
    setReordering(true)
    try {
      // 인접 두 필드의 order를 맞바꾼다(각각 PATCH).
      await updateInquiryField(field.id, { order: target.order })
      await updateInquiryField(target.id, { order: field.order })
      await queryClient.invalidateQueries({ queryKey: inquiryFieldKeys.all })
    } catch {
      toast.error('순서 변경 중 오류가 발생했습니다.')
    } finally {
      setReordering(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteInquiryField(field.id)
      toast.success('필드가 삭제되었습니다.')
      setConfirmOpen(false)
      await queryClient.invalidateQueries({ queryKey: inquiryFieldKeys.all })
    } catch {
      toast.error('삭제 중 오류가 발생했습니다.')
    } finally {
      setDeleting(false)
    }
  }

  if (editing) {
    return (
      <li className="px-4 py-4">
        <InquiryFieldForm
          field={field}
          onSuccess={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      </li>
    )
  }

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 hover:bg-surface transition-colors">
      {/* 순서 변경 */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => prev && swapOrder(prev)}
          disabled={!prev || reordering}
          aria-label="위로 이동"
          className="px-2 py-1 text-sm text-muted rounded-btn hover:bg-hairline transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => next && swapOrder(next)}
          disabled={!next || reordering}
          aria-label="아래로 이동"
          className="px-2 py-1 text-sm text-muted rounded-btn hover:bg-hairline transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ↓
        </button>
      </div>

      <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-ink-soft text-sm font-body font-medium">
          {field.label}
        </span>
        <code className="text-muted text-xs font-body rounded-btn bg-surface px-2 py-0.5">
          {field.key}
        </code>
        <span className="text-muted text-xs font-body">
          {TYPE_LABELS[field.type]}
        </span>
        {field.required && (
          <span className="text-error text-xs font-body">필수</span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-brand text-sm hover:opacity-70 transition-opacity"
        >
          수정
        </button>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="text-error text-sm hover:opacity-70 transition-opacity"
        >
          삭제
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        variant="destructive"
        title="필드 삭제"
        description="이 필드를 삭제하시겠습니까? 공개 문의 폼에서도 즉시 사라집니다."
        confirmLabel="삭제"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleting) setConfirmOpen(false)
        }}
      />
    </li>
  )
}
