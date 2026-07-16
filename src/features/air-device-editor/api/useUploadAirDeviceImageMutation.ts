'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/shared/api';
import { airDeviceKeys, revalidateAirDeviceCache } from '@/entities/air-device';
import type { AirDevice } from '@/entities/air-device';

/**
 * 측정기 제품 사진 업로드 mutation(단일 multipart POST).
 * POST /air-devices/:id/image (multipart/form-data, 필드명 `file`)
 *   → 백엔드가 R2 업로드 + imageUrl 갱신을 한 번에 처리하고 갱신된 측정기 단건을 반환한다.
 *
 * imageUrl은 JSON body로 보낼 수 없다(forbidNonWhitelisted → 400) — 사진 등록/교체는 항상 이 경로다.
 *
 * 백엔드 제약: MIME은 image/png|jpeg|webp|gif만 허용, 최대 5MB. 위반 시 400을 반환하므로
 * 호출부는 catch에서 `extractUploadError(error, fallback)`로 서버 메시지를 토스트에 노출한다
 * (기존 업로드 섹션들과 동일한 패턴 — 훅은 에러를 삼키지 않고 그대로 throw한다).
 *
 * 성공 시 목록 캐시(공개+어드민)와 서버 캐시(air-devices 태그)를 무효화한다.
 */
export function useUploadAirDeviceImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await axiosInstance.post<AirDevice>(
        `/air-devices/${id}/image`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: airDeviceKeys.all });
      void revalidateAirDeviceCache();
    },
  });
}
