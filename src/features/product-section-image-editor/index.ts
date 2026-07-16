/**
 * 어드민 섹션 이미지 편집 feature의 public API.
 * 뮤테이션 훅만 노출한다 — 조회는 공개 엔드포인트를 그대로 쓰므로
 * `@/entities/product-section-image`의 productSectionImageListQueryOptions를 재사용한다.
 */
export { useUpsertProductSectionImageMutation } from './api/useUpsertProductSectionImageMutation';
export { useDeleteProductSectionImageMutation } from './api/useDeleteProductSectionImageMutation';
