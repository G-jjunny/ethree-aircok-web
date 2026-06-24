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
    <div className="p-6 lg:p-8">
      <h1 className="text-heading-dark font-display font-semibold text-2xl mb-6">FAQ 관리</h1>
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
  )
}
