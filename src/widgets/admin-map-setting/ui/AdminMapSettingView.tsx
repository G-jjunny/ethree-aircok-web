'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  mapSettingQueryOptions,
  MapSettingApiError,
} from '@/entities/map-setting';
import { MapSettingForm } from '@/features/map-setting-form';
import { Button } from '@/shared/ui';

export function AdminMapSettingView() {
  const { data, error, isPending, isError, refetch, isRefetching } = useQuery(
    mapSettingQueryOptions(),
  );

  const isAuthError = error instanceof MapSettingApiError && error.isAuthError;

  return (
    <div>
      {isPending ? (
        <div className="flex flex-col items-center justify-center text-center gap-4 rounded-xl border border-border-light bg-surface-white px-6 py-16">
          <p className="text-secondary-dark font-body text-[15px] leading-[1.43] [word-break:keep-all]">
            불러오는 중...
          </p>
        </div>
      ) : isError && isAuthError ? (
        <div className="flex flex-col items-center justify-center text-center gap-4 rounded-xl border border-border-light bg-surface-white px-6 py-16">
          <p className="text-error font-body text-[15px] leading-[1.43] [word-break:keep-all]">
            로그인이 필요합니다.
          </p>
          <Link
            href="/console/login"
            className="inline-flex items-center justify-center bg-aircok-blue text-heading-light text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
          >
            로그인 페이지로 이동
          </Link>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center text-center gap-4 rounded-xl border border-border-light bg-surface-white px-6 py-16">
          <p className="text-error font-body text-[15px] leading-[1.43] [word-break:keep-all]">
            지도 설정을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
          {/* min-h-11(44px) 은 Button size="sm" 에 없는 터치 타겟 보정 — 기존 min-h-[44px] 승계 */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="min-h-11"
          >
            {isRefetching ? '다시 시도 중...' : '다시 시도'}
          </Button>
        </div>
      ) : (
        <MapSettingForm initialData={data} />
      )}
    </div>
  );
}
