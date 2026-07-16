/**
 * `/services` 섹션 이미지 캐시 태그 — 순수 문자열 상수(서버·클라 무관, 런타임 번들 안전).
 * 서버 페처('use cache' 래퍼)와 'use server' 무효화(revalidateProductSectionImages)가 공유한다.
 *
 * 서버 전용 심볼로 취급해 `@/entities/product-section-image/server`에서만 노출한다(news 패턴).
 */

/** 섹션 이미지 캐시 태그. 어드민 슬롯 upsert(PUT)/삭제(DELETE) 후 updateTag로 무효화한다. */
export const PRODUCT_SECTION_IMAGES_CACHE_TAG = 'product-section-images';
