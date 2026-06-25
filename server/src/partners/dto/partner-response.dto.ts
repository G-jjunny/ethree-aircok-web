import { PartnerType } from '@prisma/client';

/**
 * Partner 응답 DTO (#48).
 *
 * GET /api/partners, POST /api/partners, PATCH /api/partners/:id,
 * POST /api/partners/:id/logo 공통 응답 타입.
 *
 * 주의: id 는 cuid(string). 프론트엔드 초안의 number 에서 string 으로 변경됨.
 */
export class PartnerResponseDto {
  /** cuid 문자열. 프론트엔드 초안의 number 에서 string 으로 변경. */
  id: string;
  name: string;
  logoUrl: string | null;
  /** 'partner' | 'client' */
  type: PartnerType;
  order: number;
  /** ISO 8601 문자열. */
  createdAt: string;
  /** ISO 8601 문자열. */
  updatedAt: string;
}
