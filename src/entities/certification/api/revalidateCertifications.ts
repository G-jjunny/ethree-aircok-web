'use server';

import { updateTag } from 'next/cache';
import { CERTIFICATIONS_CACHE_TAG } from './certificationCacheTags';

/**
 * 인증서·특허증 캐시를 온디맨드 무효화한다(cacheTag: 'certifications').
 * 어드민 인증서 create/delete/reorder 뮤테이션 onSuccess에서 호출한다.
 */
export async function revalidateCertificationCache(): Promise<void> {
  updateTag(CERTIFICATIONS_CACHE_TAG);
}
