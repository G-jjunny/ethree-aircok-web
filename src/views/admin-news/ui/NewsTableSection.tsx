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
      <span className="inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-semibold bg-brand/10 text-brand">
        블로그
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-semibold bg-success/10 text-success">
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
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-surface-white shadow-card z-50 flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline">
          <h3 className="text-ink-soft text-base font-body font-semibold">미리보기</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-ink-soft transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* 내용 */}
        <div className="flex flex-col gap-4 px-6 py-5 flex-1 overflow-y-auto">
          {/* 타입 배지 */}
          <TypeBadge type={item.type} />

          {/* 제목 */}
          <h4 className="text-ink-soft font-body font-semibold text-base leading-snug [word-break:keep-all]">
            {item.title}
          </h4>

          {/* 설명 */}
          <p className="text-muted font-body text-sm leading-relaxed [word-break:keep-all]">
            {item.description}
          </p>

          {/* 날짜 */}
          <div className="text-muted text-xs font-body">
            날짜: {formatDate(item.date)}
          </div>

          {/* 발행 상태 */}
          <div>
            {item.published ? (
              <span className="inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-semibold bg-success/10 text-success">
                발행됨
              </span>
            ) : (
              <span className="inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-semibold bg-surface text-muted">
                미발행
              </span>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col gap-2 px-6 py-4 border-t border-hairline">
          {item.type === 'LINK' && item.externalUrl && (
            <a
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-brand text-brand text-sm font-medium rounded-btn px-4 py-2 min-h-11 hover:bg-surface transition-colors"
            >
              기사 보기 ↗
            </a>
          )}
          <Link
            href={`/console/news/${item.id}/edit`}
            className="inline-flex items-center justify-center bg-brand text-white text-sm font-medium rounded-btn px-4 py-2 min-h-11 hover:bg-brand-hover transition-colors"
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
    <div className="bg-surface-white rounded-card border border-hairline overflow-hidden">
      {/* 모바일(가용 312px)에서 표가 붕괴하지 않도록 표 영역만 가로 스크롤 — 라운드 카드 시각은 바깥 래퍼가 유지 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
        <thead className="bg-surface border-b border-hairline">
          <tr>
            {/* text-[13px]: token 없음 — 테이블 헤더 전용 중간 캡션 크기(xs=12px, sm=14px 사이) */}
            <th className="text-left px-4 py-3 text-[13px] font-semibold text-muted uppercase tracking-wide">
              제목
            </th>
            <th className="text-left px-4 py-3 text-[13px] font-semibold text-muted uppercase tracking-wide w-28">
              날짜
            </th>
            <th className="text-left px-4 py-3 text-[13px] font-semibold text-muted uppercase tracking-wide w-20">
              타입
            </th>
            <th className="text-left px-4 py-3 text-[13px] font-semibold text-muted uppercase tracking-wide w-24">
              발행
            </th>
            <th className="text-left px-4 py-3 text-[13px] font-semibold text-muted uppercase tracking-wide w-24">
              관리
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {pagedItems.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-surface transition-colors cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <td className="px-4 py-4 text-sm text-ink-soft font-body min-w-45 max-w-xs truncate">
                {item.title}
              </td>
              <td className="px-4 py-4 text-sm text-muted font-body whitespace-nowrap">
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
                  <span className="inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-semibold bg-surface text-muted">
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
                    className="text-[13px] text-brand hover:underline font-medium"
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

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-hairline">
          {/* text-[13px]: token 없음 — 테이블 캡션 전용 중간 크기(xs=12px, sm=14px 사이) */}
          <p className="text-muted text-[13px] font-body">
            {items.length}개 중{' '}
            {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, items.length)}개 표시
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded text-sm font-body transition-colors text-ink-soft hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
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
                    ? 'bg-brand text-white'
                    : 'text-ink-soft hover:bg-surface'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded text-sm font-body transition-colors text-ink-soft hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
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
