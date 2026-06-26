import { z } from 'zod'

export const timelineSchema = z.object({
  year: z.coerce
    .number({ message: '연도를 입력하세요' })
    .int('연도는 정수여야 합니다')
    .min(2000, '연도는 2000 이상이어야 합니다')
    .max(2100, '연도는 2100 이하여야 합니다'),
  month: z.coerce
    .number({ message: '월을 입력하세요' })
    .int('월은 정수여야 합니다')
    .min(1, '월은 1 이상이어야 합니다')
    .max(12, '월은 12 이하여야 합니다'),
  content: z.string().min(1, '내용을 입력하세요'),
})

/** react-hook-form 입력값 타입 (coerce 전 — 폼 input의 raw 값). */
export type TimelineFormInput = z.input<typeof timelineSchema>
/** zod 검증·변환 후 출력값 타입 (mutation body로 전달). */
export type TimelineFormValues = z.output<typeof timelineSchema>
