'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  faqCategorySchema,
  useCreateFaqCategoryMutation,
  useUpdateFaqCategoryMutation,
} from '@/features/faq-category-editor'
import type { FaqCategoryFormValues } from '@/features/faq-category-editor'

interface CategoryFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues?: { id: string; name: string; order: number }
  onClose: () => void
}

export function CategoryFormModal({
  open,
  mode,
  initialValues,
  onClose,
}: CategoryFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FaqCategoryFormValues>({
    resolver: zodResolver(faqCategorySchema),
    defaultValues: { name: '', order: undefined },
  })

  const createMutation = useCreateFaqCategoryMutation()
  const updateMutation = useUpdateFaqCategoryMutation(initialValues?.id ?? '')

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialValues) {
        reset({ name: initialValues.name, order: initialValues.order })
      } else {
        reset({ name: '', order: undefined })
      }
    }
  }, [open, mode, initialValues, reset])

  const isLoading =
    createMutation.isPending || updateMutation.isPending

  const onSubmit = (values: FaqCategoryFormValues) => {
    if (mode === 'create') {
      createMutation.mutate(values, {
        onSuccess: () => {
          reset()
          onClose()
        },
      })
    } else {
      updateMutation.mutate(values, {
        onSuccess: () => {
          reset()
          onClose()
        },
      })
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-overlay-dark flex items-center justify-center px-5"
      onClick={() => { if (!isLoading) onClose() }}
    >
      <div
        className="bg-surface-white rounded-xl shadow-card w-full max-w-md p-8 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-subheading font-bold text-heading-dark leading-[1.19] [word-break:keep-all]">
          {mode === 'create' ? '카테고리 추가' : '카테고리 수정'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-heading-dark">
              카테고리명
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="카테고리명을 입력하세요"
              className={
                errors.name
                  ? 'w-full bg-surface-light border border-error rounded-md px-4 py-3 text-nav text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent transition-shadow min-h-[44px]'
                  : 'w-full bg-surface-light border border-border-light rounded-md px-4 py-3 text-nav text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue focus:border-transparent transition-shadow min-h-[44px]'
              }
            />
            {errors.name && (
              <p className="text-xs text-error leading-[1.33] mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-heading-dark">
              순서 (선택)
            </label>
            <input
              {...register('order', {
                setValueAs: (v) => (v === '' ? undefined : Number(v)),
              })}
              type="number"
              min={0}
              placeholder="숫자를 입력하세요"
              className={
                errors.order
                  ? 'w-full bg-surface-light border border-error rounded-md px-4 py-3 text-nav text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent transition-shadow min-h-[44px]'
                  : 'w-full bg-surface-light border border-border-light rounded-md px-4 py-3 text-nav text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue focus:border-transparent transition-shadow min-h-[44px]'
              }
            />
            {errors.order && (
              <p className="text-xs text-error leading-[1.33] mt-1">
                {errors.order.message}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => { if (!isLoading) onClose() }}
              disabled={isLoading}
              className="bg-surface-light text-heading-dark rounded-md px-5 py-2.5 min-h-[44px] text-nav font-medium hover:bg-border-subtle active:scale-[0.97] transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-aircok-blue text-heading-light rounded-md px-5 py-2.5 min-h-[44px] text-nav font-medium hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
