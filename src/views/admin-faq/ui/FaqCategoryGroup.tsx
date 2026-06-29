'use client'

import type { FaqCategory, FaqItem } from '@/entities/faq'
import { FaqItemRow } from './FaqItemRow'

interface FaqCategoryGroupProps {
  /** 카테고리 — 헤더에 이름과 배지를 표시 */
  category: FaqCategory
  /** 이 카테고리에 속한 항목들. order 오름차순 정렬은 부모(AdminFaqView) 책임 */
  items: FaqItem[]
  /** 펼침/접힘 상태 — 부모가 openCategoryIds 상태로 제어 */
  isOpen: boolean
  /** 헤더 클릭 시 토글 — 부모가 openCategoryIds 갱신 */
  onToggle: () => void
  onEdit: (item: FaqItem) => void
  onDelete: (id: string) => void
  /** 카테고리 헤더의 "FAQ 추가" 버튼 클릭 — 부모가 해당 카테고리 ID로 추가 모달 오픈 */
  onAddItem: (categoryId: string) => void
}

/**
 * FAQ 관리 — 카테고리 그룹 아코디언 (TimelineYearGroup 상당).
 * - 헤더: 회전 chevron + 카테고리명 + N건 배지 + FAQ 추가 버튼
 * - 본문: grid-rows 트랜지션으로 접기/펼치기
 *
 * 그룹화/정렬/펼침 상태 로직은 부모(AdminFaqView)에서 주입한다.
 */
export function FaqCategoryGroup({
  category,
  items,
  isOpen,
  onToggle,
  onEdit,
  onDelete,
  onAddItem,
}: FaqCategoryGroupProps) {
  const panelId = `faq-category-panel-${category.id}`

  return (
    <div className="rounded-lg border border-border-light overflow-hidden">
      {/* 그룹 헤더 (아코디언 토글 + FAQ 추가 버튼) */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex-1 flex items-center gap-3 px-4 py-3.5 text-left hover:bg-surface-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-inset"
        >
          {/* 토글 chevron — 펼침 rotate-0(아래), 접힘 -rotate-90(우측) */}
          <svg
            className={`shrink-0 w-5 h-5 text-secondary-dark transition-transform duration-200 ${
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
          {/* 카테고리명 — 연도 numeral 대신 일반 텍스트 스타일 */}
          <span className="text-[17px] font-display font-semibold text-heading-dark">
            {category.name}
          </span>
          {/* N건 배지 */}
          <span className="text-[12px] text-secondary-dark bg-surface-light rounded-pill px-2 py-0.5 ml-auto tabular-nums">
            {items.length}건
          </span>
        </button>

        {/* FAQ 추가 버튼 — 헤더 우측 */}
        <button
          type="button"
          onClick={() => onAddItem(category.id)}
          aria-label={`${category.name} 카테고리에 FAQ 추가`}
          className="shrink-0 mx-3 inline-flex items-center justify-center gap-1 bg-aircok-blue text-heading-light text-xs font-medium rounded-md px-3 py-1.5 hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
        >
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M8 2v12M2 8h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          FAQ 추가
        </button>
      </div>

      {/* 그룹 본문 — grid-rows 트랜지션 (펼침 1fr / 접힘 0fr) */}
      <div
        id={panelId}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col divide-y divide-border-light border-t border-border-light">
            {items.length === 0 ? (
              <p className="text-secondary-dark text-sm py-4 px-4 text-center">
                이 카테고리에 FAQ 항목이 없습니다.
              </p>
            ) : (
              items.map((item) => (
                <FaqItemRow
                  key={item.id}
                  item={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
