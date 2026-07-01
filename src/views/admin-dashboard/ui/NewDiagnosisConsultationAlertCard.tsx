'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { newDiagnosisConsultationCountQueryOptions } from '@/entities/diagnosis-consultation'

export function NewDiagnosisConsultationAlertCard() {
  const { data: count, isLoading } = useQuery(
    newDiagnosisConsultationCountQueryOptions(),
  )

  const hasNew = typeof count === 'number' && count > 0

  return (
    <Link
      href="/console/diagnosis-images"
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
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
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
          신규 진단서비스 신청 알림
        </span>
        <span className="text-sm text-secondary-dark leading-snug">
          {isLoading
            ? '불러오는 중...'
            : hasNew
              ? `미확인 신청이 ${count}건 있습니다`
              : '새로운 신청이 없습니다'}
        </span>
      </div>

      {hasNew && (
        <span className="ml-auto flex-shrink-0 inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-pill bg-aircok-blue text-heading-light text-xs font-bold">
          {count}
        </span>
      )}
    </Link>
  )
}
