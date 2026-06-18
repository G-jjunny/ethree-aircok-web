'use client'

import { useState } from 'react'
import { SectionHeader } from '@/shared/ui'
import { FAQ_CATEGORIES, FAQ_ITEMS, type FaqItem } from '../model/faqData'

// 아코디언 단일 항목 컴포넌트
function AccordionItem({ item, isOpen, onToggle }: {
  item: FaqItem
  isOpen: boolean
  onToggle: () => void
}) {
  const answerId = `faq-answer-${item.id}`

  // \n\n 구분자를 기준으로 단락 분리
  const paragraphs = item.answer.split('\n\n')

  return (
    <div className="border-b border-border-light">
      <button
        type="button"
        className="flex items-center justify-between w-full gap-4 py-5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:rounded-sm"
        id={`faq-question-${item.id}`}
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={onToggle}
      >
        <span className="text-[17px] font-semibold text-heading-dark leading-[1.47] [word-break:keep-all] text-left">
          Q. {item.question}
        </span>
        <span
          className={`shrink-0 w-6 h-6 flex items-center justify-center transition-colors ${
            isOpen ? 'text-aircok-blue' : 'text-secondary-dark'
          }`}
          aria-hidden="true"
        >
          {isOpen ? (
            // minus 아이콘 (열린 상태)
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            // plus 아이콘 (닫힌 상태)
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </span>
      </button>

      {/*
        CSS grid-rows 트릭으로 부드러운 열림/닫힘 애니메이션.
        grid-rows-[1fr] / grid-rows-[0fr] 은 fr 단위 애니메이션 전용 수치로 허용.
      */}
      <div
        id={answerId}
        role="region"
        aria-labelledby={`faq-question-${item.id}`}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-5 flex flex-col gap-3">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-[17px] text-body-dark leading-[1.65] [word-break:keep-all]"
              >
                {index === 0 ? `A. ${paragraph}` : paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function FaqSection() {
  const [activeCategory, setActiveCategory] = useState<string>('전체')
  const [openItemId, setOpenItemId] = useState<string | null>(null)

  // 카테고리 필터링
  const filteredItems =
    activeCategory === '전체'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === activeCategory)

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    // 탭 변경 시 열린 아코디언 닫기
    setOpenItemId(null)
  }

  const handleToggle = (id: string) => {
    setOpenItemId((prev) => (prev === id ? null : id))
  }

  return (
    <section className="bg-surface-white py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-5">
        <SectionHeader
          label="자주 묻는 질문"
          title="FAQ"
          theme="light"
          titleAs="h2"
        />

        {/* 카테고리 탭 */}
        <div className="mt-8">
          <div
            className="flex flex-row gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            role="tablist"
            aria-label="FAQ 카테고리"
          >
            {FAQ_CATEGORIES.map((category) => {
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
        </div>

        {/* 아코디언 목록 */}
        <div className="mt-10">
          <div className="border-t border-border-light">
            {filteredItems.map((item) => (
              <AccordionItem
                key={item.id}
                item={item}
                isOpen={openItemId === item.id}
                onToggle={() => handleToggle(item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
