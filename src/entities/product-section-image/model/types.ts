import type { PRODUCT_IMAGE_SLOTS } from './constants';

/**
 * `/services` 섹션 이미지 슬롯 식별자.
 * 백엔드 Prisma enum `ProductImageSlot`과 1:1 동기화된다.
 */
export type ProductImageSlot = (typeof PRODUCT_IMAGE_SLOTS)[number];

/**
 * 등록된 섹션 이미지 1건(= 슬롯 1개).
 * 백엔드 계약(GET /api/product-images)과 1:1 매핑된다.
 *
 * 주의: **미등록 슬롯은 응답 배열에 아예 존재하지 않는다**(빈 문자열 행을 두지 않음).
 * 따라서 `imageUrl`은 행이 존재하는 한 항상 non-null이며, "이미지 없음"은
 * 행의 부재로 표현된다. 슬롯 단위 조회는 {@link getSlotImage}/{@link toSlotImageMap}을 쓴다.
 */
export interface ProductSectionImage {
  /** cuid. 이 모델의 실질 조회 키는 id가 아니라 slot이다. */
  id: string;
  /** 이미지가 배치될 고정 슬롯. 슬롯당 1행(백엔드 @unique). */
  slot: ProductImageSlot;
  /** 공개 이미지 절대 URL. 행이 존재하면 non-null·non-empty. */
  imageUrl: string;
  /** ISO 8601 문자열. */
  createdAt: string;
  /** ISO 8601 문자열. */
  updatedAt: string;
}

/**
 * 전 슬롯을 키로 갖는 정규화된 이미지 맵.
 * **미등록 슬롯은 키가 없는 게 아니라 값이 null**이므로, 소비 측은 `map[slot]`만 보고
 * 폴백 여부를 판단할 수 있다(옵셔널 체이닝/`.find()` 불필요).
 */
export type ProductSectionImageMap = Record<ProductImageSlot, string | null>;
