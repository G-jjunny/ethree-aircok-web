import { z } from 'zod'

/**
 * 문의 폼 검증 스키마.
 * 백엔드 DTO와 길이 제약을 1:1로 맞추되,
 * company는 화면상 필수 표기 요구에 따라 프론트에서 min(1)로 필수 검증한다.
 * (백엔드 DTO상 company는 optional이므로 더 엄격한 프론트 검증은 안전하다.)
 * phone은 길이 검증만 — 대표번호/유선번호 입력이 가능해야 하므로
 * 한국 휴대폰 정규식을 강제하지 않는다.
 */
export const inquirySchema = z.object({
  company: z
    .string()
    .min(1, '회사/기관명을 입력해주세요.')
    .max(100, '회사/기관명은 100자 이내로 입력해주세요.'),
  name: z
    .string()
    .min(1, '담당자명을 입력해주세요.')
    .max(50, '담당자명은 50자 이내로 입력해주세요.'),
  phone: z
    .string()
    .min(9, '전화번호를 올바르게 입력해주세요.')
    .max(20, '전화번호는 20자 이내로 입력해주세요.'),
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('이메일 형식이 올바르지 않습니다.')
    .max(254, '이메일은 254자 이내로 입력해주세요.'),
  message: z
    .string()
    .min(10, '요청사항을 10자 이상 입력해주세요.')
    .max(2000, '요청사항은 2000자 이내로 입력해주세요.'),
})

export type InquiryFormValues = z.infer<typeof inquirySchema>
