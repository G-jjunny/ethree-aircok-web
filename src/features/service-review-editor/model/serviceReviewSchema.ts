import { z } from 'zod'

/**
 * 진단 후기(신청 이유) 생성/수정 폼 스키마.
 * 백엔드 Create/UpdateServiceReviewDto의 제약(quote/role/age 필수, role·age ≤ 100)을 미러링한다.
 *
 * ⚠️ `imageUrl`·`id`는 **의도적으로 없다** — 아바타 이미지는 multipart 전용 경로
 * (POST /service-reviews/:id/image)이며, JSON body에 imageUrl/id를 실으면
 * forbidNonWhitelisted로 400이다(생성은 "레코드 생성 → 이미지 업로드" 2단계).
 * `order`도 없다 — 순서는 목록의 드래그앤드롭(reorder 엔드포인트)이 담당한다.
 */
export const serviceReviewSchema = z.object({
  quote: z.string().min(1, '신청 이유를 입력하세요'),
  role: z
    .string()
    .min(1, '역할/직함을 입력하세요')
    .max(100, '역할/직함은 100자 이내로 입력하세요'),
  age: z
    .string()
    .min(1, '나이 표기를 입력하세요')
    .max(100, '나이 표기는 100자 이내로 입력하세요'),
  published: z.boolean(),
})

export type ServiceReviewFormValues = z.infer<typeof serviceReviewSchema>
