export type { NewsSummary, NewsPost, NewsListResponse, NewsType } from './model/types';
export { NEWS_PAGE_SIZE } from './model/constants';
// 서버 전용 심볼(getNewsList/getNewsPost/NewsApiError/NEWS_CACHE_TAG/newsPostCacheTag)은
// 클라이언트 번들 유출 방지를 위해 이 배럴이 아니라 '@/entities/news/server'에서만 노출한다.
export { revalidateNewsCache } from './api/revalidateNews';
export {
  getAdminNewsList,
  adminNewsQueryOptions,
  adminNewsKeys,
  AdminNewsApiError,
  newsListQueryOptions,
} from './api/newsApi';
export { newsKeys } from './api/newsKeys';
export type { NewsListParams } from './api/newsKeys';
