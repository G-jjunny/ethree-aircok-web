'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/shared/api';
import { airDeviceKeys, revalidateAirDeviceCache } from '@/entities/air-device';

/**
 * 측정기 삭제 mutation.
 * DELETE /air-devices/:id → 204 No Content(본문 없음).
 * 성공 시 목록 캐시(공개+어드민)와 서버 캐시(air-devices 태그)를 무효화한다.
 */
export function useDeleteAirDeviceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/air-devices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: airDeviceKeys.all });
      void revalidateAirDeviceCache();
    },
  });
}
