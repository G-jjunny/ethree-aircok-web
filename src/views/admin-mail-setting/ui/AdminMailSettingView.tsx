'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  mailSettingQueryOptions,
  MailSettingApiError,
} from '@/entities/mail-setting';
import { MailSettingForm } from '@/features/mail-setting-form';

export function AdminMailSettingView() {
  const { data, error, isPending, isError, refetch, isRefetching } = useQuery(
    mailSettingQueryOptions(),
  );

  const isAuthError = error instanceof MailSettingApiError && error.isAuthError;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading-dark font-display font-semibold text-2xl">
          이메일 설정
        </h1>
      </div>

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
            이메일 설정을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="inline-flex items-center justify-center bg-surface-light text-heading-dark text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-border-light active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-surface-light disabled:active:scale-100"
          >
            {isRefetching ? '다시 시도 중...' : '다시 시도'}
          </button>
        </div>
      ) : (
        <MailSettingForm initialData={data} />
      )}
    </div>
  );
}
