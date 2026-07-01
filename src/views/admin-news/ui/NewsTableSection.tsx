'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import type { NewsSummary } from '@/entities/news';
import { DeleteButton } from './DeleteButton';

const PAGE_SIZE = 20;

interface Props {
  items: NewsSummary[];
}

function formatDate(dateStr: string): string {
  return dateStr.slice(0, 10).replace(/-/g, '.');
}

function TypeBadge({ type }: { type: NewsSummary['type'] }) {
  if (type === 'BLOG') {
    return (
      <span className="inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-semibold bg-aircok-blue/10 text-aircok-blue">
        블로그
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-semibold bg-success/10 text-success">
      링크
    </span>
  );
}

function PreviewPanel({
  item,
  onClose,
}: {
  item: NewsSummary;
  onClose: () => void;
}) {
  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 bg-overlay-dark-60 z-40"
        onClick={onClose}
      />
      {/* 패널 */}
      <div className="fixed inset-y-0 right-0 w-96 bg-surface-white shadow-card z-50 flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
          <h3 className="text-body-dark text-base font-body font-semibold">미리보기</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary-dark hover:text-body-dark transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* 내용 */}
        <div className="flex flex-col gap-4 px-6 py-5 flex-1 overflow-y-auto">
          {/* 타입 배지 */}
          <TypeBadge type={item.type} />

          {/* 제목 */}
          <h4 className="text-body-dark font-body font-semibold text-base leading-snug [word-break:keep-all]">
            {item.title}
          </h4>

          {/* 설명 */}
          <p className="text-secondary-dark font-body text-sm leading-relaxed [word-break:keep-all]">
            {item.description}
          </p>

          {/* 날짜 */}
          <div className="text-secondary-dark text-xs font-body">
            날짜: {formatDate(item.date)}
          </div>

          {/* 발행 상태 */}
          <div>
            {item.published ? (
              <span className="inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-semibold bg-success/10 text-success">
                발행됨
              </span>
            ) : (
              <span className="inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-semibold bg-surface-light text-secondary-dark">
                미발행
              </span>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col gap-2 px-6 py-4 border-t border-border-light">
          {item.type === 'LINK' && item.externalUrl && (
            <a
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-aircok-blue text-aircok-blue text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-surface-light transition-colors"
            >
              기사 보기 ↗
            </a>
          )}
          <Link
            href={`/console/news/${item.id}/edit`}
            className="inline-flex items-center justify-center bg-aircok-blue text-heading-light text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-aircok-blue-dark transition-colors"
          >
            수정하기
          </Link>
        </div>
      </div>
    </>
  );
}

export function NewsTableSection({ items }: Props) {
  const [selectedItem, setSelectedItem] = useState<NewsSummary | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const prevItemsRef = useRef(items);

  useEffect(() => {
    if (prevItemsRef.current !== items) {
      prevItemsRef.current = items;
      setCurrentPage(1);
    }
  }, [items]);

  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const pagedItems = items.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="bg-surface-white rounded-xl border border-border-light overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="bg-surface-light border-b border-border-light">
          <tr>
            {/* text-[13px]: token 없음 — 테이블 헤더 전용 중간 캡션 크기(xs=12px, sm=14px 사이) */}
            <th className="text-left px-4 py-3 text-[13px] font-semibold text-secondary-dark uppercase tracking-wide">
              제목
            </th>
            <th className="text-left px-4 py-3 text-[13px] font-semibold text-secondary-dark uppercase tracking-wide w-28">
              날짜
            </th>
            <th className="text-left px-4 py-3 text-[13px] font-semibold text-secondary-dark uppercase tracking-wide w-20">
              타입
            </th>
            <th className="text-left px-4 py-3 text-[13px] font-semibold text-secondary-dark uppercase tracking-wide w-24">
              발행
            </th>
            <th className="text-left px-4 py-3 text-[13px] font-semibold text-secondary-dark uppercase tracking-wide w-24">
              관리
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light">
          {pagedItems.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-surface-light transition-colors cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <td className="px-4 py-4 text-nav text-body-dark font-body max-w-xs truncate">
                {item.title}
              </td>
              <td className="px-4 py-4 text-nav text-secondary-dark font-body">
                {formatDate(item.date)}
              </td>
              <td className="px-4 py-4">
                <TypeBadge type={item.type} />
              </td>
              <td className="px-4 py-4">
                {item.published ? (
                  <span className="inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-semibold bg-success/10 text-success">
                    발행됨
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-semibold bg-surface-light text-secondary-dark">
                    미발행
                  </span>
                )}
              </td>
              <td
                className="px-4 py-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3">
                  <Link
                    href={`/console/news/${item.id}/edit`}
                    className="text-[13px] text-aircok-blue hover:underline font-medium"
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

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border-light">
          {/* text-[13px]: token 없음 — 테이블 캡션 전용 중간 크기(xs=12px, sm=14px 사이) */}
          <p className="text-secondary-dark text-[13px] font-body">
            {items.length}개 중{' '}
            {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, items.length)}개 표시
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded text-sm font-body transition-colors text-body-dark hover:bg-surface-light disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded text-sm font-body transition-colors ${
                  page === currentPage
                    ? 'bg-aircok-blue text-heading-light'
                    : 'text-body-dark hover:bg-surface-light'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded text-sm font-body transition-colors text-body-dark hover:bg-surface-light disabled:opacity-40 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* 미리보기 패널 */}
      {selectedItem && (
        <PreviewPanel
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
