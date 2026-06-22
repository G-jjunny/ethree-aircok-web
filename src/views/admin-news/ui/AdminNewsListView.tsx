'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  adminNewsQueryOptions,
  AdminNewsApiError,
  type NewsListResponse,
} from '@/entities/news';
import { DeleteButton } from './DeleteButton';

function formatDate(dateStr: string): string {
  return dateStr.slice(0, 10).replace(/-/g, '.');
}

export function AdminNewsListView() {
  const { data, error, isPending, isError, refetch, isRefetching } = useQuery(
    adminNewsQueryOptions(1, 100),
  );

  const isAuthError = error instanceof AdminNewsApiError && error.isAuthError;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading-dark font-display font-semibold text-2xl">
          뉴스 관리
        </h1>
        <Link
          href="/console/news/new"
          className="inline-flex items-center justify-center bg-aircok-blue text-heading-light text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
        >
          새 뉴스 작성
        </Link>
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
            뉴스 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
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
      ) : data.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center gap-4 rounded-xl border border-border-light bg-surface-white px-6 py-16">
          <p className="text-body-dark font-body text-[15px] leading-[1.43] [word-break:keep-all]">
            등록된 뉴스가 없습니다.
          </p>
          <Link
            href="/console/news/new"
            className="inline-flex items-center justify-center bg-aircok-blue text-heading-light text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
          >
            새 뉴스 작성
          </Link>
        </div>
      ) : (
        <NewsTable data={data} />
      )}
    </div>
  );
}

function NewsTable({ data }: { data: NewsListResponse }) {
  return (
    <div className="border border-border-light rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-surface-light">
          <tr>
            <th className="text-left px-4 py-3 text-body-dark font-body font-medium">
              제목
            </th>
            <th className="text-left px-4 py-3 text-body-dark font-body font-medium w-28">
              날짜
            </th>
            <th className="text-left px-4 py-3 text-body-dark font-body font-medium w-20">
              발행
            </th>
            <th className="text-left px-4 py-3 text-body-dark font-body font-medium w-24">
              관리
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light">
          {data.data.map((item) => (
            <tr key={item.id} className="hover:bg-surface-light transition-colors">
              <td className="px-4 py-3 text-body-dark font-body">
                {item.title}
              </td>
              <td className="px-4 py-3 text-secondary-dark font-body">
                {formatDate(item.date)}
              </td>
              <td className="px-4 py-3 font-body">
                {item.published ? (
                  <span className="text-success">발행됨</span>
                ) : (
                  <span className="text-secondary-dark">미발행</span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/console/news/${item.id}/edit`}
                    className="text-link-on-light text-sm hover:opacity-70 transition-opacity"
                  >
                    수정
                  </Link>
                  <DeleteButton id={item.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
