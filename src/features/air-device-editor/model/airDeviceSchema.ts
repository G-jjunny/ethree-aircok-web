import { z } from 'zod'

/**
 * 측정 항목(items) 행 스키마.
 * 백엔드 CreateAirDeviceItemDto와 동일한 제약(code ≤ 50, label ≤ 100)을 미러링한다.
 *
 * ⚠️ `id`/`deviceId`/`order`는 **의도적으로 없다** — 요청 body에 실으면
 * forbidNonWhitelisted로 400이며, order는 서버가 배열 인덱스로 채번한다.
 */
export const airDeviceItemSchema = z.object({
  code: z
    .string()
    .min(1, '항목 코드를 입력하세요')
    .max(50, '항목 코드는 50자 이내로 입력하세요'),
  label: z
    .string()
    .min(1, '항목명을 입력하세요')
    .max(100, '항목명은 100자 이내로 입력하세요'),
})

/**
 * 측정기 생성/수정 폼 스키마.
 * 백엔드 CreateAirDeviceDto의 필드 길이 제약을 그대로 미러링한다.
 *
 * ⚠️ `imageUrl`은 **의도적으로 없다** — 제품 사진은 multipart 전용 경로이며
 * JSON body에 넣으면 400이다(생성은 "레코드 생성 → 사진 업로드" 2단계).
 * `order`도 없다 — 순서는 목록의 드래그앤드롭(reorder 엔드포인트)이 담당한다.
 */
export const airDeviceSchema = z.object({
  name: z
    .string()
    .min(1, '모델명을 입력하세요')
    .max(200, '모델명은 200자 이내로 입력하세요'),
  subtitle: z
    .string()
    .min(1, '모델 부제를 입력하세요')
    .max(200, '모델 부제는 200자 이내로 입력하세요'),
  badge: z
    .string()
    .min(1, '뱃지 문구를 입력하세요')
    .max(100, '뱃지 문구는 100자 이내로 입력하세요'),
  size: z
    .string()
    .min(1, '크기를 입력하세요')
    .max(100, '크기는 100자 이내로 입력하세요'),
  weight: z
    .string()
    .min(1, '무게를 입력하세요')
    .max(100, '무게는 100자 이내로 입력하세요'),
  power: z
    .string()
    .min(1, '전원을 입력하세요')
    .max(100, '전원은 100자 이내로 입력하세요'),
  comm: z
    .string()
    .min(1, '통신 방식을 입력하세요')
    .max(200, '통신 방식은 200자 이내로 입력하세요'),
  storage: z
    .string()
    .min(1, '저장 방식을 입력하세요')
    .max(100, '저장 방식은 100자 이내로 입력하세요'),
  operatingTemp: z
    .string()
    .min(1, '동작 온도를 입력하세요')
    .max(100, '동작 온도는 100자 이내로 입력하세요'),
  published: z.boolean(),
  /** replace-all 시맨틱이므로 폼은 항상 **전체 항목**을 담는다(빈 배열 = 전부 삭제). */
  items: z.array(airDeviceItemSchema),
})

export type AirDeviceFormValues = z.infer<typeof airDeviceSchema>
