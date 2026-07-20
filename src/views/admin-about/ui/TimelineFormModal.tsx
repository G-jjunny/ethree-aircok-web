'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  timelineSchema,
  useCreateTimelineMutation,
  useUpdateTimelineMutation,
} from '@/features/timeline-editor'
import type { TimelineFormInput, TimelineFormValues } from '@/features/timeline-editor'
import type { TimelineItem } from '@/entities/timeline'

interface TimelineFormModalProps {
  open: boolean
  onClose: () => void
  item?: TimelineItem
  /** 추가 모드에서 현재 선택된 연도를 폼 기본값으로 사용(수정 모드에서는 무시) */
  defaultYear?: number
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

export function TimelineFormModal({ open, onClose, item, defaultYear }: TimelineFormModalProps) {
  const createMutation = useCreateTimelineMutation()
  const updateMutation = useUpdateTimelineMutation()
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimelineFormInput, unknown, TimelineFormValues>({
    resolver: zodResolver(timelineSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      month: 1,
      content: '',
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        year: item?.year ?? defaultYear ?? new Date().getFullYear(),
        month: item?.month ?? 1,
        content: item?.content ?? '',
      })
    }
  }, [open, item, defaultYear, reset])

  const onSubmit = (values: TimelineFormValues) => {
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
        className="bg-surface-white rounded-card shadow-card w-full max-w-md p-8 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-display font-bold text-ink leading-[1.19] [word-break:keep-all]">
          {item ? '연혁 수정' : '연혁 추가'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="timeline-year" className="text-sm font-medium text-ink">
                연도 <span className="text-error">*</span>
              </label>
              <input
                id="timeline-year"
                type="number"
                min={2000}
                max={2100}
                {...register('year', { valueAsNumber: true })}
                className={
                  errors.year
                    ? 'w-full bg-surface border border-error rounded-btn px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent transition-shadow min-h-11'
                    : 'w-full bg-surface border border-hairline rounded-btn px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow min-h-11'
                }
                placeholder="2026"
              />
              {errors.year && (
                <p className="text-xs text-error leading-[1.33] mt-1">{errors.year.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="timeline-month" className="text-sm font-medium text-ink">
                월 <span className="text-error">*</span>
              </label>
              <select
                id="timeline-month"
                {...register('month', { valueAsNumber: true })}
                className={
                  errors.month
                    ? 'w-full bg-surface border border-error rounded-btn px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent transition-shadow min-h-11 cursor-pointer'
                    : 'w-full bg-surface border border-hairline rounded-btn px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow min-h-11 cursor-pointer'
                }
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}월
                  </option>
                ))}
              </select>
              {errors.month && (
                <p className="text-xs text-error leading-[1.33] mt-1">{errors.month.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="timeline-content" className="text-sm font-medium text-ink">
              내용 <span className="text-error">*</span>
            </label>
            <textarea
              id="timeline-content"
              rows={4}
              {...register('content')}
              className={
                errors.content
                  ? 'w-full bg-surface border border-error rounded-btn px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent transition-shadow resize-none'
                  : 'w-full bg-surface border border-hairline rounded-btn px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow resize-none'
              }
              placeholder="연혁 내용을 입력하세요"
            />
            {errors.content && (
              <p className="text-xs text-error leading-[1.33] mt-1">{errors.content.message}</p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end mt-2">
            <button
              type="button"
              onClick={() => { if (!isPending) onClose() }}
              disabled={isPending}
              className="bg-surface text-ink rounded-btn px-5 py-2.5 min-h-11 text-sm font-medium hover:bg-hairline active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-brand text-white rounded-btn px-5 py-2.5 min-h-11 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-brand-hover active:scale-[0.97] transition-colors"
            >
              {isPending ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
