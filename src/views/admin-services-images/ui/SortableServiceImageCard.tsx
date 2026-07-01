'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ServiceImage } from '@/entities/service-image'

/** 이미지 항목은 백엔드 절대 URL로 보정한다(catalog/news 패턴). */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
function resolveSrc(src: string): string {
  return src.startsWith('http') ? src : `${API_BASE}${src}`
}

interface SortableServiceImageCardProps {
  image: ServiceImage
  index: number
  onDelete: (id: string) => void
}

/**
 * 드래그로 순서를 바꿀 수 있는 제품군 이미지 카드.
 * @dnd-kit/sortable의 useSortable로 드래그 핸들/트랜스폼을 연결한다.
 */
export function SortableServiceImageCard({
  image,
  index,
  onDelete,
}: SortableServiceImageCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex flex-col gap-2 rounded-lg border border-border-light bg-surface-white p-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-secondary-dark tabular-nums">
          {index + 1}
        </span>
        {/* 드래그 핸들 */}
        <button
          type="button"
          aria-label="순서 변경 드래그"
          className="inline-flex items-center justify-center w-7 h-7 rounded-md text-secondary-dark hover:text-heading-dark hover:bg-surface-light transition-colors cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M5 3.5h.01M9 3.5h.01M5 7h.01M9 7h.01M5 10.5h.01M9 10.5h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* token 없음: aspect-[3/4] — 세로형 인포그래픽 비율, 이미지 관리 전용 1회성 수치 */}
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-md bg-surface-light">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolveSrc(image.imageUrl)}
          alt={`제품군 이미지 ${index + 1}`}
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onDelete(image.id)}
          className="flex-1 inline-flex items-center justify-center rounded-md border border-error/30 bg-transparent px-3 py-2 min-h-[44px] text-xs font-medium text-error hover:bg-surface-light active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
