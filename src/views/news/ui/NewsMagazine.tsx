'use client';

import { useId, useMemo, useState } from 'react';
import type { NewsSummary } from '@/entities/news';
import { SITE } from '@/shared/config';
import { NewsFeaturedSection } from './NewsFeaturedSection';
import { NewsRowListSection } from './NewsRowListSection';
import { NewsSecondaryGridSection } from './NewsSecondaryGridSection';
import { NewsYearTabs, type SelectedYear } from './NewsYearTabs';

interface Props {
  /** 전체 뉴스 목록 (server에서 fetch, 정렬은 API 순서 유지) */
  items: NewsSummary[];
}

/** 주요 기사 row 섹션에 노출할 기사 수 (featured 다음) */
const PRIMARY_ROW_COUNT = 4;

/** ISO date 문자열에서 연도(number) 추출 */
function getYear(date: string): number {
  return new Date(date).getFullYear();
}

/**
 * 뉴스 매거진 목록의 클라이언트 오케스트레이터.
 * - 전체 items에서 연도 추출(중복 제거 + 내림차순)·연도별 카운트 계산
 * - selectedYear 상태에 따라 기사 집합을 필터링 후 매거진 분배
 *   ([featured, ...rest] → primaryRows / secondary)
 * - 상단에 News Year Filter Tab, 아래에 Featured/Row/Secondary 섹션 렌더
 */
export function NewsMagazine({ items }: Props) {
  const [selectedYear, setSelectedYear] = useState<SelectedYear>('all');
  const panelId = useId();

  // 데이터에 존재하는 연도: 중복 제거 + 내림차순
  const years = useMemo(() => {
    const set = new Set<number>();
    for (const item of items) set.add(getYear(item.date));
    return Array.from(set).sort((a, b) => b - a);
  }, [items]);

  // 연도별 + 전체 기사 수 (카운트 배지용)
  const counts = useMemo(() => {
    const map: Record<SelectedYear, number> = { all: items.length };
    for (const year of years) {
      map[year] = items.filter((item) => getYear(item.date) === year).length;
    }
    return map;
  }, [items, years]);

  // 선택 연도 기준 필터링된 기사 집합
  const filtered = useMemo(() => {
    if (selectedYear === 'all') return items;
    return items.filter((item) => getYear(item.date) === selectedYear);
  }, [items, selectedYear]);

  const yearTabs = (
    <NewsYearTabs
      years={years}
      selectedYear={selectedYear}
      onSelectYear={setSelectedYear}
      counts={counts}
      panelId={panelId}
    />
  );

  // 방어적 처리: 선택 연도에 기사가 없는 경우 (연도 탭은 데이터 있는 연도만 노출하므로 보통 발생 안 함)
  if (filtered.length === 0) {
    return (
      <main className="min-h-screen bg-surface-white">
        <section className="bg-surface-light py-16 md:py-20">
          <div className="content-container flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <p className="text-aircok-blue text-sm font-body tracking-widest uppercase">
                NEWS
              </p>
              <h1 className="text-[40px] font-display font-semibold text-heading-dark leading-[1.10] tracking-[-0.3px] [word-break:keep-all]">
                {SITE.pages.news.title}
              </h1>
            </div>
            {yearTabs}
            <div
              id={panelId}
              role="tabpanel"
              className="py-24 text-center"
            >
              <p className="text-secondary-dark font-body text-[17px]">
                해당 연도에 등록된 뉴스가 없습니다.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // 매거진 데이터 분배: 대표 1건 → 주요 row N건 → 나머지 보조 그리드
  const [featured, ...rest] = filtered;
  const primaryRows = rest.slice(0, PRIMARY_ROW_COUNT);
  const secondary = rest.slice(PRIMARY_ROW_COUNT);

  return (
    <main className="min-h-screen bg-surface-white">
      <NewsFeaturedSection item={featured} filterSlot={yearTabs} />
      <div id={panelId} role="tabpanel">
        <NewsRowListSection items={primaryRows} />
        <NewsSecondaryGridSection items={secondary} />
      </div>
    </main>
  );
}
