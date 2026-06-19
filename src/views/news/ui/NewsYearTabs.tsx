'use client';

import { useRef } from 'react';

export type SelectedYear = 'all' | number;

interface Props {
  /** 내림차순 정렬된 연도 배열 (예: [2026, 2025, 2024]) */
  years: number[];
  selectedYear: SelectedYear;
  onSelectYear: (year: SelectedYear) => void;
  /** 'all' + 각 연도별 기사 수 배지 */
  counts: Record<SelectedYear, number>;
  /** 활성 탭과 tabpanel 연결용 (aria-controls 대상 id) */
  panelId?: string;
}

const TAB_BASE =
  'shrink-0 rounded-pill px-5 py-2 min-h-[44px] text-[15px] font-medium transition-colors tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2';
const TAB_ACTIVE = `${TAB_BASE} bg-aircok-blue text-heading-light`;
const TAB_INACTIVE = `${TAB_BASE} bg-transparent text-body-dark hover:bg-surface-light`;

/**
 * News Year Filter Tab (연도별 필터 탭) — design.md §4.
 * §8 Category Tab pill 스타일 재활용 + 타임라인 축 구분선 변형.
 * "전체" 칩과 연도 칩(내림차순) 사이에 얇은 세로 구분선을 둔다.
 */
export function NewsYearTabs({
  years,
  selectedYear,
  onSelectYear,
  counts,
  panelId,
}: Props) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 좌우 화살표 키보드 탐색 (전체 + 연도들을 단일 순서 배열로 취급)
  const orderedValues: SelectedYear[] = ['all', ...years];

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const next =
      (index + dir + orderedValues.length) % orderedValues.length;
    tabRefs.current[next]?.focus();
    onSelectYear(orderedValues[next]);
  };

  const renderBadge = (value: SelectedYear, isActive: boolean) => (
    <span
      aria-hidden="true"
      className={
        isActive
          ? 'text-[12px] text-heading-light/70 ml-1.5 tabular-nums'
          : 'text-[12px] text-secondary-dark bg-surface-light rounded-pill px-1.5 py-0.5 ml-1.5 tabular-nums'
      }
    >
      {counts[value]}
    </span>
  );

  return (
    <div
      role="tablist"
      aria-label="연도별 필터"
      className="flex flex-row items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <button
        ref={(el) => {
          tabRefs.current[0] = el;
        }}
        type="button"
        role="tab"
        aria-selected={selectedYear === 'all'}
        aria-controls={panelId}
        aria-label={`전체 기사 ${counts.all}건`}
        tabIndex={selectedYear === 'all' ? 0 : -1}
        onClick={() => onSelectYear('all')}
        onKeyDown={(e) => handleKeyDown(e, 0)}
        className={selectedYear === 'all' ? TAB_ACTIVE : TAB_INACTIVE}
      >
        전체
        {renderBadge('all', selectedYear === 'all')}
      </button>

      {/* 타임라인 축 구분선 — "전체" 칩과 연도 칩 그룹 분리 */}
      <span
        aria-hidden="true"
        className="shrink-0 w-px h-5 bg-border-light mx-1"
      />

      {years.map((year, i) => {
        const isActive = selectedYear === year;
        return (
          <button
            key={year}
            ref={(el) => {
              tabRefs.current[i + 1] = el;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId}
            aria-label={`${year}년 기사 ${counts[year] ?? 0}건`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelectYear(year)}
            onKeyDown={(e) => handleKeyDown(e, i + 1)}
            className={isActive ? TAB_ACTIVE : TAB_INACTIVE}
          >
            {year}
            {renderBadge(year, isActive)}
          </button>
        );
      })}
    </div>
  );
}
