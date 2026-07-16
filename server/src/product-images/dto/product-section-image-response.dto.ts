import { ProductImageSlot } from '@prisma/client';

/**
 * ProductSectionImage 응답 DTO (#services 1단계).
 *
 * 공통 응답 타입:
 * - GET /api/product-images (배열)
 * - PUT /api/product-images/:slot (단건, upsert 결과)
 *
 * 응답 형태 결정 — 맵이 아닌 **배열**:
 * - 기존 모든 목록 GET(partners/core-values/catalog/team-images)이 배열을 반환한다.
 *   맵 형태를 쓰는 곳은 싱글톤(site-info/mail-setting/map-setting)뿐이며, 이 모델은 싱글톤이 아니다.
 * - 배열은 id/createdAt/updatedAt 같은 메타를 보존한다. 맵({ SLOT: "url" })은 이를 버린다.
 * - 프론트가 슬롯 단위 조회를 원하면 응답에서 O(n) 으로 맵을 파생할 수 있다(역방향은 불가):
 *   `Object.fromEntries(data.map((i) => [i.slot, i.imageUrl]))`
 * - 미등록 슬롯은 응답 배열에 아예 없다(빈 문자열 행을 두지 않는 정책). 프론트는 조회 실패를
 *   "이미지 없음"으로 보고 폴백을 렌더한다.
 */
export class ProductSectionImageResponseDto {
  /** cuid 문자열. 실질 조회 키는 slot 이다. */
  id: string;
  /** 고정 슬롯. ProductImageSlot enum 값. 슬롯당 1행. */
  slot: ProductImageSlot;
  /** R2 업로드 후 받은 공개 이미지 절대 URL. */
  imageUrl: string;
  /** ISO 8601 문자열. */
  createdAt: string;
  /** ISO 8601 문자열. */
  updatedAt: string;
}
