'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ConfirmDialog } from '@/shared/ui'
import { useDeleteFaqItemMutation } from '@/features/faq-item-editor'
import { faqItemByCategoryQueryOptions } from '@/entities/faq'
import type { FaqItem } from '@/entities/faq'
import { FaqItemFormModal } from './FaqItemFormModal'

interface FaqItemListSectionProps {
  selectedCategoryId: string | null
  selectedCategoryName: string | null
}

export function FaqItemListSection({
  selectedCategoryId,
  selectedCategoryName,
}: FaqItemListSectionProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null)
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)

  const { data: items = [], isLoading } = useQuery({
    ...faqItemByCategoryQueryOptions(selectedCategoryId ?? ''),
    enabled: !!selectedCategoryId,
  })

  const deleteMutation = useDeleteFaqItemMutation()

  const handleDeleteConfirm = () => {
    if (!deletingItemId) return
    deleteMutation.mutate(deletingItemId, {
      onSuccess: () => setDeletingItemId(null),
      onError: () => setDeletingItemId(null),
    })
  }

  if (!selectedCategoryId) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 rounded-xl border border-border-light bg-surface-white px-6 py-16">
        <svg
          className="w-10 h-10 text-secondary-dark"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-nav text-secondary-dark [word-break:keep-all]">
          카테고리를 선택해 주세요
        </p>
        <p className="text-xs text-secondary-dark [word-break:keep-all]">
          왼쪽에서 카테고리를 선택하면 FAQ 항목을 관리할 수 있습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-surface-white rounded-xl border border-border-light p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-nav font-semibold text-heading-dark truncate">
          {selectedCategoryName ?? '항목 목록'}
        </h2>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center bg-aircok-blue text-heading-light text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2 shrink-0 ml-2"
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
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[44px] rounded-md bg-surface-light animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center gap-4 rounded-xl border border-border-light bg-surface-white px-6 py-16">
          <p className="text-nav text-secondary-dark [word-break:keep-all]">
            FAQ 항목이 없습니다.
          </p>
          <p className="text-xs text-secondary-dark [word-break:keep-all]">
            추가 버튼을 눌러 FAQ 항목을 만드세요.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between w-full rounded-md px-3 py-2.5 min-h-[44px] text-sm font-body text-heading-dark transition-colors hover:bg-surface-light"
            >
              <span className="truncate">{item.question}</span>
              <span className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  type="button"
                  aria-label="FAQ 항목 수정"
                  onClick={() => setEditingItem(item)}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-sm text-secondary-dark hover:text-heading-dark hover:bg-surface-light transition-colors shrink-0"
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
                  aria-label="FAQ 항목 삭제"
                  onClick={() => setDeletingItemId(item.id)}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-sm text-secondary-dark hover:text-error hover:bg-surface-light transition-colors shrink-0"
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
          ))}
        </div>
      )}

      <FaqItemFormModal
        open={showCreateModal}
        mode="create"
        defaultCategoryId={selectedCategoryId}
        onClose={() => setShowCreateModal(false)}
      />

      <FaqItemFormModal
        open={editingItem !== null}
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
        onClose={() => setEditingItem(null)}
      />

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
