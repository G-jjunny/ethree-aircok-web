'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  faqCategoryQueryOptions,
  faqItemQueryOptions,
} from '@/entities/faq'
import type { FaqCategory, FaqItem } from '@/entities/faq'
import { useDeleteFaqItemMutation } from '@/features/faq-item-editor'
import { AdminPageHeader, ConfirmDialog } from '@/shared/ui'
import { CategoryFormModal } from './CategoryFormModal'
import { FaqItemFormModal } from './FaqItemFormModal'
import { FaqCategoryGroup } from './FaqCategoryGroup'

interface CategoryGroup {
  category: FaqCategory
  items: FaqItem[]
}

/**
 * 카테고리 order 오름차순 → 카테고리 내 항목 order 오름차순으로 그룹화.
 */
function groupByCategory(categories: FaqCategory[], items: FaqItem[]): CategoryGroup[] {
  return categories
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((category) => ({
      category,
      items: items
        .filter((item) => item.categoryId === category.id)
        .sort((a, b) => a.order - b.order),
    }))
}

export function AdminFaqView() {
  const { data: categories = [], isLoading: categoriesLoading } = useQuery(faqCategoryQueryOptions())
  const { data: items = [], isLoading: itemsLoading } = useQuery(faqItemQueryOptions())
  const isLoading = categoriesLoading || itemsLoading

  // ── 검색 / 아코디언 상태 ──
  const [searchQuery, setSearchQuery] = useState('')
  // null = 사용자가 아직 한 번도 토글하지 않은 초기 상태.
  // 이 경우 펼침셋은 "첫 번째 카테고리만"으로 파생 계산한다.
  const [openCategoryIds, setOpenCategoryIds] = useState<Set<string> | null>(null)

  // ── 모달 상태 ──
  const [showCreateCategory, setShowCreateCategory] = useState(false)
  const [showAddItem, setShowAddItem] = useState(false)
  const [addItemCategoryId, setAddItemCategoryId] = useState<string | undefined>(undefined)
  const [editingItem, setEditingItem] = useState<FaqItem | undefined>(undefined)
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)

  const deleteMutation = useDeleteFaqItemMutation()

  // ── 필터 적용 ──
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const hasActiveFilter = normalizedQuery !== ''

  // 검색 시: 카테고리명 부분일치 OR 해당 카테고리에 질문 부분일치 항목이 있는 카테고리만 노출
  const visibleCategories = useMemo(() => {
    if (normalizedQuery === '') return categories
    const catIdsWithMatchingItems = new Set(
      items
        .filter((it) => it.question.toLowerCase().includes(normalizedQuery))
        .map((it) => it.categoryId),
    )
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(normalizedQuery) ||
        catIdsWithMatchingItems.has(c.id),
    )
  }, [categories, items, normalizedQuery])

  const filteredItems = useMemo(() => {
    if (normalizedQuery === '') return items
    return items.filter(
      (it) =>
        it.question.toLowerCase().includes(normalizedQuery) ||
        it.categoryName.toLowerCase().includes(normalizedQuery),
    )
  }, [items, normalizedQuery])

  const groups = useMemo(
    () => groupByCategory(visibleCategories, filteredItems),
    [visibleCategories, filteredItems],
  )

  // 기본 펼침 정책: openCategoryIds 가 null이면 order 기준 첫 번째 카테고리만 펼친다.
  const sortedCategoryIds = useMemo(
    () => categories.slice().sort((a, b) => a.order - b.order).map((c) => c.id),
    [categories],
  )

  const effectiveOpenIds = useMemo(
    () =>
      openCategoryIds ??
      new Set(sortedCategoryIds.length > 0 ? [sortedCategoryIds[0]] : []),
    [openCategoryIds, sortedCategoryIds],
  )

  // 검색/필터가 활성일 때는 매칭된 그룹을 모두 펼친다.
  const isCategoryOpen = (id: string) => hasActiveFilter || effectiveOpenIds.has(id)

  const toggleCategory = (id: string) => {
    setOpenCategoryIds((prev) => {
      const base = prev ?? new Set(sortedCategoryIds.length > 0 ? [sortedCategoryIds[0]] : [])
      const next = new Set(base)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleAddItem = (categoryId: string) => {
    setAddItemCategoryId(categoryId)
    setShowAddItem(true)
  }

  const handleDeleteConfirm = () => {
    if (!deletingItemId) return
    deleteMutation.mutate(deletingItemId, {
      onSuccess: () => setDeletingItemId(null),
      onError: () => setDeletingItemId(null),
    })
  }

  return (
    <div>
      <AdminPageHeader title="FAQ 관리" description="자주 묻는 질문을 카테고리별로 관리합니다.">
        <button
          type="button"
          onClick={() => setShowCreateCategory(true)}
          className="inline-flex items-center justify-center shrink-0 bg-aircok-blue text-heading-light text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
        >
          카테고리 추가
        </button>
      </AdminPageHeader>

      {/* 콘텐츠 영역 */}
      <div className="p-6 lg:p-8">
        <section className="bg-surface-white rounded-xl border border-border-light p-6">
          {isLoading ? (
            /* 로딩 스켈레톤 — 카테고리 그룹 헤더 형태 */
            <div className="flex flex-col gap-3">
              {/* h-[52px]: token 없음 — 접힘 그룹 헤더(px-4 py-3.5) 높이 근사, 스켈레톤 전용 1회성 수치 */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[52px] rounded-lg bg-surface-light animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            /* 데이터 자체가 없는 빈 상태 */
            <div className="py-12 text-center">
              <p className="text-[17px] text-secondary-dark [word-break:keep-all]">
                등록된 카테고리가 없습니다.
              </p>
              <p className="text-[15px] text-secondary-dark mt-2">
                카테고리 추가 버튼을 눌러 시작하세요.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* ── 도구 모음: 검색 + 총 건수 ── */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-xs">
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="카테고리명 또는 질문 검색"
                    aria-label="카테고리명 또는 질문 검색"
                    className="w-full bg-surface-light rounded-md px-4 py-3 pl-10 text-[15px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue border-none"
                  />
                </div>
                <p className="text-sm text-secondary-dark tabular-nums shrink-0">
                  총 {items.length}건
                </p>
              </div>

              {/* ── 카테고리 그룹 아코디언 목록 / 검색 결과 없음 ── */}
              {groups.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-[17px] text-secondary-dark [word-break:keep-all]">
                    검색 결과가 없습니다.
                  </p>
                  <p className="text-[15px] text-secondary-dark mt-2">
                    다른 키워드로 검색해 보세요.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {groups.map((group) => (
                    <FaqCategoryGroup
                      key={group.category.id}
                      category={group.category}
                      items={group.items}
                      isOpen={isCategoryOpen(group.category.id)}
                      onToggle={() => toggleCategory(group.category.id)}
                      onEdit={(item) => setEditingItem(item)}
                      onDelete={(id) => setDeletingItemId(id)}
                      onAddItem={handleAddItem}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* 카테고리 생성 모달 */}
      <CategoryFormModal
        open={showCreateCategory}
        mode="create"
        onClose={() => setShowCreateCategory(false)}
      />

      {/* FAQ 항목 추가 모달 */}
      <FaqItemFormModal
        open={showAddItem}
        mode="create"
        defaultCategoryId={addItemCategoryId}
        onClose={() => {
          setShowAddItem(false)
          setAddItemCategoryId(undefined)
        }}
      />

      {/* FAQ 항목 수정 모달 */}
      <FaqItemFormModal
        open={editingItem !== undefined}
        mode="edit"
        initialValues={
          editingItem
            ? {
                id: editingItem.id,
                categoryId: editingItem.categoryId,
                question: editingItem.question,
                answer: editingItem.answer,
                order: editingItem.order,
              }
            : undefined
        }
        onClose={() => setEditingItem(undefined)}
      />

      {/* FAQ 항목 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={deletingItemId !== null}
        title="FAQ 항목 삭제"
        description="이 FAQ 항목을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
        confirmLabel="삭제"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingItemId(null)}
      />
    </div>
  )
}
