'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  updateMapSetting,
  mapSettingKeys,
  MapSettingApiError,
  type MapSetting,
} from '@/entities/map-setting';
import {
  mapSettingSchema,
  type MapSettingFormValues,
} from '../model/mapSettingSchema';

interface Props {
  initialData: MapSetting;
}

export function MapSettingForm({ initialData }: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MapSettingFormValues>({
    resolver: zodResolver(mapSettingSchema),
    defaultValues: {
      address: initialData.address,
    },
  });

  // 입력 중 주소를 실시간 구독해 미리보기 지도를 갱신
  const watchedAddress = watch('address');
  const previewSrc = watchedAddress
    ? `https://maps.google.com/maps?q=${encodeURIComponent(
        watchedAddress,
      )}&output=embed`
    : null;

  const onSubmit = async (values: MapSettingFormValues) => {
    try {
      const updated = await updateMapSetting({
        address: values.address,
      });
      queryClient.setQueryData(mapSettingKeys.all, updated);
      // 공개 문의 페이지의 지도 캐시 정합을 위해 무효화
      queryClient.invalidateQueries({ queryKey: mapSettingKeys.all });
      reset({
        address: updated.address,
      });
      toast.success('지도 주소가 저장되었습니다');
    } catch (error) {
      const message =
        error instanceof MapSettingApiError
          ? (error.messages?.[0] ?? error.message)
          : '지도 주소 저장에 실패했습니다. 다시 시도해 주세요.';
      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 max-w-3xl"
    >
      {/* 회사 주소 */}
      <div className="flex flex-col gap-1">
        <label className="text-body-dark text-sm font-body font-medium">
          회사 주소 <span className="text-error">*</span>
        </label>
        <input
          type="text"
          {...register('address')}
          className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-1 focus:ring-aircok-blue"
          placeholder="지도에 표시할 회사 주소"
        />
        {errors.address && (
          <p className="text-error text-xs">{errors.address.message}</p>
        )}
      </div>

      {/* 라이브 지도 미리보기 */}
      <div className="flex flex-col gap-2">
        <p className="text-body-dark text-sm font-body font-medium">
          미리보기
        </p>
        {previewSrc ? (
          <div className="rounded-xl overflow-hidden border border-border-light aspect-video">
            <iframe
              title="지도 주소 미리보기"
              src={previewSrc}
              loading="lazy"
              className="w-full h-full border-none"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-xl border border-border-light aspect-video">
            <p className="text-secondary-dark text-sm font-body [word-break:keep-all]">
              주소를 입력하면 지도 미리보기가 표시됩니다.
            </p>
          </div>
        )}
      </div>

      {/* 제출 버튼 */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-aircok-blue text-heading-light text-sm font-body rounded-md hover:bg-aircok-blue-dark transition-colors disabled:opacity-50"
        >
          {isSubmitting ? '저장 중...' : '설정 저장'}
        </button>
      </div>
    </form>
  );
}
