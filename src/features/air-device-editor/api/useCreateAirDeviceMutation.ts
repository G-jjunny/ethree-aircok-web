'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/shared/api';
import { airDeviceKeys, revalidateAirDeviceCache } from '@/entities/air-device';
import type { AirDevice, AirDeviceInput } from '@/entities/air-device';

/**
 * 측정기 생성 mutation.
 * POST /air-devices (application/json) → 생성된 단건(items 포함, 201)을 반환한다.
 *
 * body에 `imageUrl`을 넣지 않는다 — 백엔드 ValidationPipe가 forbidNonWhitelisted이므로 400이다.
 * 제품 사진은 생성 후 useUploadAirDeviceImageMutation(multipart)으로 별도 업로드한다.
 * items 요소는 {@link AirDeviceItemInput}(code/label)만 담는다(id/order 전송 시 400).
 *
 * 성공 시 목록 캐시(공개+어드민)와 서버 캐시(air-devices 태그)를 무효화한다.
 */
export function useCreateAirDeviceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: AirDeviceInput) => {
      const { data } = await axiosInstance.post<AirDevice>('/air-devices', body);
      return data;
    },
    onSuccess: () => {
      // airDeviceKeys.admin은 all을 prefix로 가지므로 all 무효화로 어드민 캐시까지 함께 갱신된다.
      queryClient.invalidateQueries({ queryKey: airDeviceKeys.all });
      void revalidateAirDeviceCache();
    },
  });
}
