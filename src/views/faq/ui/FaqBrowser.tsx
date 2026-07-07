'use client'

import { useState, useMemo } from 'react'
import type { FaqCategory, FaqItem } from '@/entities/faq'
import { FaqSidebar } from './FaqSidebar'
import { FaqAccordion } from './FaqAccordion'

// 카테고리별 원래 순번 인덱스를 계산하는 헬퍼.
// 각 item이 자신의 카테고리 내에서 몇 번째인지 반환한다.
function buildCategoryIndexMap(items: FaqItem[]): Map<string, number> {
  const counters: Record<string, number> = {}
  const result = new Map<string, number>()
  for (const item of items) {
    const categoryName = item.categoryName
    const count = counters[categoryName] ?? 0
    result.set(item.id, count)
    counters[categoryName] = count + 1
  }
  return result
}

/**
 * FAQ 브라우저 leaf.
 * 서버에서 조회한 카테고리/항목을 props로 받아, 카테고리 필터·검색·아코디언 상태를 소유한다.
 */
export function FaqBrowser({
  categories,
  items,
}: {
  categories: FaqCategory[]
  items: FaqItem[]
}) {
  const [activeCategory, setActiveCategory] = useState<string>('전체')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [openItemId, setOpenItemId] = useState<string | null>(null)

  // categories 문자열 목록: ['전체', ...카테고리명들]
  const categoryNames = useMemo(
    () => ['전체', ...categories.map((c) => c.name)],
    [categories]
  )

  // 카테고리별 항목 수 (사이드바용)
  const itemCounts = useMemo(() => {
    const counts: Record<string, number> = { '전체': items.length }
    for (const cat of categories) {
      counts[cat.name] = items.filter((item) => item.categoryId === cat.id).length
    }
    return counts
  }, [categories, items])

  // 카테고리 인덱스 맵 (배지 번호용)
  const categoryIndexMap = useMemo(
    () => buildCategoryIndexMap(items),
    [items]
  )

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setOpenItemId(null)
  }

  const handleToggle = (id: string) => {
    setOpenItemId((prev) => (prev === id ? null : id))
  }

  // 카테고리 + 검색어 필터링
  const filteredItems = useMemo(() => {
    let list =
      activeCategory === '전체'
        ? items
        : items.filter((item) => item.categoryName === activeCategory)

    const query = searchQuery.trim().toLowerCase()
    if (query.length > 0) {
      list = list.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      )
    }

    return list
  }, [activeCategory, searchQuery, items])

  // 필터된 항목의 카테고리 내 원래 순번 목록
  const categoryIndexes = filteredItems.map(
    (item) => categoryIndexMap.get(item.id) ?? 0
  )

  return (
    // 2컬럼 그리드: 사이드바(데스크탑) + (검색 + 아코디언)
    // token 없음: sm:grid-cols-[200px_1fr] — 사이드바 고정 너비 200px
    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-10 mt-8">
      {/* 사이드바 (sm 이상에서만 노출) */}
      <FaqSidebar
        categories={categoryNames}
        itemCounts={itemCounts}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* 우측 콘텐츠: 검색 입력창 + (모바일 탭) + 아코디언 */}
      <div>
        {/* 검색 입력창 */}
        <div className="relative mb-8">
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
            aria-label="FAQ 검색"
            placeholder="질문을 검색하세요"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setOpenItemId(null)
            }}
            className="w-full bg-surface-light rounded-md px-4 py-3 pl-10 text-[15px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue border-none"
          />
        </div>

        {/* 모바일 탭 (sm 미만에서만 노출) */}
        <div
          className="sm:hidden mb-6 flex flex-row gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          role="tablist"
          aria-label="FAQ 카테고리"
        >
          {categoryNames.map((category) => {
            const isActive = activeCategory === category
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleCategoryChange(category)}
                className={`shrink-0 rounded-pill px-5 py-2 min-h-[44px] text-[15px] font-medium transition-colors ${
                  isActive
                    ? 'bg-aircok-blue text-heading-light'
                    : 'bg-transparent text-body-dark hover:bg-surface-light'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>

        {/* 아코디언 목록 */}
        <FaqAccordion
          items={filteredItems}
          categoryIndexes={categoryIndexes}
          openItemId={openItemId}
          onToggle={handleToggle}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  )
}
