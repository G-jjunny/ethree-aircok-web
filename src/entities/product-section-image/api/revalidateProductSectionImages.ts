'use server';

import { updateTag } from 'next/cache';
import { PRODUCT_SECTION_IMAGES_CACHE_TAG } from './productSectionImageCacheTags';

/**
 * 섹션 이미지 캐시를 온디맨드 무효화한다(cacheTag: 'product-section-images').
 * 어드민 슬롯 upsert(PUT /product-images/:slot) / 삭제(DELETE) 뮤테이션 onSuccess에서 호출한다.
 */
export async function revalidateProductSectionImagesCache(): Promise<void> {
  updateTag(PRODUCT_SECTION_IMAGES_CACHE_TAG);
}
