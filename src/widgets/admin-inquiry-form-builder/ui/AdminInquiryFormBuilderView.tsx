'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  inquiryFieldsQueryOptions,
  InquiryFieldApiError,
  type InquiryField,
} from '@/entities/inquiry-field'
import { InquiryFieldForm } from '@/features/inquiry-field-form'
import { FieldRow } from './FieldRow'

export function AdminInquiryFormBuilderView() {
  const { data, error, isPending, isError, refetch, isRefetching } = useQuery(
    inquiryFieldsQueryOptions(),
  )

  const isAuthError =
    error instanceof InquiryFieldApiError && error.isAuthError

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
            문의 필드를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
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
        <BuilderBody fields={data} />
      )}
    </div>
  )
}

function BuilderBody({ fields }: { fields: InquiryField[] }) {
  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* 필드 목록 */}
      <section className="flex flex-col gap-3">
        <h2 className="text-heading-dark font-display font-semibold text-lg">
          문의 폼 필드
        </h2>
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center gap-4 rounded-xl border border-border-light bg-surface-white px-6 py-12">
            <p className="text-body-dark font-body text-[15px] leading-[1.43] [word-break:keep-all]">
              등록된 필드가 없습니다. 아래에서 첫 필드를 추가하세요.
            </p>
          </div>
        ) : (
          <ul className="border border-border-light rounded-xl divide-y divide-border-light">
            {fields.map((field, index) => (
              <FieldRow
                key={field.id}
                field={field}
                prev={index > 0 ? fields[index - 1] : undefined}
                next={index < fields.length - 1 ? fields[index + 1] : undefined}
              />
            ))}
          </ul>
        )}
      </section>

      {/* 새 필드 추가 */}
      <section className="flex flex-col gap-3">
        <h2 className="text-heading-dark font-display font-semibold text-lg">
          새 필드 추가
        </h2>
        <InquiryFieldForm />
      </section>
    </div>
  )
}
