'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { faqCategoryQueryOptions } from '@/entities/faq'
import { CategoryListSection } from './CategoryListSection'
import { FaqItemListSection } from './FaqItemListSection'

export function AdminFaqView() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const { data: categories = [], isLoading } = useQuery(faqCategoryQueryOptions())

  return (
    <div>
      {/* 페이지 헤더 — §15.2 */}
      <div className="bg-surface-white border-b border-border-light px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5 min-w-0">
          <h1 className="text-[22px] font-display font-semibold text-heading-dark leading-tight [word-break:keep-all]">FAQ 관리</h1>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-6 lg:p-8">
        {/* token 없음: grid-cols-[280px_1fr] — 카테고리 사이드패널 고정 너비 280px */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <CategoryListSection
            categories={categories}
            isLoading={isLoading}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
          <FaqItemListSection
            selectedCategoryId={selectedCategoryId}
            selectedCategoryName={categories.find((c) => c.id === selectedCategoryId)?.name ?? null}
          />
        </div>
      </div>
    </div>
  )
}
