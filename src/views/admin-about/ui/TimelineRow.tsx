'use client'

import type { TimelineItem } from '@/entities/timeline'

interface TimelineRowProps {
  item: TimelineItem
  /** 수정 버튼 클릭 — 부모가 편집 모달을 연다 */
  onEdit: (item: TimelineItem) => void
  /** 삭제 버튼 클릭 — 부모가 삭제 확인 다이얼로그를 연다 */
  onDelete: (id: string) => void
}

/**
 * 연혁 관리 단일 행 (프레젠테이션).
 * design.md §15.7 "행(Row) — 항목 단위" 토큰을 따른다.
 * 연도 그룹 내부에 표시되지만, 스캔 편의를 위해 YYYY.MM 전체 날짜를 노출한다.
 */
export function TimelineRow({ item, onEdit, onDelete }: TimelineRowProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 bg-surface-white">
      {/* w-[68px]: token 없음 — YYYY.MM 라벨 고정폭, 관리 행 정렬 전용 1회성 수치 */}
      <span className="w-[68px] shrink-0 pt-0.5 text-sm font-semibold tabular-nums text-heading-dark">
        {item.year}.{String(item.month).padStart(2, '0')}
      </span>
      <p className="flex-1 min-w-0 text-sm text-body-dark leading-[1.47] [word-break:keep-all]">
        {item.content}
      </p>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="px-2.5 py-1 rounded-md text-xs font-medium text-body-dark bg-surface-white border border-border-light hover:bg-surface-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-inset"
        >
          수정
        </button>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="px-2.5 py-1 rounded-md text-xs font-medium text-error bg-surface-white border border-border-light hover:bg-surface-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-inset"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
