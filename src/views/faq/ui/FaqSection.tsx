'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SectionHeader } from '@/shared/ui'
import { faqCategoryQueryOptions, faqItemQueryOptions } from '@/entities/faq'
import type { FaqItem } from '@/entities/faq'
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

export function FaqSection() {
  const [activeCategory, setActiveCategory] = useState<string>('전체')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [openItemId, setOpenItemId] = useState<string | null>(null)

  const { data: faqCategories = [], isLoading: isCategoriesLoading } = useQuery(faqCategoryQueryOptions())
  const { data: allItems = [], isLoading: isItemsLoading } = useQuery(faqItemQueryOptions())

  const isLoading = isCategoriesLoading || isItemsLoading

  // categories 문자열 목록: ['전체', ...카테고리명들]
  const categoryNames = useMemo(
    () => ['전체', ...faqCategories.map((c) => c.name)],
    [faqCategories]
  )

  // 카테고리별 항목 수 (사이드바용)
  const itemCounts = useMemo(() => {
    const counts: Record<string, number> = { '전체': allItems.length }
    for (const cat of faqCategories) {
      counts[cat.name] = allItems.filter((item) => item.categoryId === cat.id).length
    }
    return counts
  }, [faqCategories, allItems])

  // 카테고리 인덱스 맵 (배지 번호용)
  const categoryIndexMap = useMemo(
    () => buildCategoryIndexMap(allItems),
    [allItems]
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
    let items =
      activeCategory === '전체'
        ? allItems
        : allItems.filter((item) => item.categoryName === activeCategory)

    const query = searchQuery.trim().toLowerCase()
    if (query.length > 0) {
      items = items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      )
    }

    return items
  }, [activeCategory, searchQuery, allItems])

  // 필터된 항목의 카테고리 내 원래 순번 목록
  const categoryIndexes = filteredItems.map(
    (item) => categoryIndexMap.get(item.id) ?? 0
  )

  if (isLoading) return null

  return (
    <section className="bg-surface-white py-20 md:py-28">
      {/* token 없음: FAQ 2컬럼 전용 너비 1000px — 사이드바 200px + 아코디언 영역 적정 폭 확보 */}
      <div className="max-w-[1000px] mx-auto px-5">
        <SectionHeader
          label="자주 묻는 질문"
          title="FAQ"
          theme="light"
          titleAs="h2"
        />

        {/* 검색 입력창 */}
        <div className="relative mt-8">
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

        {/* 2컬럼 그리드: 사이드바(데스크탑) + 아코디언 */}
        {/* token 없음: sm:grid-cols-[200px_1fr] — 사이드바 고정 너비 200px */}
        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-10 mt-8">
          {/* 사이드바 (sm 이상에서만 노출) */}
          <FaqSidebar
            categories={categoryNames}
            itemCounts={itemCounts}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* 우측 콘텐츠 */}
          <div>
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
      </div>
    </section>
  )
}
