'use client';

import Link from 'next/link';
import { SITE } from '@/shared/config/site';

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
      <dt className="text-xs font-medium text-secondary-dark w-20 flex-shrink-0">{label}</dt>
      <dd className="text-sm text-heading-dark break-all">{value}</dd>
    </div>
  );
}

export function SiteInfoSummaryPanel() {
  return (
    <div className="bg-surface-white rounded-xl border border-border-light p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-display font-semibold text-heading-dark">회사 기본 정보</h2>
        <Link
          href="/console/site-info"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-aircok-blue hover:text-aircok-blue/80 transition-colors"
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
      </div>

      <dl className="flex flex-col gap-3">
        <InfoRow label="회사명" value={SITE.name} />
        <InfoRow label="전화번호" value={SITE.contact.phone} />
        <InfoRow label="이메일" value={SITE.contact.email} />
        <InfoRow label="주소" value={SITE.contact.address} />
      </dl>
    </div>
  );
}
