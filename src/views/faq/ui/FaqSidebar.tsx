'use client'

import { FAQ_CATEGORIES, FAQ_ITEMS } from '../model/faqData'

interface FaqSidebarProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

// 카테고리별 항목 수를 계산하는 헬퍼
function getCategoryCount(category: string): number {
  if (category === '전체') return FAQ_ITEMS.length
  return FAQ_ITEMS.filter((item) => item.category === category).length
}

export function FaqSidebar({ activeCategory, onCategoryChange }: FaqSidebarProps) {
  return (
    <div className="hidden sm:block">
      <div className="sticky top-20">
        <p className="text-[12px] font-semibold text-secondary-dark uppercase tracking-wider mb-2">
          카테고리
        </p>
        <div className="flex flex-col gap-1">
          {FAQ_CATEGORIES.map((category) => {
            const isActive = activeCategory === category
            const count = getCategoryCount(category)

            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={
                  isActive
                    ? 'w-full flex items-center justify-between text-[15px] font-semibold text-aircok-blue bg-surface-light rounded-md px-3 py-2 text-left'
                    : 'w-full flex items-center justify-between text-[15px] font-medium text-body-dark rounded-md px-3 py-2 hover:bg-surface-light hover:text-heading-dark transition-colors text-left'
                }
                aria-pressed={isActive}
              >
                <span>{category}</span>
                {isActive ? (
                  <span className="text-[12px] text-aircok-blue ml-auto tabular-nums">
                    {count}
                  </span>
                ) : (
                  <span className="text-[12px] text-secondary-dark bg-surface-light rounded-pill px-2 py-0.5 ml-auto tabular-nums">
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
