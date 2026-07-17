'use client'

import { useState } from 'react'
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { toast } from 'sonner'
import { MessageSquareQuote } from 'lucide-react'
import type { ServiceReview } from '@/entities/service-review'
import {
  useDeleteServiceReviewMutation,
  useReorderServiceReviewsMutation,
} from '@/features/service-review-editor'
import { extractUploadError } from '@/shared/api'
import { ConfirmDialog } from '@/shared/ui'
import { SortableServiceReviewCard } from './SortableServiceReviewCard'

interface ServiceReviewListSectionProps {
  reviews: ServiceReview[]
  isLoading: boolean
  onEdit: (id: string) => void
}

/**
 * 진단 후기 목록(미공개 포함) + 드래그앤드롭 순서 변경.
 * 순서 변경은 낙관적으로 반영하고 실패 시 서버 데이터로 롤백한다.
 */
export function ServiceReviewListSection({
  reviews,
  isLoading,
  onEdit,
}: ServiceReviewListSectionProps) {
  // 드래그 중 즉각 반영을 위한 로컬 순서 상태.
  // 서버 데이터가 갱신되면 "렌더 중 state 조정"으로 동기화한다(React 공식 권장 방식).
  const [items, setItems] = useState<ServiceReview[]>(reviews)
  const [syncedFrom, setSyncedFrom] = useState<ServiceReview[]>(reviews)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  if (syncedFrom !== reviews) {
    setSyncedFrom(reviews)
    setItems(reviews)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const deleteMutation = useDeleteServiceReviewMutation()
  const reorderMutation = useReorderServiceReviewsMutation()

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((item) => item.id === active.id)
    const newIndex = items.findIndex((item) => item.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const next = arrayMove(items, oldIndex, newIndex)
    setItems(next) // 낙관적 업데이트

    reorderMutation.mutate(
      next.map((item) => item.id),
      {
        onSuccess: () => toast.success('순서가 변경되었습니다'),
        onError: () => {
          toast.error('순서 변경에 실패했습니다')
          setItems(reviews) // 롤백
        },
      },
    )
  }

  const handleDeleteConfirm = () => {
    if (!deletingId) return
    deleteMutation.mutate(deletingId, {
      onSuccess: () => {
        toast.success('후기가 삭제되었습니다')
        setDeletingId(null)
      },
      onError: (error) => {
        toast.error(extractUploadError(error, '후기 삭제에 실패했습니다'))
        setDeletingId(null)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="bg-surface-white rounded-card border border-hairline p-6 flex flex-col gap-4">
        {[1, 2].map((key) => (
          // token 없음: h-32 — 스켈레톤 카드 높이(1회성 수치)
          <div key={key} className="h-32 rounded-image bg-surface animate-pulse" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-surface-white rounded-card border border-hairline px-6 py-16 flex flex-col items-center justify-center text-center gap-3">
        <MessageSquareQuote className="w-12 h-12 text-faint" aria-hidden="true" />
        <p className="text-sm text-muted [word-break:keep-all]">
          등록된 신청 이유가 없습니다.
        </p>
        <p className="text-xs text-faint [word-break:keep-all]">
          우측 상단 &ldquo;신청 이유 등록&rdquo; 버튼으로 추가하세요.
        </p>
      </div>
    )
  }

  return (
    <section className="bg-surface-white rounded-card border border-hairline p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2 border-b border-hairline pb-4">
        <h2 className="text-sm font-semibold text-ink">
          신청 이유 ({items.length})
        </h2>
        <p className="text-xs text-muted [word-break:keep-all]">
          드래그하여 순서를 변경하세요
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-4">
            {items.map((review, index) => (
              <SortableServiceReviewCard
                key={review.id}
                review={review}
                index={index}
                onEdit={onEdit}
                onDelete={setDeletingId}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <ConfirmDialog
        open={deletingId !== null}
        title="신청 이유 삭제"
        description="이 후기를 삭제하시겠습니까? 아바타도 함께 삭제되며 복구할 수 없습니다."
        confirmLabel="삭제"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </section>
  )
}
