/**
 * 공기질 측정기 TanStack Query 키 팩토리(단일 출처).
 * 순수 상수/팩토리이므로 서버·클라 무관하게 안전하다.
 */
export const airDeviceKeys = {
  /** 공개 목록(GET /air-devices). */
  all: ['air-devices'] as const,
  /**
   * 어드민 목록(GET /air-devices/admin — 미공개 포함).
   *
   * `all`을 prefix로 갖도록 설계했다. `invalidateQueries`는 기본이 prefix 부분 일치이므로
   * 뮤테이션에서 `airDeviceKeys.all` 하나만 무효화하면 공개·어드민 캐시가 함께 무효화된다.
   */
  admin: ['air-devices', 'admin'] as const,
};
