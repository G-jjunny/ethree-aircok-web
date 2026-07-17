'use server';

import { updateTag } from 'next/cache';
import { SERVICE_REVIEWS_CACHE_TAG } from './serviceReviewCacheTags';

/**
 * 진단 후기 캐시를 온디맨드 무효화한다(cacheTag: 'service-reviews').
 * 어드민 후기 create/update/delete/reorder/이미지 업로드 뮤테이션 onSuccess에서 호출한다.
 */
export async function revalidateServiceReviewCache(): Promise<void> {
  updateTag(SERVICE_REVIEWS_CACHE_TAG);
}
