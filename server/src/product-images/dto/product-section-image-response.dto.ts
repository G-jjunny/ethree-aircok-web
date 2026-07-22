import { ProductImageSlot } from '@prisma/client';

/**
 * ProductSectionImage 응답 DTO (#services 1단계).
 *
 * 공통 응답 타입:
 * - GET /api/product-images (배열) — 공개. `Cache-Control: public, max-age=60` + ETag.
 * - GET /api/product-images/admin (배열) — 어드민 전용(JwtAuthGuard). `Cache-Control: no-store`.
 * - PUT /api/product-images/:slot (단건, upsert 결과)
 *
 * 공개 GET 과 어드민 GET 의 응답 스키마가 **동일한** 이유:
 * - 이 모델에는 published/draft 같은 노출 제어 컬럼도, 어드민에게만 보여줄 비공개 컬럼도 없다.
 *   따라서 두 엔드포인트의 결과 집합(등록된 슬롯 전체)과 필드 구성이 완전히 같다.
 *   (AirDevice 의 공개/어드민 분기는 published 필터 때문이지만, 여기엔 필터 자체가 없다.)
 * - 두 엔드포인트가 갈리는 유일한 축은 **인증과 HTTP 캐시 정책**이다:
 *   공개 GET 은 CDN/브라우저 캐시(max-age=60)를 타므로, 어드민이 업로드 직후 목록을 다시 열면
 *   최대 60초간 낡은 응답을 볼 수 있다. 어드민 GET 은 CacheControlInterceptor 를 부착하지 않고
 *   no-store 를 명시해 항상 원본을 조회한다 → 업로드/삭제 직후 즉시 반영(read-after-write).
 *
 * 인증 방식 (어드민 GET):
 * - JwtStrategy 는 `access_token` **쿠키에서만** JWT 를 추출한다(Authorization 헤더 추출기 없음).
 *   따라서 프론트는 반드시 credentials 포함 요청을 보내야 한다(axiosInstance 의 withCredentials).
 * - 미인증/만료 시 401 `{ "message": "Unauthorized", "statusCode": 401 }`.
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
