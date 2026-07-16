'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/shared/api';
import { airDeviceKeys, revalidateAirDeviceCache } from '@/entities/air-device';
import type { AirDevice, AirDeviceUpdateInput } from '@/entities/air-device';

/**
 * 측정기 부분 수정 mutation.
 * PATCH /air-devices/:id (application/json) → 갱신된 단건(items 포함)을 반환한다.
 *
 * body에 `imageUrl`을 넣지 않는다(forbidNonWhitelisted → 400). 사진 교체는 이미지 업로드 훅을 쓴다.
 *
 * ⚠️ items는 replace-all이다 — 미전달=기존 유지, 배열 전달=전부 삭제 후 재생성, []=전부 삭제.
 * 따라서 "항목 1개만 수정"이라도 **항목 전체 배열**을 보내야 나머지가 유실되지 않는다.
 *
 * 성공 시 목록 캐시(공개+어드민)와 서버 캐시(air-devices 태그)를 무효화한다.
 */
export function useUpdateAirDeviceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: AirDeviceUpdateInput;
    }) => {
      const { data } = await axiosInstance.patch<AirDevice>(
        `/air-devices/${id}`,
        body,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: airDeviceKeys.all });
      void revalidateAirDeviceCache();
    },
  });
}
