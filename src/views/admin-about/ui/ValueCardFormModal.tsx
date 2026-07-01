'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  useCreateCoreValueMutation,
  useUpdateCoreValueMutation,
} from '@/features/core-value-editor'
import type { CoreValue } from '@/entities/core-value'

/**
 * 핵심가치 추가/수정 폼 스키마.
 * order는 폼에서 다루지 않는다(추가 시 목록 끝에 자동 배치, 서버 계약상 optional).
 */
const valueCardSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요'),
  description: z.string().min(1, '설명을 입력하세요'),
})

type ValueCardFormValues = z.infer<typeof valueCardSchema>

interface ValueCardFormModalProps {
  open: boolean
  onClose: () => void
  item?: CoreValue
}

export function ValueCardFormModal({ open, onClose, item }: ValueCardFormModalProps) {
  const createMutation = useCreateCoreValueMutation()
  const updateMutation = useUpdateCoreValueMutation()
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ValueCardFormValues>({
    resolver: zodResolver(valueCardSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        title: item?.title ?? '',
        description: item?.description ?? '',
      })
    }
  }, [open, item, reset])

  const onSubmit = (values: ValueCardFormValues) => {
    if (item) {
      updateMutation.mutate(
        { id: item.id, body: values },
        { onSuccess: onClose },
      )
    } else {
      createMutation.mutate(values, { onSuccess: onClose })
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-dark px-5"
      onClick={() => { if (!isPending) onClose() }}
    >
      <div
        className="bg-surface-white rounded-xl shadow-card w-full max-w-md p-8 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-subheading font-display font-bold text-heading-dark leading-[1.19] [word-break:keep-all]">
          {item ? '핵심가치 수정' : '핵심가치 추가'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="value-card-title" className="text-sm font-medium text-heading-dark">
              제목 <span className="text-error">*</span>
            </label>
            <input
              id="value-card-title"
              type="text"
              {...register('title')}
              className={
                errors.title
                  ? 'w-full bg-surface-light border border-error rounded-md px-4 py-3 text-nav text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent transition-shadow min-h-[44px]'
                  : 'w-full bg-surface-light border border-border-light rounded-md px-4 py-3 text-nav text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue focus:border-transparent transition-shadow min-h-[44px]'
              }
              placeholder="핵심가치 제목을 입력하세요"
            />
            {errors.title && (
              <p className="text-xs text-error leading-[1.33] mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="value-card-description" className="text-sm font-medium text-heading-dark">
              설명 <span className="text-error">*</span>
            </label>
            <textarea
              id="value-card-description"
              rows={4}
              {...register('description')}
              className={
                errors.description
                  ? 'w-full bg-surface-light border border-error rounded-md px-4 py-3 text-nav text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent transition-shadow resize-none'
                  : 'w-full bg-surface-light border border-border-light rounded-md px-4 py-3 text-nav text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue focus:border-transparent transition-shadow resize-none'
              }
              placeholder="핵심가치 설명을 입력하세요"
            />
            {errors.description && (
              <p className="text-xs text-error leading-[1.33] mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end mt-2">
            <button
              type="button"
              onClick={() => { if (!isPending) onClose() }}
              disabled={isPending}
              className="bg-surface-light text-heading-dark rounded-md px-5 py-2.5 min-h-[44px] text-nav font-medium hover:bg-border-subtle active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-aircok-blue text-heading-light rounded-md px-5 py-2.5 min-h-[44px] text-nav font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors"
            >
              {isPending ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
