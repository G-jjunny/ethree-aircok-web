/**
 * 인증서·특허증 캐시 태그 — 순수 문자열 상수(서버·클라 무관, 런타임 번들 안전).
 * 서버 페처('use cache' 래퍼)와 어드민 무효화('use server')가 공유한다.
 *
 * 서버 전용 심볼로 취급해 `@/entities/certification/server`에서만 노출한다(news 패턴).
 */
export const CERTIFICATIONS_CACHE_TAG = 'certifications';
