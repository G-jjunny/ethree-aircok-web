'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  adminInquiryQueryOptions,
  InquiryApiError,
  type InquirySummary,
} from '@/entities/inquiry';
import {
  inquiryFieldsQueryOptions,
  type InquiryField,
} from '@/entities/inquiry-field';
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

/** legacy 고정 컬럼 → answers 형태로 정규화하는 폴백 매핑 */
const LEGACY_KEYS: { key: string; label: string }[] = [
  { key: 'company', label: '회사' },
  { key: 'name', label: '담당자' },
  { key: 'email', label: '이메일' },
  { key: 'phone', label: '전화' },
  { key: 'message', label: '요청사항' },
];

/**
 * 한 문의 행의 답변 맵을 구한다.
 * answers가 비어 있으면(과거 데이터) 고정 컬럼을 answers 형태로 폴백한다.
 */
function resolveAnswers(item: InquirySummary): Record<string, string> {
  if (item.answers && Object.keys(item.answers).length > 0) {
    return item.answers;
  }
  const fallback: Record<string, string> = {};
  for (const { key } of LEGACY_KEYS) {
    const value = item[key as keyof InquirySummary];
    if (typeof value === 'string' && value.length > 0) fallback[key] = value;
  }
  return fallback;
}

export function AdminInquiryListView() {
  const {
    data,
    error,
    isPending,
    isError,
    refetch,
    isRefetching,
  } = useQuery(adminInquiryQueryOptions(1, 100));

  // 필드 정의는 헤더 라벨 매핑용 — 실패해도 목록 표시는 막지 않는다.
  const { data: fields } = useQuery(inquiryFieldsQueryOptions());

  const isAuthError = error instanceof InquiryApiError && error.isAuthError;

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
        <InquiryTable items={data.data} fields={fields ?? []} />
      )}
    </div>
  );
}

/**
 * 표시할 동적 컬럼(key→label) 목록을 산출한다.
 * 1) 필드 정의(order)에 있는 key는 정의 label로,
 * 2) 정의에 없지만 데이터에 등장하는 key(legacy 포함)는 보강해 컬럼화한다.
 */
function buildColumns(
  items: InquirySummary[],
  fields: InquiryField[],
): { key: string; label: string }[] {
  const columns: { key: string; label: string }[] = [];
  const seen = new Set<string>();

  for (const field of fields) {
    columns.push({ key: field.key, label: field.label });
    seen.add(field.key);
  }

  const legacyLabel = new Map(LEGACY_KEYS.map((l) => [l.key, l.label]));

  for (const item of items) {
    const answers = resolveAnswers(item);
    for (const key of Object.keys(answers)) {
      if (seen.has(key)) continue;
      seen.add(key);
      columns.push({ key, label: legacyLabel.get(key) ?? key });
    }
  }

  return columns;
}

function InquiryTable({
  items,
  fields,
}: {
  items: InquirySummary[];
  fields: InquiryField[];
}) {
  const columns = buildColumns(items, fields);

  return (
    <div className="border border-border-light rounded-xl overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-surface-light">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-4 py-3 text-body-dark font-body font-medium whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
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
          {items.map((item) => {
            const answers = resolveAnswers(item);
            return (
              <tr
                key={item.id}
                className="hover:bg-surface-light transition-colors align-top"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-body-dark font-body [word-break:keep-all]"
                  >
                    {truncate(answers[col.key] ?? '', 40)}
                  </td>
                ))}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
