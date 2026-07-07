'use server';

import { updateTag } from 'next/cache';
import { PARTNERS_CACHE_TAG } from './partnerServerFetch';

/**
 * 파트너 캐시(getPartnerListServer, cacheTag: 'partners')를 온디맨드 무효화한다.
 * 어드민 파트너 편집 뮤테이션 onSuccess에서 호출한다.
 */
export async function revalidatePartnersCache(): Promise<void> {
  updateTag(PARTNERS_CACHE_TAG);
}
