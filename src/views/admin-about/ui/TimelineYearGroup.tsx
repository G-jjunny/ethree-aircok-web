'use client'

import type { TimelineItem } from '@/entities/timeline'
import { TimelineRow } from './TimelineRow'

interface TimelineYearGroupProps {
  /** 그룹 연도 (예: 2026) */
  year: number
  /** 이 연도에 속한 항목들. 월 내림차순 정렬은 부모(implementer) 책임 */
  items: TimelineItem[]
  /** 펼침/접힘 상태 — 부모가 openYears 상태로 제어 */
  isOpen: boolean
  /** 헤더 클릭 시 토글 — 부모가 openYears 갱신 */
  onToggle: () => void
  onEdit: (item: TimelineItem) => void
  onDelete: (id: string) => void
}

/**
 * 연혁 관리 — 연도 그룹 아코디언 (프레젠테이션, 시그니처 요소).
 * design.md §15.7 "연도 그룹 (아코디언)" 토큰을 따른다.
 * - 헤더: 회전 chevron + 블루 연도 numeral + N건 배지
 * - 본문: grid-rows 트랜지션으로 접기/펼치기 (§8 아코디언 애니메이션)
 *
 * 그룹화/정렬/펼침 상태 로직은 frontend-implementer가 부모에서 주입한다.
 */
export function TimelineYearGroup({
  year,
  items,
  isOpen,
  onToggle,
  onEdit,
  onDelete,
}: TimelineYearGroupProps) {
  const panelId = `timeline-year-panel-${year}`

  return (
    <div className="rounded-image border border-hairline overflow-hidden">
      {/* 그룹 헤더 (아코디언 토글) */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
      >
        {/* 토글 chevron — 펼침 rotate-0(아래), 접힘 -rotate-90(우측) */}
        <svg
          className={`shrink-0 w-5 h-5 text-muted transition-transform duration-200 ${
            isOpen ? 'rotate-0' : '-rotate-90'
          }`}
          aria-hidden="true"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
        {/* 연도 numeral — 시그니처 (공개 History 블루 numeral의 관리용 절제 변형) */}
        <span className="text-xl font-display font-bold text-brand tabular-nums leading-none">
          {year}
        </span>
        {/* N건 배지 */}
        <span className="text-xs text-muted bg-surface rounded-pill px-2 py-0.5 ml-auto tabular-nums">
          {items.length}건
        </span>
      </button>

      {/* 그룹 본문 — grid-rows 트랜지션 (펼침 1fr / 접힘 0fr) */}
      <div
        id={panelId}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col divide-y divide-hairline border-t border-hairline">
            {items.map((item) => (
              <TimelineRow
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
