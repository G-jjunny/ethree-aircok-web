'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AdminCard } from '@/shared/ui';
import { SITE } from '@/shared/config/site';
import { siteInfoQueryOptions } from '@/entities/site-info';

// Footer와 동일한 폴백 헬퍼 — API가 빈 문자열/공백을 반환해도 SITE 상수로 폴백한다.
function pick(apiValue: string | null | undefined, fallback: string): string {
  return apiValue?.trim() ? apiValue : fallback;
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
      <dt className="text-xs font-medium text-muted w-20 flex-shrink-0">{label}</dt>
      <dd className="text-sm text-ink break-all">{value}</dd>
    </div>
  );
}

export function SiteInfoSummaryPanel() {
  // site-info API 우선, 로딩/에러 시 SITE 상수로 폴백해 패널이 항상 렌더되도록 한다.
  const { data: siteInfo } = useQuery(siteInfoQueryOptions());

  return (
    <AdminCard
      title="회사 기본 정보"
      actions={
        <Link
          href="/console/site-info"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
          수정
        </Link>
      }
    >
      <dl className="flex flex-col gap-3">
        <InfoRow label="회사명" value={pick(siteInfo?.companyName, SITE.name)} />
        <InfoRow label="전화번호" value={pick(siteInfo?.phone, SITE.contact.phone)} />
        <InfoRow label="이메일" value={pick(siteInfo?.email, SITE.contact.email)} />
        <InfoRow label="주소" value={pick(siteInfo?.address, SITE.contact.address)} />
      </dl>
    </AdminCard>
  );
}
