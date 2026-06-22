import { z } from 'zod';

/**
 * 지도 주소 설정 폼 스키마.
 * 백엔드 DTO와 1:1 (address 단일 필드).
 */
export const mapSettingSchema = z.object({
  address: z.string().min(1, '주소를 입력하세요'),
});

export type MapSettingFormValues = z.infer<typeof mapSettingSchema>;
