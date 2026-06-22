'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  adminInquiryQueryOptions,
  InquiryApiError,
  type InquiryListResponse,
} from '@/entities/inquiry';
import { StatusSelect } from './StatusSelect';
import { DeleteButton } from './DeleteButton';

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function AdminInquiryListView() {
  const { data, error, isPending, isError, refetch, isRefetching } = useQuery(
    adminInquiryQueryOptions(1, 100),
  );

  const isAuthError = error instanceof InquiryApiError && error.isAuthError;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading-dark font-display font-semibold text-2xl">
          문의 관리
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
            문의 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
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
            접수된 문의가 없습니다.
          </p>
        </div>
      ) : (
        <InquiryTable data={data} />
      )}
    </div>
  );
}

function InquiryTable({ data }: { data: InquiryListResponse }) {
  return (
    <div className="border border-border-light rounded-xl overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-surface-light">
          <tr>
            <th className="text-left px-4 py-3 text-body-dark font-body font-medium w-32">
              회사
            </th>
            <th className="text-left px-4 py-3 text-body-dark font-body font-medium w-24">
              담당자
            </th>
            <th className="text-left px-4 py-3 text-body-dark font-body font-medium">
              이메일
            </th>
            <th className="text-left px-4 py-3 text-body-dark font-body font-medium w-32">
              전화
            </th>
            <th className="text-left px-4 py-3 text-body-dark font-body font-medium">
              요청사항
            </th>
            <th className="text-left px-4 py-3 text-body-dark font-body font-medium w-28">
              상태
            </th>
            <th className="text-left px-4 py-3 text-body-dark font-body font-medium w-36">
              일시
            </th>
            <th className="text-left px-4 py-3 text-body-dark font-body font-medium w-20">
              관리
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light">
          {data.data.map((item) => (
            <tr key={item.id} className="hover:bg-surface-light transition-colors align-top">
              <td className="px-4 py-3 text-body-dark font-body">
                {item.company}
              </td>
              <td className="px-4 py-3 text-body-dark font-body">{item.name}</td>
              <td className="px-4 py-3 text-secondary-dark font-body break-all">
                {item.email}
              </td>
              <td className="px-4 py-3 text-secondary-dark font-body">
                {item.phone}
              </td>
              <td className="px-4 py-3 text-body-dark font-body [word-break:keep-all]">
                {truncate(item.message, 40)}
              </td>
              <td className="px-4 py-3">
                <StatusSelect id={item.id} status={item.status} />
              </td>
              <td className="px-4 py-3 text-secondary-dark font-body whitespace-nowrap">
                {formatDateTime(item.createdAt)}
              </td>
              <td className="px-4 py-3">
                <DeleteButton id={item.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
