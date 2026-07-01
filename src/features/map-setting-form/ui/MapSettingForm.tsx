'use client';

import { useState } from 'react';
import Script from 'next/script';
import { useForm, useWatch } from 'react-hook-form';
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
// Window.daum 전역 타입 augmentation (슬라이스 로컬)
import '../model/daum';

const DAUM_POSTCODE_SRC =
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

interface Props {
  initialData: MapSetting;
}

export function MapSettingForm({ initialData }: Props) {
  const queryClient = useQueryClient();

  // 재마운트 시 스크립트가 이미 로드된 경우를 즉시 감지한다.
  // lazy initializer는 마운트 시 한 번만 실행되므로 useEffect 없이 안전하다.
  const [isPostcodeReady, setIsPostcodeReady] = useState(
    () => typeof window !== 'undefined' && !!(window.daum?.Postcode),
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MapSettingFormValues>({
    resolver: zodResolver(mapSettingSchema),
    defaultValues: {
      address: initialData.address,
    },
  });

  // 주소 검색 팝업 실행: 스크립트 로드 + window.daum 존재 가드
  const handleSearchAddress = () => {
    if (!window.daum?.Postcode) {
      toast.error('주소 검색 모듈을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        // 도로명 주소 우선, 없으면 지번 주소 사용
        const selected = data.roadAddress || data.jibunAddress;
        // RHF setValue로 채워야 watch('address') 미리보기가 자동 갱신됨
        setValue('address', selected, {
          shouldValidate: true,
          shouldDirty: true,
        });
      },
    }).open();
  };

  // 입력 중 주소를 실시간 구독해 미리보기 지도를 갱신
  const watchedAddress = useWatch({ control, name: 'address' });
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
      {/* Daum 우편번호 스크립트: 클라이언트에서 지연 로드, 완료 시 상태 갱신 */}
      <Script
        src={DAUM_POSTCODE_SRC}
        strategy="afterInteractive"
        onLoad={() => setIsPostcodeReady(true)}
        onError={() => toast.error('주소 검색 모듈을 불러오지 못했습니다. 페이지를 새로고침해 주세요.')}
      />

      {/* 회사 주소 */}
      <div className="flex flex-col gap-1">
        <label className="text-body-dark text-sm font-body font-medium">
          회사 주소 <span className="text-error">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            {...register('address')}
            className="flex-1 border border-border-light bg-surface-light rounded-md px-3 py-2 text-body-dark text-sm font-body cursor-default focus:outline-none"
            placeholder="주소 검색 버튼으로 입력하세요"
          />
          <button
            type="button"
            onClick={handleSearchAddress}
            disabled={!isPostcodeReady}
            className="shrink-0 px-4 py-2 bg-aircok-blue text-heading-light text-sm font-body rounded-md hover:bg-aircok-blue-dark transition-colors disabled:opacity-50"
          >
            {isPostcodeReady ? '주소 검색' : '로딩 중...'}
          </button>
        </div>
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
