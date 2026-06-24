import { z } from 'zod'

export const faqItemSchema = z.object({
  categoryId: z.string().min(1, '카테고리를 선택하세요'),
  question: z.string().min(1, '질문을 입력하세요').max(200),
  answer: z.string().min(1, '답변을 입력하세요').max(2000),
  order: z.number().int().min(0).optional(),
})

export type FaqItemFormValues = z.infer<typeof faqItemSchema>
