import { z } from 'zod'
import type { InquiryField } from '@/entities/inquiry-field'

/** tel 허용 문자: 숫자/공백/+ - ( ) — 백엔드 계약과 동일 */
const TEL_PATTERN = /^[0-9+\-() ]+$/

/**
 * 동적 문의 폼 검증 스키마 빌더.
 * 필드 정의(key 기반)로부터 z.object를 생성한다.
 * - required면 빈 값을 거부, 아니면 빈 문자열 허용.
 * - type email은 값이 있을 때 이메일 형식 검증.
 * - type tel은 값이 있을 때 허용 문자 검증.
 * 폼 values는 Record<string, string>(key 기반).
 */
export function buildInquirySchema(fields: InquiryField[]) {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const field of fields) {
    const label = field.label
    let schema = z.string()

    if (field.type === 'email') {
      // 값이 있을 때만 이메일 형식 검증 (빈 값은 required 규칙이 처리)
      schema = schema.refine(
        (v) => v === '' || z.string().email().safeParse(v).success,
        { message: `${label} 형식이 올바르지 않습니다.` },
      )
    } else if (field.type === 'tel') {
      schema = schema.refine((v) => v === '' || TEL_PATTERN.test(v), {
        message: `${label}을(를) 올바르게 입력해주세요.`,
      })
    }

    if (field.required) {
      schema = schema.refine((v) => v.trim().length > 0, {
        message: `${label}을(를) 입력해주세요.`,
      })
    }

    shape[field.key] = schema
  }

  return z.object(shape)
}

export type InquiryFormValues = Record<string, string>
