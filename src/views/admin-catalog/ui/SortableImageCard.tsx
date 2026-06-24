'use client'

import { useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { CatalogImage } from '@/entities/catalog'

/** 상대 경로 이미지 URL을 백엔드 절대 URL로 보정한다(NewsImage 패턴). */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
function resolveSrc(src: string): string {
  return src.startsWith('http') ? src : `${API_BASE}${src}`
}

interface SortableImageCardProps {
  image: CatalogImage
  index: number
  onReplace: (id: string, file: File) => void
  onDelete: (id: string) => void
  isReplacing: boolean
}

/**
 * 드래그로 순서를 바꿀 수 있는 카탈로그 이미지 카드.
 * @dnd-kit/sortable의 useSortable로 드래그 핸들/트랜스폼을 연결한다.
 */
export function SortableImageCard({
  image,
  index,
  onReplace,
  onDelete,
  isReplacing,
}: SortableImageCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onReplace(image.id, file)
    e.target.value = ''
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
          className="inline-flex items-center justify-center w-7 h-7 rounded-sm text-secondary-dark hover:text-heading-dark hover:bg-surface-light transition-colors cursor-grab active:cursor-grabbing touch-none"
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

      {/* token 없음: aspect-[3/4] — 카탈로그 책자 페이지(세로형) 비율, 카탈로그 전용 1회성 수치 */}
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-md bg-surface-light">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolveSrc(image.url)}
          alt={image.alt ?? `카탈로그 ${index + 1} 페이지`}
          className="absolute inset-0 w-full h-full object-contain"
        />
        {isReplacing && (
          <div className="absolute inset-0 flex items-center justify-center bg-overlay-dark-60">
            <span className="text-xs text-heading-light">교체 중...</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isReplacing}
          className="flex-1 inline-flex items-center justify-center rounded-md border border-border-light bg-surface-white px-3 py-2 min-h-[44px] text-xs font-medium text-heading-dark hover:bg-surface-light transition-colors disabled:opacity-40"
        >
          교체
        </button>
        <button
          type="button"
          onClick={() => onDelete(image.id)}
          className="flex-1 inline-flex items-center justify-center rounded-md border border-border-light bg-surface-white px-3 py-2 min-h-[44px] text-xs font-medium text-error hover:bg-surface-light transition-colors"
        >
          삭제
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}
