'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useCreatePartnerMutation, useUpdatePartnerMutation } from '@/features/partner-editor'
import type { Partner } from '@/entities/partner'
import { extractUploadError } from '@/shared/api'

const schema = z.object({
  name: z.string().min(1, '이름을 입력하세요'),
  type: z.enum(['partner', 'client']),
  // order는 input[type=number] 값을 string으로 관리하여 react-hook-form 타입 호환성 유지
  orderStr: z.string(),
})
type FormValues = z.infer<typeof schema>

interface PartnerFormModalProps {
  open: boolean
  onClose: () => void
  partner?: Partner
}

export function PartnerFormModal({ open, onClose, partner }: PartnerFormModalProps) {
  const createMutation = useCreatePartnerMutation()
  const updateMutation = useUpdatePartnerMutation()
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      type: 'partner',
      orderStr: '',
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: partner?.name ?? '',
        type: partner?.type ?? 'partner',
        orderStr: partner?.order !== undefined ? String(partner.order) : '',
      })
    }
  }, [open, partner, reset])

  const onSubmit = (values: FormValues) => {
    const order =
      values.orderStr !== '' && values.orderStr !== undefined
        ? parseInt(values.orderStr, 10)
        : undefined

    if (partner) {
      updateMutation.mutate(
        { id: partner.id, body: { name: values.name, type: values.type, order } },
        {
          onSuccess: onClose,
          onError: (error) => {
            toast.error(extractUploadError(error, '파트너 수정에 실패했습니다'))
          },
        },
      )
    } else {
      createMutation.mutate(
        { name: values.name, type: values.type, order },
        {
          onSuccess: onClose,
          onError: (error) => {
            toast.error(extractUploadError(error, '파트너 추가에 실패했습니다'))
          },
        },
      )
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-dark px-5"
      onClick={onClose}
    >
      {/* max-w-[440px]: 파트너 폼 모달 전용 너비, design.md에 없는 1회성 수치 */}
      <div
        className="bg-surface-white rounded-card shadow-card w-full max-w-[440px] p-8 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-display font-bold text-ink leading-[1.19] [word-break:keep-all]">
          {partner ? '파트너 수정' : '파트너 추가'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="partner-name" className="text-sm font-medium text-ink">
              이름 <span className="text-error">*</span>
            </label>
            <input
              id="partner-name"
              type="text"
              {...register('name')}
              className={
                errors.name
                  ? 'w-full bg-surface border border-error rounded-btn px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent transition-shadow min-h-11'
                  : 'w-full bg-surface border border-hairline rounded-btn px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow min-h-11'
              }
              placeholder="파트너사/고객사 이름"
            />
            {errors.name && (
              <p className="text-xs text-error leading-[1.33] mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="partner-type" className="text-sm font-medium text-ink">
              유형
            </label>
            <select
              id="partner-type"
              {...register('type')}
              className="w-full bg-surface border border-hairline rounded-btn px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow min-h-11"
            >
              <option value="partner">파트너사</option>
              <option value="client">고객사</option>
            </select>
            {errors.type && (
              <p className="text-xs text-error leading-[1.33] mt-1">{errors.type.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="partner-order" className="text-sm font-medium text-ink">
              순서
            </label>
            <input
              id="partner-order"
              type="number"
              min={0}
              {...register('orderStr')}
              className={
                errors.orderStr
                  ? 'w-full bg-surface border border-error rounded-btn px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent transition-shadow min-h-11'
                  : 'w-full bg-surface border border-hairline rounded-btn px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow min-h-11'
              }
              placeholder="0"
            />
            {errors.orderStr && (
              <p className="text-xs text-error leading-[1.33] mt-1">{errors.orderStr.message}</p>
            )}
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
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
