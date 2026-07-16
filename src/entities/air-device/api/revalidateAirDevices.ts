'use server';

import { updateTag } from 'next/cache';
import { AIR_DEVICES_CACHE_TAG } from './airDeviceCacheTags';

/**
 * 측정기 캐시를 온디맨드 무효화한다(cacheTag: 'air-devices').
 * 어드민 측정기 create/update/delete/reorder/이미지 업로드 뮤테이션 onSuccess에서 호출한다.
 */
export async function revalidateAirDeviceCache(): Promise<void> {
  updateTag(AIR_DEVICES_CACHE_TAG);
}
