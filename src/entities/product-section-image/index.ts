/**
 * `/services` 섹션 이미지 엔티티의 **클라이언트 안전** public API.
 *
 * 서버 전용 심볼(getProductSectionImageListServer / PRODUCT_SECTION_IMAGES_CACHE_TAG)은
 * 클라이언트 번들 유출 방지를 위해 이 배럴이 아니라
 * `@/entities/product-section-image/server`에서만 노출한다.
 * (배럴이 next/cache를 끌어오면 렌더 워커 크래시로 동적 라우트가 500이 난다 — PR #119 회귀)
 */
export type {
  ProductImageSlot,
  ProductSectionImage,
  ProductSectionImageMap,
} from './model/types';
export { PRODUCT_IMAGE_SLOTS } from './model/constants';
export { getSlotImage, toSlotImageMap } from './model/slotImages';
export { productSectionImageKeys } from './api/productSectionImageKeys';
export {
  ProductSectionImageApiError,
  getProductSectionImageList,
  productSectionImageListQueryOptions,
} from './api/productSectionImageApi';
export { revalidateProductSectionImagesCache } from './api/revalidateProductSectionImages';
