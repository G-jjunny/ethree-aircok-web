'use server';

import { updateTag } from 'next/cache';
import { MAP_SETTING_CACHE_TAG } from './mapSettingServerFetch';

/**
 * 지도 주소 설정 캐시(getMapSettingServer, cacheTag: 'map-setting')를 온디맨드 무효화한다.
 * 어드민 지도 설정 수정 뮤테이션 onSuccess에서 호출한다.
 */
export async function revalidateMapSettingCache(): Promise<void> {
  updateTag(MAP_SETTING_CACHE_TAG);
}
