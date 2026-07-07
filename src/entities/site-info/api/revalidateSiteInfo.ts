'use server';

import { updateTag } from 'next/cache';
import { SITE_INFO_CACHE_TAG } from './siteInfoServerFetch';

/**
 * 사이트 정보 캐시(getSiteInfoServer, cacheTag: 'site-info')를 온디맨드 무효화한다.
 * 어드민 사이트 정보 수정 뮤테이션 onSuccess에서 호출해 read-your-own-writes를 보장한다
 * (Footer 등 서버 렌더 캐시가 다음 요청에서 즉시 최신값을 반영).
 */
export async function revalidateSiteInfoCache(): Promise<void> {
  updateTag(SITE_INFO_CACHE_TAG);
}
