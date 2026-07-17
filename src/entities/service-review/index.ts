/**
 * 진단 서비스 후기 엔티티의 **클라이언트 안전** public API.
 *
 * 서버 전용 심볼(getServiceReviewListServer / SERVICE_REVIEWS_CACHE_TAG)은
 * 클라이언트 번들 유출 방지를 위해 이 배럴이 아니라
 * `@/entities/service-review/server`에서만 노출한다(PR #119 회귀 차단).
 */
export type { ServiceReview } from './model/types';
export { serviceReviewKeys } from './api/serviceReviewKeys';
export {
  ServiceReviewApiError,
  getServiceReviewList,
  serviceReviewListQueryOptions,
  getAdminServiceReviewList,
  adminServiceReviewListQueryOptions,
} from './api/serviceReviewApi';
export { revalidateServiceReviewCache } from './api/revalidateServiceReviews';
