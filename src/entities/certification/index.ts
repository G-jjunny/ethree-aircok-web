/**
 * 인증서·특허증 엔티티의 **클라이언트 안전** public API.
 *
 * 서버 전용 심볼(getCertificationListServer / CERTIFICATIONS_CACHE_TAG)은
 * 클라이언트 번들 유출 방지를 위해 이 배럴이 아니라
 * `@/entities/certification/server`에서만 노출한다(PR #119 회귀 차단).
 */
export type { Certification } from './model/types';
export { certificationKeys } from './api/certificationKeys';
export {
  CertificationApiError,
  getCertificationList,
  certificationListQueryOptions,
  getAdminCertificationList,
  adminCertificationListQueryOptions,
} from './api/certificationApi';
export { revalidateCertificationCache } from './api/revalidateCertifications';
