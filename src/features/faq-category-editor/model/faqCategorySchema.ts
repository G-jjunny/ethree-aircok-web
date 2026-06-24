import { z } from 'zod'

export const faqCategorySchema = z.object({
  name: z.string().min(1, '카테고리명을 입력하세요').max(50),
  order: z.number().int().min(0).optional(),
})

export type FaqCategoryFormValues = z.infer<typeof faqCategorySchema>
