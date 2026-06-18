import { z } from 'zod'

export const diagnosisSchema = z.object({
  name: z.string().min(1, '성함을 입력해주세요.').max(50, '성함은 50자 이내로 입력해주세요.'),
  phone: z
    .string()
    .min(1, '전화번호를 입력해주세요.')
    .regex(/^[0-9\-+\s()]{7,20}$/, '올바른 전화번호 형식으로 입력해주세요.'),
})

export type DiagnosisFormValues = z.infer<typeof diagnosisSchema>
