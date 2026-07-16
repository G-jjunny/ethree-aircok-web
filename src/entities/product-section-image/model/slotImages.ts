import { PRODUCT_IMAGE_SLOTS } from './constants';
import type {
  ProductImageSlot,
  ProductSectionImage,
  ProductSectionImageMap,
} from './types';

/**
 * 슬롯 목록에 없는 값(백엔드가 enum을 먼저 확장한 경우)을 방어적으로 걸러내기 위한 판별자.
 * 프론트가 모르는 슬롯은 렌더할 자리도 없으므로 무시하는 것이 안전하다.
 */
function isKnownSlot(slot: string): slot is ProductImageSlot {
  return (PRODUCT_IMAGE_SLOTS as readonly string[]).includes(slot);
}

/**
 * 배열 응답에서 특정 슬롯의 이미지 URL을 조회한다.
 *
 * **미등록 슬롯은 정상 케이스**이며 이때 null을 반환한다(현재 전 슬롯이 미등록 상태다).
 * 소비 측은 null이면 폴백(PagePlaceholder 등)을 렌더한다.
 *
 * 한 컴포넌트에서 여러 슬롯을 쓴다면 {@link toSlotImageMap}으로 한 번만 정규화하는 편이 낫다.
 */
export function getSlotImage(
  images: readonly ProductSectionImage[],
  slot: ProductImageSlot,
): string | null {
  const found = images.find((image) => image.slot === slot);
  // 계약상 행이 있으면 imageUrl은 non-empty지만, 빈 문자열도 "없음"으로 취급한다.
  return found?.imageUrl ? found.imageUrl : null;
}

/**
 * 배열 응답을 전 슬롯이 채워진 `Record<slot, string | null>`로 정규화한다.
 *
 * 응답에 없는 슬롯(=미등록)은 null로 채워지므로, 소비 측이 슬롯마다 `.find()`를 반복하거나
 * 키 존재 여부를 확인할 필요가 없다.
 */
export function toSlotImageMap(
  images: readonly ProductSectionImage[],
): ProductSectionImageMap {
  const map = Object.fromEntries(
    PRODUCT_IMAGE_SLOTS.map((slot) => [slot, null]),
  ) as ProductSectionImageMap;

  for (const image of images) {
    if (!isKnownSlot(image.slot) || !image.imageUrl) continue;
    map[image.slot] = image.imageUrl;
  }

  return map;
}
