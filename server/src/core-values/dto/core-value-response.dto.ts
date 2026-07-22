/**
 * CoreValue 응답 DTO (#93).
 *
 * GET /api/core-values, POST /api/core-values, PATCH /api/core-values/:id,
 * PATCH /api/core-values/reorder 공통 응답 타입(reorder 는 배열).
 */
export class CoreValueResponseDto {
  /** cuid 문자열. */
  id: string;
  title: string;
  description: string;
  order: number;
  /** ISO 8601 문자열. */
  createdAt: string;
  /** ISO 8601 문자열. */
  updatedAt: string;
}
