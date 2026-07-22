'use client'

import { useState, useMemo } from 'react'
import type { FaqCategory, FaqItem } from '@/entities/faq'

const ALL = '전체'

/** Q 배지 + 질문 + chevron 토글 아코디언 항목 (시안 §FAQ) */
function FaqCard({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  const answerId = `contact-faq-answer-${item.id}`
  const questionId = `contact-faq-question-${item.id}`
  const paragraphs = item.answer.split('\n\n')
  const badge = String(index + 1).padStart(2, '0')

  return (
    <div className="h-fit rounded-2xl border border-hairline bg-surface-white">
      <button
        type="button"
        id={questionId}
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:rounded-2xl cursor-pointer"
      >
        <span className="flex min-w-0 items-center gap-3.5">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-btn bg-tint text-mini font-bold text-brand tabular-nums"
            aria-hidden="true"
          >
            {badge}
          </span>
          <span className="text-base font-bold leading-snug text-ink [word-break:keep-all]">
            {item.question}
          </span>
        </span>
        <span
          className={`shrink-0 text-muted transition-transform duration-fast ease-out ${
            isOpen ? 'rotate-180 text-brand' : ''
          }`}
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="m6 9 6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* grid-rows fr 애니메이션 트릭 — 부드러운 열림/닫힘 */}
      <div
        id={answerId}
        role="region"
        aria-labelledby={questionId}
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          {/* pl-[3.625rem]=58px: 토글 좌패딩(px-5=20)+배지(w-6=24)+gap-3.5(14) → 질문 텍스트 시작선과 정렬. token 없음: 24+14+20 합산값 */}
          <div className="flex flex-col gap-2.5 px-5 pb-5 pl-[3.625rem]">
            {paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className="text-sm leading-relaxed text-muted [word-break:keep-all]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * FAQ 브라우저(문의하기 하단). 상단 카테고리 칩 + 검색 + 2열 아코디언.
 * 서버에서 조회한 카테고리/항목을 props로 받아 필터·아코디언 상태를 소유한다.
 */
export function ContactFaqBrowser({
  categories,
  items,
}: {
  categories: FaqCategory[]
  items: FaqItem[]
}) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const categoryNames = useMemo(
    () => [ALL, ...categories.map((c) => c.name)],
    [categories],
  )

  const filteredItems = useMemo(() => {
    let list =
      activeCategory === ALL
        ? items
        : items.filter((item) => item.categoryName === activeCategory)

    const query = searchQuery.trim().toLowerCase()
    if (query.length > 0) {
      list = list.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query),
      )
    }
    return list
  }, [activeCategory, searchQuery, items])

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setOpenIds(new Set())
  }

  const handleToggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="mt-10">
      {/* 상단 카테고리 칩 */}
      {categoryNames.length > 1 && (
        <div
          className="flex flex-wrap gap-2"
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
                className={`rounded-pill border px-4 py-2 text-sm font-semibold transition-colors duration-fast ease-out ${
                  isActive
                    ? 'border-brand bg-brand text-brand-ink'
                    : 'border-hairline bg-surface-white text-muted hover:border-tint-border hover:text-ink'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>
      )}

      {/* 검색 */}
      <div className="relative mt-4">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-faint"
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
            setOpenIds(new Set())
          }}
          className="w-full rounded-btn border border-hairline bg-surface-white py-3 pl-11 pr-4 text-sm text-ink placeholder:text-faint transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/28"
        />
      </div>

      {/* 2열 아코디언 */}
      {filteredItems.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 items-start gap-x-6 gap-y-4 md:grid-cols-2">
          {filteredItems.map((item, idx) => (
            <FaqCard
              key={item.id}
              item={item}
              index={idx}
              isOpen={openIds.has(item.id)}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 py-12 text-center">
          <p className="text-base text-muted [word-break:keep-all]">
            검색 결과가 없습니다.
          </p>
          {searchQuery.trim().length > 0 && (
            <p className="mt-2 text-sm text-faint">다른 키워드로 검색해 보세요.</p>
          )}
        </div>
      )}
    </div>
  )
}
