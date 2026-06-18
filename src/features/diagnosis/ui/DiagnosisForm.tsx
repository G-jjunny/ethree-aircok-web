'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { diagnosisSchema, type DiagnosisFormValues } from '../model/diagnosisSchema'
import { submitDiagnosis } from '../api/submitDiagnosis'

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

export function DiagnosisForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DiagnosisFormValues>({
    resolver: zodResolver(diagnosisSchema),
  })

  const phoneRegister = register('phone')

  const onSubmit = async (data: DiagnosisFormValues) => {
    try {
      await submitDiagnosis(data)
      toast.success('신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.')
      reset()
    } catch {
      toast.error('신청 중 오류가 발생했습니다. 다시 시도해 주세요.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="진단서비스 상담 신청 폼" className="flex flex-col gap-6">
      {/* 성함 필드 */}
      <div className="flex flex-col gap-1">
        {/* text-[15px]: 폼 라벨 전용 크기, Link/Caption(14px)보다 크고 Body(17px)보다 작은 1회성 수치 */}
        <label htmlFor="diagnosis-name" className="text-[15px] font-medium text-heading-dark">
          성함 <span className="text-error" aria-hidden="true">*</span>
        </label>
        <input
          id="diagnosis-name"
          type="text"
          autoComplete="name"
          placeholder="홍길동"
          {...register('name')}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'diagnosis-name-error' : undefined}
          className="w-full bg-surface-light rounded-md px-4 py-3 text-[17px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue border-none"
        />
        {/* h-5(20px): 에러 텍스트 예약 공간 — spacing 토큰 없음(16px/24px 사이 1회성 레이아웃 수치) */}
        {/* text-[13px]: 폼 에러 전용 크기 — Micro(12px)보다 크고 Caption(14px)보다 작은 1회성 수치 */}
        <div className="h-5 mt-1">
          {errors.name && (
            <p id="diagnosis-name-error" role="alert" className="text-[13px] text-error leading-none">
              {errors.name.message}
            </p>
          )}
        </div>
      </div>

      {/* 전화번호 필드 */}
      <div className="flex flex-col gap-1">
        {/* text-[15px]: 폼 라벨 전용 크기, Link/Caption(14px)보다 크고 Body(17px)보다 작은 1회성 수치 */}
        <label htmlFor="diagnosis-phone" className="text-[15px] font-medium text-heading-dark">
          전화번호 <span className="text-error" aria-hidden="true">*</span>
        </label>
        <input
          id="diagnosis-phone"
          type="tel"
          autoComplete="tel"
          placeholder="010-0000-0000"
          {...phoneRegister}
          onChange={(e) => {
            e.target.value = formatPhone(e.target.value)
            phoneRegister.onChange(e)
          }}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'diagnosis-phone-error' : undefined}
          className="w-full bg-surface-light rounded-md px-4 py-3 text-[17px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue border-none"
        />
        {/* h-5(20px): 에러 텍스트 예약 공간 — spacing 토큰 없음(16px/24px 사이 1회성 레이아웃 수치) */}
        {/* text-[13px]: 폼 에러 전용 크기 — Micro(12px)보다 크고 Caption(14px)보다 작은 1회성 수치 */}
        <div className="h-5 mt-1">
          {errors.phone && (
            <p id="diagnosis-phone-error" role="alert" className="text-[13px] text-error leading-none">
              {errors.phone.message}
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
        {isSubmitting ? '신청 중...' : '서비스 신청하기'}
      </button>
    </form>
  )
}
