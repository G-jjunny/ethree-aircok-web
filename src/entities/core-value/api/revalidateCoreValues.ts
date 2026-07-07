'use server';

import { updateTag } from 'next/cache';
import { CORE_VALUES_CACHE_TAG } from './coreValueServerFetch';

/**
 * 핵심가치 캐시(getCoreValueListServer, cacheTag: 'core-values')를 온디맨드 무효화한다.
 * 어드민 핵심가치 편집 뮤테이션 onSuccess에서 호출한다.
 */
export async function revalidateCoreValuesCache(): Promise<void> {
  updateTag(CORE_VALUES_CACHE_TAG);
}
