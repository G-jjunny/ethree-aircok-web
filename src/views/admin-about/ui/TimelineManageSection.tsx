'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { timelineListQueryOptions } from '@/entities/timeline'
import type { TimelineItem } from '@/entities/timeline'
import { useDeleteTimelineMutation } from '@/features/timeline-editor'
import { ConfirmDialog } from '@/shared/ui'
import { TimelineFormModal } from './TimelineFormModal'

export function TimelineManageSection() {
  const { data: items = [], isLoading } = useQuery(timelineListQueryOptions())
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TimelineItem | undefined>(undefined)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const deleteMutation = useDeleteTimelineMutation()

  const handleDeleteConfirm = () => {
    if (!deletingId) return
    deleteMutation.mutate(deletingId, {
      onSuccess: () => setDeletingId(null),
      onError: () => setDeletingId(null),
    })
  }

  return (
    <section className="bg-surface-white rounded-xl border border-border-light p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col gap-0.5 min-w-0">
          <h2 className="text-nav font-display font-semibold text-heading-dark">연혁 / 타임라인</h2>
          <p className="text-xs text-secondary-dark [word-break:keep-all]">
            소개 페이지 History 섹션에 노출할 연혁을 등록·수정·삭제합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-aircok-blue text-heading-light rounded-md px-4 py-2 min-h-[44px] text-nav font-medium hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors shrink-0"
        >
          연혁 추가
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[44px] rounded-md bg-surface-light animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-secondary-dark text-sm py-6 text-center">등록된 연혁이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-md border border-border-light bg-surface-light"
            >
              <span className="w-24 shrink-0 text-sm font-semibold tabular-nums text-heading-dark">
                {item.year}.{String(item.month).padStart(2, '0')}
              </span>
              <p className="flex-1 min-w-0 text-sm text-body-dark truncate">{item.content}</p>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingItem(item)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium text-body-dark bg-surface-white border border-border-light hover:bg-surface-light transition-colors"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingId(item.id)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium text-error bg-surface-white border border-border-light hover:bg-surface-light transition-colors"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <TimelineFormModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      <TimelineFormModal
        open={editingItem !== undefined}
        onClose={() => setEditingItem(undefined)}
        item={editingItem}
      />

      <ConfirmDialog
        open={deletingId !== null}
        title="연혁 삭제"
        description="이 연혁 항목을 삭제하면 복구할 수 없습니다. 계속하시겠습니까?"
        confirmLabel="삭제"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </section>
  )
}
