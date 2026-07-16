/**
 * `/services` 섹션 이미지 TanStack Query 키 팩토리(단일 출처).
 * 순수 상수/팩토리이므로 서버·클라 무관하게 안전하다.
 */
export const productSectionImageKeys = {
  /** 공개 목록(GET /product-images). */
  all: ['product-section-images'] as const,
  /**
   * 어드민 목록(GET /product-images/admin — 무캐시).
   *
   * `all`을 prefix로 갖도록 설계했다. `invalidateQueries`는 기본이 prefix 부분 일치이므로
   * 뮤테이션에서 `productSectionImageKeys.all` 하나만 무효화하면 공개·어드민 캐시가 함께 무효화된다.
   */
  admin: ['product-section-images', 'admin'] as const,
};
