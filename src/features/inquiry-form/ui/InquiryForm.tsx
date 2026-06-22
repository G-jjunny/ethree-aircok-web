'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createInquiry, InquiryApiError } from '@/entities/inquiry'
import { inquirySchema, type InquiryFormValues } from '../model/inquirySchema'

/** 입력값에서 숫자와 하이픈만 허용 — 대표번호/유선/휴대폰 모두 입력 가능 */
function sanitizePhone(value: string): string {
  return value.replace(/[^\d-]/g, '').slice(0, 20)
}

export function InquiryForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
  })

  const phoneRegister = register('phone')

  const onSubmit = async (data: InquiryFormValues) => {
    try {
      await createInquiry(data)
      toast.success('메시지를 보내주셔서 감사합니다. 24시간 이내에 답변드리겠습니다.')
      reset()
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
      {/* 회사/기관명 필드 */}
      <div className="flex flex-col gap-1">
        {/* text-[15px]: 폼 라벨 전용 크기, Link/Caption(14px)보다 크고 Body(17px)보다 작은 1회성 수치 */}
        <label htmlFor="inquiry-company" className="text-[15px] font-medium text-heading-dark">
          회사/기관명 <span className="text-error" aria-hidden="true">*</span>
        </label>
        <input
          id="inquiry-company"
          type="text"
          autoComplete="organization"
          placeholder="(주)에어콕"
          {...register('company')}
          aria-invalid={!!errors.company}
          aria-describedby={errors.company ? 'inquiry-company-error' : undefined}
          className="w-full bg-surface-light rounded-md px-4 py-3 text-[17px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue border-none"
        />
        {/* h-5(20px): 에러 텍스트 예약 공간 — spacing 토큰 없음(16px/24px 사이 1회성 레이아웃 수치) */}
        {/* text-[13px]: 폼 에러 전용 크기 — Micro(12px)보다 크고 Caption(14px)보다 작은 1회성 수치 */}
        <div className="h-5 mt-1">
          {errors.company && (
            <p id="inquiry-company-error" role="alert" className="text-[13px] text-error leading-none">
              {errors.company.message}
            </p>
          )}
        </div>
      </div>

      {/* 담당자명 필드 */}
      <div className="flex flex-col gap-1">
        <label htmlFor="inquiry-name" className="text-[15px] font-medium text-heading-dark">
          담당자명 <span className="text-error" aria-hidden="true">*</span>
        </label>
        <input
          id="inquiry-name"
          type="text"
          autoComplete="name"
          placeholder="홍길동"
          {...register('name')}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'inquiry-name-error' : undefined}
          className="w-full bg-surface-light rounded-md px-4 py-3 text-[17px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue border-none"
        />
        <div className="h-5 mt-1">
          {errors.name && (
            <p id="inquiry-name-error" role="alert" className="text-[13px] text-error leading-none">
              {errors.name.message}
            </p>
          )}
        </div>
      </div>

      {/* 전화번호 필드 */}
      <div className="flex flex-col gap-1">
        <label htmlFor="inquiry-phone" className="text-[15px] font-medium text-heading-dark">
          전화번호 <span className="text-error" aria-hidden="true">*</span>
        </label>
        <input
          id="inquiry-phone"
          type="tel"
          autoComplete="tel"
          placeholder="02-6952-1947"
          {...phoneRegister}
          onChange={(e) => {
            e.target.value = sanitizePhone(e.target.value)
            phoneRegister.onChange(e)
          }}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'inquiry-phone-error' : undefined}
          className="w-full bg-surface-light rounded-md px-4 py-3 text-[17px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue border-none"
        />
        <div className="h-5 mt-1">
          {errors.phone && (
            <p id="inquiry-phone-error" role="alert" className="text-[13px] text-error leading-none">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* 이메일 필드 */}
      <div className="flex flex-col gap-1">
        <label htmlFor="inquiry-email" className="text-[15px] font-medium text-heading-dark">
          이메일 <span className="text-error" aria-hidden="true">*</span>
        </label>
        <input
          id="inquiry-email"
          type="email"
          autoComplete="email"
          placeholder="example@company.com"
          {...register('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'inquiry-email-error' : undefined}
          className="w-full bg-surface-light rounded-md px-4 py-3 text-[17px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue border-none"
        />
        <div className="h-5 mt-1">
          {errors.email && (
            <p id="inquiry-email-error" role="alert" className="text-[13px] text-error leading-none">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      {/* 요청사항 필드 */}
      <div className="flex flex-col gap-1">
        <label htmlFor="inquiry-message" className="text-[15px] font-medium text-heading-dark">
          요청사항 <span className="text-error" aria-hidden="true">*</span>
        </label>
        <textarea
          id="inquiry-message"
          rows={6}
          placeholder="문의하실 내용을 10자 이상 입력해 주세요."
          {...register('message')}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'inquiry-message-error' : undefined}
          className="w-full bg-surface-light rounded-md px-4 py-3 text-[17px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue border-none resize-y"
        />
        <div className="h-5 mt-1">
          {errors.message && (
            <p id="inquiry-message-error" role="alert" className="text-[13px] text-error leading-none">
              {errors.message.message}
            </p>
          )}
        </div>
      </div>

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
