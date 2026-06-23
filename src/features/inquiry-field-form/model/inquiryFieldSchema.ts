import { z } from 'zod'

/** key 슬러그: 영소문자로 시작, 영소문자/숫자/언더스코어 — 백엔드 계약과 동일 */
const KEY_PATTERN = /^[a-z][a-z0-9_]*$/

export const INQUIRY_FIELD_TYPES = ['text', 'textarea', 'email', 'tel'] as const

/**
 * 어드민 문의 필드 추가/수정 폼 스키마.
 * key는 생성 시에만 입력(슬러그 검증), 수정 모드에선 비활성이므로 검증 결과에 영향 없다.
 */
export const inquiryFieldSchema = z.object({
  key: z
    .string()
    .min(1, '키를 입력하세요.')
    .max(50, '키는 50자 이내로 입력하세요.')
    .regex(
      KEY_PATTERN,
      '영소문자로 시작하고 영소문자/숫자/_만 사용할 수 있습니다.',
    ),
  label: z
    .string()
    .min(1, '라벨을 입력하세요.')
    .max(100, '라벨은 100자 이내로 입력하세요.'),
  type: z.enum(INQUIRY_FIELD_TYPES),
  required: z.boolean(),
  placeholder: z.string().max(200, '플레이스홀더는 200자 이내로 입력하세요.'),
})

export type InquiryFieldFormValues = z.infer<typeof inquiryFieldSchema>
