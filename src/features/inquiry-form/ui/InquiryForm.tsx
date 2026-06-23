'use client'

import { useMemo } from 'react'
import {
  useForm,
  type Resolver,
  type UseFormRegisterReturn,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createInquiry, InquiryApiError } from '@/entities/inquiry'
import {
  inquiryFieldsQueryOptions,
  type InquiryField,
} from '@/entities/inquiry-field'
import { buildInquirySchema, type InquiryFormValues } from '../model/inquirySchema'

/** tel 입력 sanitize: 계약 허용 문자(숫자/공백/+ - ( ))만 남긴다 */
function sanitizePhone(value: string): string {
  return value.replace(/[^0-9+\-() ]/g, '').slice(0, 30)
}

/**
 * 동적 텍스트/이메일/전화 입력.
 * tel은 입력 즉시 허용 문자로 sanitize하되 RHF onChange를 그대로 체이닝한다.
 */
function TextInput({
  id,
  type,
  placeholder,
  register,
  invalid,
  errorId,
}: {
  id: string
  type: 'text' | 'email' | 'tel'
  placeholder?: string
  register: UseFormRegisterReturn
  invalid: boolean
  errorId?: string
}) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      {...register}
      onChange={(e) => {
        if (type === 'tel') e.target.value = sanitizePhone(e.target.value)
        register.onChange(e)
      }}
      aria-invalid={invalid}
      aria-describedby={errorId}
      className="w-full bg-surface-light rounded-md px-4 py-3 text-[17px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue border-none"
    />
  )
}

export function InquiryForm() {
  const { data: fields, isPending, isError } = useQuery(
    inquiryFieldsQueryOptions(),
  )

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-secondary-dark font-body text-[15px] leading-[1.43] [word-break:keep-all]">
          불러오는 중...
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-error font-body text-[15px] leading-[1.43] [word-break:keep-all]">
          문의 폼을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      </div>
    )
  }

  if (fields.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-body-dark font-body text-[15px] leading-[1.43] [word-break:keep-all]">
          현재 문의 폼을 사용할 수 없습니다.
        </p>
      </div>
    )
  }

  return <InquiryFormFields fields={fields} />
}

function InquiryFormFields({ fields }: { fields: InquiryField[] }) {
  const schema = useMemo(() => buildInquirySchema(fields), [fields])

  const defaultValues = useMemo<InquiryFormValues>(() => {
    const values: InquiryFormValues = {}
    for (const field of fields) values[field.key] = ''
    return values
  }, [fields])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    // 동적 z.object 추론 타입은 Record<string, unknown>이므로 폼 값 타입으로 맞춘다.
    resolver: zodResolver(schema) as unknown as Resolver<InquiryFormValues>,
    defaultValues,
  })

  const onSubmit = async (data: InquiryFormValues) => {
    try {
      await createInquiry({ answers: data })
      toast.success(
        '메시지를 보내주셔서 감사합니다. 24시간 이내에 답변드리겠습니다.',
      )
      reset(defaultValues)
    } catch (error) {
      if (error instanceof InquiryApiError && error.isRateLimited) {
        toast.error('요청이 많아 잠시 후 다시 시도해 주세요.')
      } else if (error instanceof InquiryApiError && error.isValidationError) {
        toast.error(error.messages?.[0] ?? '입력값을 다시 확인해 주세요.')
      } else {
        toast.error('문의 전송 중 오류가 발생했습니다. 다시 시도해 주세요.')
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="문의하기 폼"
      className="flex flex-col gap-6"
    >
      {fields.map((field) => {
        const fieldId = `inquiry-${field.key}`
        const errorId = `${fieldId}-error`
        const fieldError = errors[field.key]
        const placeholder = field.placeholder ?? undefined

        return (
          <div key={field.id} className="flex flex-col gap-1">
            {/* text-[15px]: 폼 라벨 전용 크기, Link/Caption(14px)보다 크고 Body(17px)보다 작은 1회성 수치 */}
            <label
              htmlFor={fieldId}
              className="text-[15px] font-medium text-heading-dark"
            >
              {field.label}{' '}
              {field.required && (
                <span className="text-error" aria-hidden="true">
                  *
                </span>
              )}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                id={fieldId}
                rows={6}
                placeholder={placeholder}
                {...register(field.key)}
                aria-invalid={!!fieldError}
                aria-describedby={fieldError ? errorId : undefined}
                className="w-full bg-surface-light rounded-md px-4 py-3 text-[17px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue border-none resize-y"
              />
            ) : (
              <TextInput
                id={fieldId}
                type={field.type}
                placeholder={placeholder}
                register={register(field.key)}
                invalid={!!fieldError}
                errorId={fieldError ? errorId : undefined}
              />
            )}

            {/* h-5(20px): 에러 텍스트 예약 공간 — spacing 토큰 없음(16px/24px 사이 1회성 레이아웃 수치) */}
            {/* text-[13px]: 폼 에러 전용 크기 — Micro(12px)보다 크고 Caption(14px)보다 작은 1회성 수치 */}
            <div className="h-5 mt-1">
              {fieldError && (
                <p
                  id={errorId}
                  role="alert"
                  className="text-[13px] text-error leading-none"
                >
                  {fieldError.message as string}
                </p>
              )}
            </div>
          </div>
        )
      })}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-aircok-blue text-heading-light text-[17px] font-medium rounded-md px-5 py-[10px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? '보내는 중...' : '보내기'}
      </button>
    </form>
  )
}
