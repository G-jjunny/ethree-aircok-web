/**
 * 인증서·특허증 엔티티의 **서버 전용** public API.
 * 서버 컴포넌트/서버 파일만 이 진입점을 사용한다(클라이언트 번들 유출 방지).
 * 클라이언트 안전 심볼(타입·쿼리키·queryOptions 등)은
 * `@/entities/certification`(배럴)에서 import한다.
 */
export { getCertificationListServer } from './api/certificationServerFetch';
export { CERTIFICATIONS_CACHE_TAG } from './api/certificationCacheTags';
