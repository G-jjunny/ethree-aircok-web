'use client'

import { useMemo, useState } from 'react'
import {
  useForm,
  type Resolver,
  type UseFormRegisterReturn,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/shared/ui'
import { createInquiry, InquiryApiError } from '@/entities/inquiry'
import {
  inquiryFieldsQueryOptions,
  type InquiryField,
} from '@/entities/inquiry-field'
import { buildInquirySchema, type InquiryFormValues } from '../model/inquirySchema'

/** 시안 .sa-field 스타일 — hairline 보더 + rounded-btn + brand focus ring */
const FIELD_CLASS =
  // text-input(16 고정): text-base 는 fluid(모바일 15px)라 iOS 포커스 자동 줌 트리거 — 인풋은 16px 고정 유지
  'w-full bg-surface-white rounded-btn border border-hairline px-4 py-3 text-input text-ink placeholder:text-faint ' +
  'focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/28 transition-colors'

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
      className={FIELD_CLASS}
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
        <p className="text-muted font-body text-sm [word-break:keep-all]">
          불러오는 중...
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-error font-body text-sm [word-break:keep-all]">
          문의 폼을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      </div>
    )
  }

  if (fields.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-ink-soft font-body text-sm [word-break:keep-all]">
          현재 문의 폼을 사용할 수 없습니다.
        </p>
      </div>
    )
  }

  return <InquiryFormFields fields={fields} />
}

/** 제출 성공 상태 카드 — 연블루 tint + 체크 배지 + 새 문의 작성 버튼 */
function InquirySuccess({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-card border border-tint-border bg-tint px-6 py-14 text-center">
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-ink"
        aria-hidden="true"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 6 9 17l-5-5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-xl font-extrabold tracking-headline text-ink">
          문의가 접수되었습니다
        </h3>
        <p className="text-sm leading-relaxed text-muted [word-break:keep-all]">
          소중한 문의 감사합니다. 영업일 기준 24시간 이내에 답변드리겠습니다.
        </p>
      </div>
      <Button type="button" variant="dark" size="md" onClick={onReset}>
        새 문의 작성
      </Button>
    </div>
  )
}

function InquiryFormFields({ fields }: { fields: InquiryField[] }) {
  const schema = useMemo(() => buildInquirySchema(fields), [fields])
  const [isSuccess, setIsSuccess] = useState(false)

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
      reset(defaultValues)
      setIsSuccess(true)
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

  const handleResetSuccess = () => {
    reset(defaultValues)
    setIsSuccess(false)
  }

  if (isSuccess) {
    return <InquirySuccess onReset={handleResetSuccess} />
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="문의하기 폼"
      className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2"
    >
      {fields.map((field) => {
        const fieldId = `inquiry-${field.key}`
        const errorId = `${fieldId}-error`
        const fieldError = errors[field.key]
        const placeholder = field.placeholder ?? undefined
        const isTextarea = field.type === 'textarea'

        return (
          <div
            key={field.id}
            className={`flex flex-col gap-1.5 ${isTextarea ? 'sm:col-span-2' : ''}`}
          >
            <label
              htmlFor={fieldId}
              className="text-sm font-medium text-ink"
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
                className={`${FIELD_CLASS} resize-y`}
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

            {/* 에러 텍스트 예약 공간 — 레이아웃 시프트 방지 */}
            <div className="min-h-4">
              {fieldError && (
                <p
                  id={errorId}
                  role="alert"
                  className="text-mini text-error leading-none"
                >
                  {fieldError.message as string}
                </p>
              )}
            </div>
          </div>
        )
      })}

      {/* 제출 버튼 — 그라디언트 primary, 전체 폭 */}
      <div className="sm:col-span-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? '보내는 중...' : '문의 보내기'}
        </Button>
      </div>
    </form>
  )
}
