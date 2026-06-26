'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { timelineListQueryOptions } from '@/entities/timeline'
import type { TimelineItem } from '@/entities/timeline'
import { useDeleteTimelineMutation } from '@/features/timeline-editor'
import { ConfirmDialog } from '@/shared/ui'
import { TimelineFormModal } from './TimelineFormModal'
import { TimelineYearGroup } from './TimelineYearGroup'

/** 연도 그룹 한 덩어리 (프레젠테이션 입력 형태) */
interface YearGroup {
  year: number
  items: TimelineItem[]
}

type YearFilter = 'all' | number

/**
 * 연도 내림차순, 그룹 내 월 내림차순으로 묶는다.
 *
 * ── 프레젠테이션 스캐폴드 ──
 * 그룹화/정렬은 공개 HistorySection과 동일한 규칙을 임시로 따른다.
 * frontend-implementer가 검색어·연도 필터를 반영한 결과로 교체하거나,
 * entities/timeline 셀렉터로 이전해도 된다.
 */
function groupByYear(items: TimelineItem[]): YearGroup[] {
  const map = new Map<number, TimelineItem[]>()
  for (const item of items) {
    if (!map.has(item.year)) map.set(item.year, [])
    map.get(item.year)!.push(item)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, groupItems]) => ({
      year,
      items: [...groupItems].sort((a, b) => b.month - a.month),
    }))
}

export function TimelineManageSection() {
  const { data: items = [], isLoading } = useQuery(timelineListQueryOptions())
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TimelineItem | undefined>(undefined)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // ── 검색 / 필터 / 아코디언 상태 ──
  // 입력 자체는 여기서 제어하되, 이 값들로 groups를 "필터링"하는 로직은
  // frontend-implementer가 아래 [필터 적용 위치]에 끼운다.
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState<YearFilter>('all')
  // null = 사용자가 아직 한 번도 토글하지 않은 초기 상태.
  // 이 경우 펼침셋은 "최신(첫) 연도만"으로 파생 계산한다(시드 effect 불필요).
  const [openYears, setOpenYears] = useState<Set<number> | null>(null)

  const deleteMutation = useDeleteTimelineMutation()

  // ── 필터 적용 + 그룹 파생 ──
  // searchQuery(content 부분일치, 대소문자 무시) + selectedYear(연도) 를 반영해
  // items 를 필터링한 뒤 groupByYear 로 묶는다. 재계산을 막기 위해 useMemo.
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const hasActiveFilter = normalizedQuery !== '' || selectedYear !== 'all'

  const filtered = useMemo(
    () =>
      items.filter(
        (it) =>
          (selectedYear === 'all' || it.year === selectedYear) &&
          (normalizedQuery === '' || it.content.toLowerCase().includes(normalizedQuery)),
      ),
    [items, selectedYear, normalizedQuery],
  )

  const groups = useMemo(() => groupByYear(filtered), [filtered])

  const totalCount = items.length
  const visibleCount = filtered.length

  // 연도 필터 칩용 데이터 — 필터와 무관하게 "전체 items 기준"으로 계산해 칩 밀도 유지.
  const years = useMemo(() => {
    const set = new Set(items.map((it) => it.year))
    return Array.from(set).sort((a, b) => b - a)
  }, [items])

  const counts = useMemo(() => {
    const c: Record<YearFilter, number> = { all: items.length }
    for (const it of items) c[it.year] = (c[it.year] ?? 0) + 1
    return c
  }, [items])

  // 기본 펼침 정책: openYears 가 null(미토글 초기 상태)이면 최신(첫) 연도만 펼친다.
  // 한 번이라도 토글되면 실제 Set 을 그대로 따른다. (시드 effect 없이 파생 계산)
  const effectiveOpenYears = useMemo(
    () => openYears ?? new Set(years.length > 0 ? [years[0]] : []),
    [openYears, years],
  )

  // 검색/연도 필터가 활성일 때는 매칭된 그룹을 모두 펼친다(결과가 접혀 있지 않도록).
  // 필터가 없으면 파생 펼침셋(초기=첫 연도, 토글 후=사용자 상태)을 따른다.
  const isYearOpen = (year: number) => hasActiveFilter || effectiveOpenYears.has(year)

  const toggleYear = (year: number) => {
    setOpenYears((prev) => {
      // 첫 토글이면 현재 파생 펼침셋(첫 연도만)을 기준으로 실제 Set 을 만든다.
      const base = prev ?? new Set(years.length > 0 ? [years[0]] : [])
      const next = new Set(base)
      if (next.has(year)) next.delete(year)
      else next.add(year)
      return next
    })
  }

  const handleDeleteConfirm = () => {
    if (!deletingId) return
    deleteMutation.mutate(deletingId, {
      onSuccess: () => setDeletingId(null),
      onError: () => setDeletingId(null),
    })
  }

  return (
    <section className="bg-surface-white rounded-xl border border-border-light p-6">
      {/* 패널 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col gap-0.5 min-w-0">
          <h2 className="text-nav font-display font-semibold text-heading-dark">연혁 / 타임라인</h2>
          <p className="text-xs text-secondary-dark [word-break:keep-all]">
            소개 페이지 History 섹션에 노출할 연혁을 등록·수정·삭제합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center shrink-0 bg-aircok-blue text-heading-light text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
        >
          연혁 추가
        </button>
      </div>

      {isLoading ? (
        /* 로딩 스켈레톤 — 연도 그룹 헤더 형태 */
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            // h-[52px]: token 없음 — 접힘 그룹 헤더(px-4 py-3.5) 높이 근사, 스켈레톤 전용 1회성 수치
            <div key={i} className="h-[52px] rounded-lg bg-surface-light animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        /* 데이터 자체가 없는 빈 상태 */
        <p className="text-secondary-dark text-sm py-6 text-center">등록된 연혁이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {/* ── 도구 모음: 검색 + 요약 + 연도 필터 ── */}
          <div className="flex flex-col gap-4">
            {/* 검색 입력 + 총 건수 요약 */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-xs">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-dark w-5 h-5 pointer-events-none"
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"
                  />
                </svg>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="연혁 내용 검색"
                  aria-label="연혁 내용 검색"
                  className="w-full bg-surface-light rounded-md px-4 py-3 pl-10 text-[15px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue border-none"
                />
              </div>
              {/* 총 건수 요약 — 필터 활성 시 "표시 N건 / 총 M건" */}
              <p className="text-sm text-secondary-dark tabular-nums shrink-0">
                {hasActiveFilter ? `${visibleCount}건 / 총 ${totalCount}건` : `총 ${totalCount}건`}
              </p>
            </div>

            {/* 연도 필터 칩 (§4 News Year Filter Tab 재활용) */}
            <div
              role="tablist"
              aria-label="연도별 필터"
              className="flex flex-row items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {/* "전체" 칩 */}
              <button
                type="button"
                role="tab"
                aria-selected={selectedYear === 'all'}
                aria-label={`전체 ${counts.all}건`}
                onClick={() => setSelectedYear('all')}
                className={
                  selectedYear === 'all'
                    ? 'shrink-0 rounded-pill px-5 py-2 min-h-[44px] text-[15px] font-medium bg-aircok-blue text-heading-light transition-colors tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2'
                    : 'shrink-0 rounded-pill px-5 py-2 min-h-[44px] text-[15px] font-medium bg-transparent text-body-dark hover:bg-surface-light transition-colors tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2'
                }
              >
                전체
                <span
                  aria-hidden="true"
                  className={
                    selectedYear === 'all'
                      ? 'text-[12px] text-heading-light/70 ml-1.5 tabular-nums'
                      : 'text-[12px] text-secondary-dark bg-surface-light rounded-pill px-1.5 py-0.5 ml-1.5 tabular-nums'
                  }
                >
                  {counts.all}
                </span>
              </button>

              {/* 타임라인 축 구분선 */}
              <span aria-hidden="true" className="shrink-0 w-px h-5 bg-border-light mx-1" />

              {/* 연도 칩 (내림차순) */}
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  role="tab"
                  aria-selected={selectedYear === year}
                  aria-label={`${year}년 ${counts[year]}건`}
                  onClick={() => setSelectedYear(year)}
                  className={
                    selectedYear === year
                      ? 'shrink-0 rounded-pill px-5 py-2 min-h-[44px] text-[15px] font-medium bg-aircok-blue text-heading-light transition-colors tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2'
                      : 'shrink-0 rounded-pill px-5 py-2 min-h-[44px] text-[15px] font-medium bg-transparent text-body-dark hover:bg-surface-light transition-colors tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2'
                  }
                >
                  {year}
                  <span
                    aria-hidden="true"
                    className={
                      selectedYear === year
                        ? 'text-[12px] text-heading-light/70 ml-1.5 tabular-nums'
                        : 'text-[12px] text-secondary-dark bg-surface-light rounded-pill px-1.5 py-0.5 ml-1.5 tabular-nums'
                    }
                  >
                    {counts[year]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── 연도 그룹 아코디언 목록 / 검색 결과 없음 ── */}
          {groups.length === 0 ? (
            /* 검색·필터 결과 없음 (§8 검색 결과 없음 상태) */
            <div className="py-12 text-center">
              <p className="text-[17px] text-secondary-dark [word-break:keep-all]">검색 결과가 없습니다.</p>
              <p className="text-[15px] text-secondary-dark mt-2">다른 키워드나 연도로 검색해 보세요.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {groups.map((group) => (
                <TimelineYearGroup
                  key={group.year}
                  year={group.year}
                  items={group.items}
                  isOpen={isYearOpen(group.year)}
                  onToggle={() => toggleYear(group.year)}
                  onEdit={(item) => setEditingItem(item)}
                  onDelete={(id) => setDeletingId(id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <TimelineFormModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultYear={selectedYear === 'all' ? undefined : selectedYear}
      />

      <TimelineFormModal
        open={editingItem !== undefined}
        onClose={() => setEditingItem(undefined)}
        item={editingItem}
      />

      <ConfirmDialog
        open={deletingId !== null}
        title="연혁 삭제"
        description="이 연혁 항목을 삭제하면 복구할 수 없습니다. 계속하시겠습니까?"
        confirmLabel="삭제"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </section>
  )
}
