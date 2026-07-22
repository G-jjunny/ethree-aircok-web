'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  mailSettingQueryOptions,
  MailSettingApiError,
} from '@/entities/mail-setting';
import { inquiryFieldsQueryOptions } from '@/entities/inquiry-field';
import { MailSettingForm } from '@/features/mail-setting-form';
import { Button } from '@/shared/ui';

export function AdminMailSettingView() {
  const { data, error, isPending, isError, refetch, isRefetching } = useQuery(
    mailSettingQueryOptions(),
  );

  const { data: fields = [] } = useQuery(inquiryFieldsQueryOptions());

  const isAuthError = error instanceof MailSettingApiError && error.isAuthError;

  return (
    <div>
      {isPending ? (
        <div className="flex flex-col items-center justify-center text-center gap-4 rounded-card border border-hairline bg-surface-white px-6 py-16">
          <p className="text-muted font-body text-sm leading-[1.43] [word-break:keep-all]">
            불러오는 중...
          </p>
        </div>
      ) : isError && isAuthError ? (
        <div className="flex flex-col items-center justify-center text-center gap-4 rounded-card border border-hairline bg-surface-white px-6 py-16">
          <p className="text-error font-body text-sm leading-[1.43] [word-break:keep-all]">
            로그인이 필요합니다.
          </p>
          <Link
            href="/console/login"
            className="inline-flex items-center justify-center bg-brand text-white text-sm font-medium rounded-btn px-4 py-2 min-h-11 hover:bg-brand-hover active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            로그인 페이지로 이동
          </Link>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center text-center gap-4 rounded-card border border-hairline bg-surface-white px-6 py-16">
          <p className="text-error font-body text-sm leading-[1.43] [word-break:keep-all]">
            이메일 설정을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
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
        <MailSettingForm initialData={data} fields={fields} />
      )}
    </div>
  );
}
