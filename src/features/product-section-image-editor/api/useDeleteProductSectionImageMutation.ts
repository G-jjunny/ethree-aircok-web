'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/shared/api';
import {
  productSectionImageKeys,
  revalidateProductSectionImagesCache,
} from '@/entities/product-section-image';
import type { ProductImageSlot } from '@/entities/product-section-image';

/**
 * 섹션 이미지 슬롯 삭제 mutation.
 * DELETE /product-images/:slot → 204 No Content(본문 없음). 미등록 슬롯은 404.
 *
 * 삭제 후 해당 슬롯은 GET 응답 배열에서 **사라진다**(빈 행이 남지 않음).
 * 소비 측은 toSlotImageMap/getSlotImage가 반환하는 null로 폴백을 렌더한다.
 *
 * 성공 시 섹션 이미지 목록 캐시와 서버 캐시(product-section-images 태그)를 무효화한다.
 */
export function useDeleteProductSectionImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slot: ProductImageSlot) =>
      axiosInstance.delete(`/product-images/${slot}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productSectionImageKeys.all });
      void revalidateProductSectionImagesCache();
    },
  });
}
