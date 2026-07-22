'use client';

import { useState } from 'react';
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
import { Button } from '@/shared/ui';
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

const STATUS_LABELS: Record<string, string> = {
  NEW: '신규',
  IN_PROGRESS: '처리 중',
  DONE: '완료',
};

const STATUS_CLASSES: Record<string, string> = {
  NEW: 'bg-brand/10 text-brand',
  IN_PROGRESS: 'bg-warning/10 text-warning',
  DONE: 'bg-success/10 text-success',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium font-body ${
        STATUS_CLASSES[status] ?? 'bg-surface text-muted'
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
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
            문의 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
          {/* min-h-11(44px) 은 Button size="sm" 에 없는 터치 타겟 보정 — 기존 min-h-11 승계 */}
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
      ) : data.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center gap-4 rounded-card border border-hairline bg-surface-white px-6 py-16">
          <p className="text-ink-soft font-body text-sm leading-[1.43] [word-break:keep-all]">
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
  const [selectedItem, setSelectedItem] = useState<InquirySummary | null>(null);

  return (
    <>
      <div className="border border-hairline rounded-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 text-ink-soft font-body font-medium whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              <th className="text-left px-4 py-3 text-ink-soft font-body font-medium w-28">
                상태
              </th>
              <th className="text-left px-4 py-3 text-ink-soft font-body font-medium w-36">
                일시
              </th>
              <th className="text-left px-4 py-3 text-ink-soft font-body font-medium w-20">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {items.map((item) => {
              const answers = resolveAnswers(item);
              return (
                <tr
                  key={item.id}
                  className="hover:bg-surface transition-colors align-top cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-ink-soft font-body [word-break:keep-all]"
                    >
                      {truncate(answers[col.key] ?? '', 40)}
                    </td>
                  ))}
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <StatusSelect id={item.id} status={item.status} />
                  </td>
                  <td className="px-4 py-3 text-muted font-body whitespace-nowrap">
                    {formatDateTime(item.createdAt)}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <DeleteButton id={item.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 배경 오버레이 */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSelectedItem(null)}
          aria-hidden="true"
        />
      )}

      {/* 슬라이드오버 패널 */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-surface-white border-l border-hairline z-50 flex flex-col shadow-card transition-transform duration-300 ${
          selectedItem ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="문의 상세보기"
      >
        {selectedItem && (
          <>
            {/* 패널 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline shrink-0">
              {/* token 없음: 17px Body 스케일 — globals.css에 --font-size-body 미정의, Tailwind 기본 text-base(16px)·text-lg(18px) 사이 수치 */}
              <h2 className="text-lead font-display font-semibold text-ink [word-break:keep-all] truncate pr-4">
                {Object.values(resolveAnswers(selectedItem))[0] ?? '문의 상세'}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="shrink-0 p-2 rounded-btn text-muted hover:text-ink hover:bg-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                aria-label="닫기"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* 패널 본문 */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* 상태 + 접수일시 */}
              <div className="flex items-center gap-3 mb-6">
                <StatusBadge status={selectedItem.status} />
                <span className="text-sm text-muted font-body">
                  {formatDateTime(selectedItem.createdAt)}
                </span>
              </div>

              {/* 답변 필드 목록 */}
              <dl className="flex flex-col gap-4">
                {Object.entries(resolveAnswers(selectedItem)).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <dt className="text-sm font-body font-medium text-muted [word-break:keep-all]">
                      {columns.find((c) => c.key === key)?.label ?? key}
                    </dt>
                    <dd className="text-sm font-body text-ink leading-[1.5] [word-break:keep-all] whitespace-pre-wrap">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </>
        )}
      </div>
    </>
  );
}
