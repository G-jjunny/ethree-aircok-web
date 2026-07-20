'use client'

import type { FaqItem } from '@/entities/faq'

interface FaqItemRowProps {
  item: FaqItem
  /** 수정 버튼 클릭 — 부모가 편집 모달을 연다 */
  onEdit: (item: FaqItem) => void
  /** 삭제 버튼 클릭 — 부모가 삭제 확인 다이얼로그를 연다 */
  onDelete: (id: string) => void
}

/**
 * FAQ 관리 단일 행 (프레젠테이션).
 * 카테고리 그룹 내부에 표시되며 질문 텍스트와 수정/삭제 버튼으로 구성된다.
 */
export function FaqItemRow({ item, onEdit, onDelete }: FaqItemRowProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 bg-surface-white">
      <p className="flex-1 min-w-0 text-sm text-ink-soft leading-[1.47] [word-break:keep-all]">
        {item.question}
      </p>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="px-2.5 py-1 rounded-btn text-xs font-medium text-ink-soft bg-surface-white border border-hairline hover:bg-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
        >
          수정
        </button>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="px-2.5 py-1 rounded-btn text-xs font-medium text-error bg-surface-white border border-hairline hover:bg-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
