/**
 * 진단 서비스 후기 캐시 태그 — 순수 문자열 상수(서버·클라 무관, 런타임 번들 안전).
 * 서버 페처('use cache' 래퍼)와 어드민 무효화('use server')가 공유한다.
 *
 * 서버 전용 심볼로 취급해 `@/entities/service-review/server`에서만 노출한다(news 패턴).
 */
export const SERVICE_REVIEWS_CACHE_TAG = 'service-reviews';
