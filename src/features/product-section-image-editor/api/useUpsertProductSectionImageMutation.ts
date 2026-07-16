'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/shared/api';
import {
  productSectionImageKeys,
  revalidateProductSectionImagesCache,
} from '@/entities/product-section-image';
import type {
  ProductImageSlot,
  ProductSectionImage,
} from '@/entities/product-section-image';

/**
 * 섹션 이미지 슬롯 upsert mutation(단일 multipart PUT).
 * PUT /product-images/:slot (multipart/form-data, 필드명 `file`)
 *   → 백엔드가 R2 업로드 + slot 기준 upsert를 한 번에 처리하고 해당 슬롯 단건을 반환한다.
 *
 * slot당 1행이므로 신규 등록과 교체가 같은 요청이다(별도 create/update 구분 없음).
 *
 * 백엔드 제약: MIME은 image/png|jpeg|webp|gif만 허용, 최대 5MB. 알 수 없는 slot은 400(ParseEnumPipe).
 * 호출부는 catch에서 `extractUploadError(error, fallback)`로 서버 메시지를 노출한다.
 *
 * 성공 시 섹션 이미지 목록 캐시와 서버 캐시(product-section-images 태그)를 무효화한다.
 */
export function useUpsertProductSectionImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      slot,
      file,
    }: {
      slot: ProductImageSlot;
      file: File;
    }) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await axiosInstance.put<ProductSectionImage>(
        `/product-images/${slot}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productSectionImageKeys.all });
      void revalidateProductSectionImagesCache();
    },
  });
}
