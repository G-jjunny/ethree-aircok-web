'use client'

import { useState } from 'react'
import { ConfirmDialog } from '@/shared/ui'
import { useDeleteFaqCategoryMutation } from '@/features/faq-category-editor'
import type { FaqCategory } from '@/entities/faq'
import { CategoryFormModal } from './CategoryFormModal'

interface CategoryListSectionProps {
  categories: FaqCategory[]
  isLoading: boolean
  selectedCategoryId: string | null
  onSelectCategory: (id: string) => void
}

export function CategoryListSection({
  categories,
  isLoading,
  selectedCategoryId,
  onSelectCategory,
}: CategoryListSectionProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<FaqCategory | null>(null)
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)

  const deleteMutation = useDeleteFaqCategoryMutation()

  const handleDeleteConfirm = () => {
    if (!deletingCategoryId) return
    deleteMutation.mutate(deletingCategoryId, {
      onSuccess: () => setDeletingCategoryId(null),
      onError: () => setDeletingCategoryId(null),
    })
  }

  return (
    <div className="bg-surface-white rounded-card border border-hairline p-4 flex flex-col gap-3 h-fit">
      <div className="flex items-center justify-between border-b border-hairline pb-3 mb-3">
        <h2 className="text-sm font-semibold text-ink">카테고리</h2>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center bg-brand text-white text-sm font-medium rounded-btn px-4 py-2 min-h-11 hover:bg-brand-hover active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <svg
            className="w-4 h-4 mr-1.5"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8 2v12M2 8h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          추가
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[44px] rounded-btn bg-surface animate-pulse"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center gap-4 rounded-card border border-hairline bg-surface-white px-6 py-16">
          <p className="text-sm text-muted [word-break:keep-all]">
            카테고리가 없습니다.
          </p>
          <p className="text-xs text-muted [word-break:keep-all]">
            추가 버튼을 눌러 카테고리를 만드세요.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {categories.map((category) => {
            const isSelected = selectedCategoryId === category.id
            return (
              <div
                key={category.id}
                className={
                  isSelected
                    ? 'flex items-center justify-between w-full rounded-btn px-3 py-2.5 min-h-11 text-sm font-body font-semibold bg-brand/10 text-brand cursor-pointer transition-colors'
                    : 'flex items-center justify-between w-full rounded-btn px-3 py-2.5 min-h-11 text-sm font-body text-ink cursor-pointer transition-colors hover:bg-surface'
                }
                onClick={() => onSelectCategory(category.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelectCategory(category.id)
                  }
                }}
              >
                <span className="truncate">{category.name}</span>
                <span className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    type="button"
                    aria-label={`${category.name} 수정`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingCategory(category)
                    }}
                    className={
                      isSelected
                        ? 'inline-flex items-center justify-center w-7 h-7 rounded text-brand/60 hover:text-brand hover:bg-brand/10 transition-colors shrink-0'
                        : 'inline-flex items-center justify-center w-7 h-7 rounded text-muted hover:text-ink hover:bg-surface transition-colors shrink-0'
                    }
                  >
                    {/* pencil icon */}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M9.5 2.5l2 2-7 7H2.5V9l7-6.5z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label={`${category.name} 삭제`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeletingCategoryId(category.id)
                    }}
                    className="inline-flex items-center justify-center w-7 h-7 rounded text-muted hover:text-error hover:bg-surface transition-colors shrink-0"
                  >
                    {/* trash2 icon */}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 3.5h10M5.5 3.5V2.5h3V3.5M3.5 3.5l.7 8h6.6l.7-8"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </span>
              </div>
            )
          })}
        </div>
      )}

      <CategoryFormModal
        open={showCreateModal}
        mode="create"
        onClose={() => setShowCreateModal(false)}
      />

      <CategoryFormModal
        open={editingCategory !== null}
        mode="edit"
        initialValues={
          editingCategory
            ? {
                id: editingCategory.id,
                name: editingCategory.name,
                order: editingCategory.order,
              }
            : undefined
        }
        onClose={() => setEditingCategory(null)}
      />

      <ConfirmDialog
        open={deletingCategoryId !== null}
        title="카테고리 삭제"
        description="이 카테고리에 속한 FAQ 항목이 있으면 삭제할 수 없습니다. 항목을 먼저 삭제한 후 카테고리를 삭제하세요."
        confirmLabel="삭제"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingCategoryId(null)}
      />
    </div>
  )
}
