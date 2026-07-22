'use server';

import { updateTag } from 'next/cache';
import { TIMELINE_CACHE_TAG } from './timelineServerFetch';

/**
 * 연혁 캐시(getTimelineListServer, cacheTag: 'timeline')를 온디맨드 무효화한다.
 * 어드민 연혁 편집 뮤테이션 onSuccess에서 호출한다.
 */
export async function revalidateTimelineCache(): Promise<void> {
  updateTag(TIMELINE_CACHE_TAG);
}
