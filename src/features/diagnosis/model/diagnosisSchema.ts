import { z } from 'zod'

export const diagnosisSchema = z.object({
  name: z.string().min(1, '성함을 입력해주세요.').max(50, '성함은 50자 이내로 입력해주세요.'),
  phone: z
    .string()
    .min(1, '전화번호를 입력해주세요.')
    .regex(/^\d{3}-\d{4}-\d{4}$/, '전화번호를 올바르게 입력해 주세요 (예: 010-1234-5678)'),
})

export type DiagnosisFormValues = z.infer<typeof diagnosisSchema>
