/**
 * 인증서·특허증 TanStack Query 키 팩토리(단일 출처).
 * 순수 상수/팩토리이므로 서버·클라 무관하게 안전하다.
 */
export const certificationKeys = {
  /** 공개 목록(GET /certifications). */
  all: ['certifications'] as const,
  /**
   * 어드민 목록(GET /certifications + 캐시버스터).
   *
   * Certification은 admin 전용 GET이 없어 공개 GET을 재사용하되, 응답의 HTTP 캐시를
   * 무력화하는 캐시버스터 쿼리를 붙여 조회한다(자세한 근거는 certificationApi.ts 참조).
   *
   * `all`을 prefix로 갖도록 설계했다. 뮤테이션에서 `certificationKeys.all` 하나만
   * 무효화하면 공개·어드민 캐시가 함께 무효화된다(prefix 부분 일치).
   */
  admin: ['certifications', 'admin'] as const,
};
