'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import type { ServiceReview } from '@/entities/service-review'
import { ServiceReviewImageField } from './ServiceReviewImageField'

interface SortableServiceReviewCardProps {
  review: ServiceReview
  index: number
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

/**
 * 드래그로 순서를 바꿀 수 있는 진단 후기 카드.
 * 아바타는 카드에서 바로 업로드/교체할 수 있다(multipart 전용 경로).
 */
export function SortableServiceReviewCard({
  review,
  index,
  onEdit,
  onDelete,
}: SortableServiceReviewCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: review.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-4 rounded-image border border-hairline bg-surface-white p-4"
    >
      {/* 헤더: 순번 · 공개 상태 · 드래그 핸들 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium tabular-nums text-faint">
            {index + 1}
          </span>
          <span
            className={
              review.published
                ? 'rounded-pill border border-tint-border bg-tint px-2 py-0.5 text-xs font-medium text-brand'
                : 'rounded-pill border border-hairline bg-surface px-2 py-0.5 text-xs font-medium text-muted'
            }
          >
            {review.published ? '공개' : '미공개'}
          </span>
        </div>
        <button
          type="button"
          aria-label="순서 변경 드래그"
          className="inline-flex items-center justify-center w-11 h-11 rounded-btn text-muted hover:text-ink hover:bg-surface transition-colors cursor-grab active:cursor-grabbing touch-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        {/* 아바타 — imageUrl이 null인 상태가 정상 기본값이다 */}
        <ServiceReviewImageField review={review} className="shrink-0" />

        <div className="flex-1 flex flex-col gap-2">
          <p className="text-sm text-ink [word-break:keep-all]">
            &ldquo;{review.quote}&rdquo;
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-pill border border-hairline bg-surface px-2 py-0.5 text-xs text-ink">
              {review.role}
            </span>
            <span className="rounded-pill border border-hairline bg-surface px-2 py-0.5 text-xs text-muted">
              {review.age}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-hairline pt-4">
        <button
          type="button"
          onClick={() => onEdit(review.id)}
          className="inline-flex items-center justify-center rounded-btn border border-hairline bg-transparent px-4 py-2 min-h-11 text-xs font-medium text-ink hover:bg-surface active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          수정
        </button>
        <button
          type="button"
          onClick={() => onDelete(review.id)}
          className="inline-flex items-center justify-center rounded-btn border border-error/30 bg-transparent px-4 py-2 min-h-11 text-xs font-medium text-error hover:bg-surface active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2"
        >
          삭제
        </button>
      </div>
    </li>
  )
}
