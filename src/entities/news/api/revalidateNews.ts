'use server';

import { updateTag } from 'next/cache';
import { NEWS_CACHE_TAG, newsPostCacheTag } from './newsCacheTags';

/**
 * 뉴스 캐시를 온디맨드 무효화한다.
 * - 목록 캐시(cacheTag: 'news')는 항상 무효화한다.
 * - id가 주어지면 해당 상세 캐시(cacheTag: `news-${id}`)도 함께 무효화한다.
 * 어드민 뉴스 create/update/delete 뮤테이션 onSuccess에서 호출한다.
 */
export async function revalidateNewsCache(id?: string): Promise<void> {
  updateTag(NEWS_CACHE_TAG);
  if (id) {
    updateTag(newsPostCacheTag(id));
  }
}
