'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { newInquiryCountQueryOptions } from '@/entities/inquiry';

export function NewInquiryAlertCard() {
  const { data: count, isLoading } = useQuery(newInquiryCountQueryOptions());

  const hasNew = typeof count === 'number' && count > 0;

  return (
    <Link
      href="/console/inquiries"
      className={[
        'group rounded-xl border p-5 flex items-center gap-4 transition-all',
        hasNew
          ? 'bg-aircok-blue/5 border-aircok-blue/40 hover:bg-aircok-blue/10 hover:shadow-card'
          : 'bg-surface-white border-border-light hover:border-aircok-blue/40 hover:shadow-card',
      ].join(' ')}
    >
      <div
        className={[
          'inline-flex items-center justify-center w-11 h-11 rounded-lg flex-shrink-0',
          hasNew ? 'bg-aircok-blue text-heading-light' : 'bg-aircok-blue/10 text-aircok-blue',
        ].join(' ')}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className={[
            'text-nav font-display font-semibold transition-colors',
            hasNew
              ? 'text-aircok-blue'
              : 'text-heading-dark group-hover:text-aircok-blue',
          ].join(' ')}
        >
          신규 문의 알림
        </span>
        <span className="text-sm text-secondary-dark leading-snug">
          {isLoading
            ? '불러오는 중...'
            : hasNew
              ? `미확인 문의가 ${count}건 있습니다`
              : '새로운 문의가 없습니다'}
        </span>
      </div>

      {hasNew && (
        <span className="ml-auto flex-shrink-0 inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-pill bg-aircok-blue text-heading-light text-xs font-bold">
          {count}
        </span>
      )}
    </Link>
  );
}
