'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createInquiryField,
  updateInquiryField,
  inquiryFieldKeys,
  InquiryFieldApiError,
  type InquiryField,
} from '@/entities/inquiry-field'
import {
  inquiryFieldSchema,
  INQUIRY_FIELD_TYPES,
  type InquiryFieldFormValues,
} from '../model/inquiryFieldSchema'
import { SITE } from '@/shared/config/site'

const TYPE_LABELS: Record<(typeof INQUIRY_FIELD_TYPES)[number], string> = {
  text: '한 줄 텍스트',
  textarea: '여러 줄 텍스트',
  email: '이메일',
  tel: '전화번호',
}

interface Props {
  /** 지정 시 수정 모드, 미지정 시 추가 모드 */
  field?: InquiryField
  /** 저장 성공 후 호출(수정 모드에서 편집 닫기 등) */
  onSuccess?: () => void
  /** 수정 모드에서 취소 버튼 */
  onCancel?: () => void
}

export function InquiryFieldForm({ field, onSuccess, onCancel }: Props) {
  const queryClient = useQueryClient()
  const isEdit = !!field

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFieldFormValues>({
    resolver: zodResolver(inquiryFieldSchema),
    defaultValues: {
      key: field?.key ?? '',
      label: field?.label ?? '',
      type: field?.type ?? 'text',
      required: field?.required ?? false,
      placeholder: field?.placeholder ?? '',
    },
  })

  const onSubmit = async (values: InquiryFieldFormValues) => {
    try {
      if (isEdit) {
        await updateInquiryField(field.id, {
          label: values.label,
          type: values.type,
          required: values.required,
          placeholder: values.placeholder,
        })
      } else {
        await createInquiryField({
          key: values.key,
          label: values.label,
          type: values.type,
          required: values.required,
          placeholder: values.placeholder || undefined,
        })
      }
      await queryClient.invalidateQueries({ queryKey: inquiryFieldKeys.all })
      toast.success(isEdit ? '필드가 수정되었습니다.' : '필드가 추가되었습니다.')
      if (!isEdit) {
        reset({
          key: '',
          label: '',
          type: 'text',
          required: false,
          placeholder: '',
        })
      }
      onSuccess?.()
    } catch (error) {
      if (error instanceof InquiryFieldApiError && error.isConflict) {
        toast.error('이미 사용 중인 키입니다.')
      } else if (error instanceof InquiryFieldApiError) {
        toast.error(error.messages?.[0] ?? error.message)
      } else {
        toast.error('저장 중 오류가 발생했습니다. 다시 시도해 주세요.')
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-md border border-border-light bg-surface-light px-4 py-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 키 (생성 시에만 입력 가능) */}
        <div className="flex flex-col gap-1">
          <label className="text-body-dark text-sm font-body font-medium">
            키(key) <span className="text-error">*</span>
          </label>
          <input
            type="text"
            {...register('key')}
            disabled={isEdit}
            placeholder="company"
            className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-1 focus:ring-aircok-blue disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {isEdit ? (
            <p className="text-secondary-dark text-xs font-body">
              키는 생성 후 변경할 수 없습니다.
            </p>
          ) : (
            errors.key && (
              <p className="text-error text-xs">{errors.key.message}</p>
            )
          )}
        </div>

        {/* 라벨 */}
        <div className="flex flex-col gap-1">
          <label className="text-body-dark text-sm font-body font-medium">
            라벨(label) <span className="text-error">*</span>
          </label>
          <input
            type="text"
            {...register('label')}
            placeholder="회사/기관명"
            className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-1 focus:ring-aircok-blue"
          />
          {errors.label && (
            <p className="text-error text-xs">{errors.label.message}</p>
          )}
        </div>

        {/* 타입 */}
        <div className="flex flex-col gap-1">
          <label className="text-body-dark text-sm font-body font-medium">
            타입(type) <span className="text-error">*</span>
          </label>
          <select
            {...register('type')}
            className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body bg-surface-white focus:outline-none focus:ring-1 focus:ring-aircok-blue"
          >
            {INQUIRY_FIELD_TYPES.map((t) => (
              <option key={t} value={t}>
                {TYPE_LABELS[t]}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="text-error text-xs">{errors.type.message}</p>
          )}
        </div>

        {/* 플레이스홀더 */}
        <div className="flex flex-col gap-1">
          <label className="text-body-dark text-sm font-body font-medium">
            플레이스홀더(placeholder)
          </label>
          <input
            type="text"
            {...register('placeholder')}
            placeholder={SITE.legalName}
            className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-1 focus:ring-aircok-blue"
          />
          {errors.placeholder && (
            <p className="text-error text-xs">{errors.placeholder.message}</p>
          )}
        </div>
      </div>

      {/* 필수 여부 */}
      <label className="flex items-center gap-2 text-body-dark text-sm font-body">
        <input
          type="checkbox"
          {...register('required')}
          className="rounded border-border-light text-aircok-blue focus:ring-1 focus:ring-aircok-blue"
        />
        필수 입력 항목
      </label>

      {/* 버튼 */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-aircok-blue text-heading-light text-sm font-body rounded-md hover:bg-aircok-blue-dark transition-colors disabled:opacity-50"
        >
          {isSubmitting ? '저장 중...' : isEdit ? '수정 저장' : '필드 추가'}
        </button>
        {isEdit && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 bg-surface-white text-body-dark text-sm font-body rounded-md border border-border-light hover:bg-border-light transition-colors disabled:opacity-50"
          >
            취소
          </button>
        )}
      </div>
    </form>
  )
}
