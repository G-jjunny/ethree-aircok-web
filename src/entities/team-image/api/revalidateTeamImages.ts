'use server';

import { updateTag } from 'next/cache';
import { TEAM_IMAGES_CACHE_TAG } from './teamImageServerFetch';

/**
 * 팀 이미지 캐시(getTeamImageListServer, cacheTag: 'team-images')를 온디맨드 무효화한다.
 * 어드민 팀 이미지 편집 뮤테이션 onSuccess에서 호출한다.
 */
export async function revalidateTeamImagesCache(): Promise<void> {
  updateTag(TEAM_IMAGES_CACHE_TAG);
}
