'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { coreValueListQueryOptions } from '@/entities/core-value'
import type { CoreValue } from '@/entities/core-value'
import {
  useDeleteCoreValueMutation,
  useReorderCoreValuesMutation,
} from '@/features/core-value-editor'
import { ConfirmDialog } from '@/shared/ui'
import { ValueCardFormModal } from './ValueCardFormModal'

export function ValueCardManageSection() {
  const { data: values = [], isLoading } = useQuery(coreValueListQueryOptions())
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CoreValue | undefined>(undefined)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const deleteMutation = useDeleteCoreValueMutation()
  const reorderMutation = useReorderCoreValuesMutation()

  const sortedValues = [...values].sort((a, b) => a.order - b.order)

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const reordered = [...sortedValues]
    const temp = reordered[index - 1]
    reordered[index - 1] = reordered[index]
    reordered[index] = temp
    const items = reordered.map((v, i) => ({ id: v.id, order: i }))
    reorderMutation.mutate(items)
  }

  const handleMoveDown = (index: number) => {
    if (index === sortedValues.length - 1) return
    const reordered = [...sortedValues]
    const temp = reordered[index + 1]
    reordered[index + 1] = reordered[index]
    reordered[index] = temp
    const items = reordered.map((v, i) => ({ id: v.id, order: i }))
    reorderMutation.mutate(items)
  }

  const handleDeleteConfirm = () => {
    if (!deletingId) return
    deleteMutation.mutate(deletingId, {
      onSuccess: () => setDeletingId(null),
      onError: () => setDeletingId(null),
    })
  }

  return (
    <section className="bg-surface-white rounded-card border border-hairline p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col gap-0.5 min-w-0">
          <h2 className="text-sm font-display font-semibold text-ink">핵심가치</h2>
          <p className="text-xs text-muted [word-break:keep-all]">
            소개 페이지에 노출할 핵심가치 카드를 등록·수정·삭제합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center shrink-0 bg-brand text-white text-sm font-medium rounded-btn px-4 py-2 min-h-11 hover:bg-brand-hover active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          핵심가치 추가
        </button>
      </div>

      {isLoading ? (
        /* 로딩 스켈레톤 — 목록 항목 형태 */
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[72px] rounded-btn bg-surface animate-pulse" />
          ))}
        </div>
      ) : sortedValues.length === 0 ? (
        <p className="text-muted text-sm py-6 text-center">등록된 핵심가치가 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {sortedValues.map((value, index) => (
            <li
              key={value.id}
              className="flex items-center gap-3 p-3 rounded-btn border border-hairline bg-surface"
            >
              {/* 제목 + 설명 */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{value.title}</p>
                <p className="text-xs text-muted truncate">{value.description}</p>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* 위/아래 */}
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0 || reorderMutation.isPending}
                  className="p-1.5 rounded-btn text-ink-soft hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
                  aria-label="위로 이동"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === sortedValues.length - 1 || reorderMutation.isPending}
                  className="p-1.5 rounded-btn text-ink-soft hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
                  aria-label="아래로 이동"
                >
                  ▼
                </button>

                {/* 수정 */}
                <button
                  type="button"
                  onClick={() => setEditingItem(value)}
                  className="px-2.5 py-1 rounded-btn text-xs font-medium text-ink-soft bg-surface-white border border-hairline hover:bg-surface transition-colors"
                >
                  수정
                </button>

                {/* 삭제 */}
                <button
                  type="button"
                  onClick={() => setDeletingId(value.id)}
                  className="px-2.5 py-1 rounded-btn text-xs font-medium text-error bg-surface-white border border-hairline hover:bg-surface transition-colors"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ValueCardFormModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      <ValueCardFormModal
        open={editingItem !== undefined}
        onClose={() => setEditingItem(undefined)}
        item={editingItem}
      />

      <ConfirmDialog
        open={deletingId !== null}
        title="핵심가치 삭제"
        description="이 핵심가치를 삭제하면 복구할 수 없습니다. 계속하시겠습니까?"
        confirmLabel="삭제"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </section>
  )
}
