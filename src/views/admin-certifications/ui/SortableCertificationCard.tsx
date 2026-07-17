'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import type { Certification } from '@/entities/certification'

/** 이미지 항목은 백엔드 절대 URL로 보정한다(catalog/news 패턴). */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
function resolveSrc(src: string): string {
  return src.startsWith('http') ? src : `${API_BASE}${src}`
}

interface SortableCertificationCardProps {
  certification: Certification
  index: number
  onDelete: (id: string) => void
}

/**
 * 드래그로 순서를 바꿀 수 있는 인증서·특허증 카드.
 * 세로형 문서 이미지이므로 aspect-[3/4] 비율로 렌더한다.
 * certification은 이미지 교체 엔드포인트가 없어 삭제만 제공한다.
 */
export function SortableCertificationCard({
  certification,
  index,
  onDelete,
}: SortableCertificationCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: certification.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex flex-col gap-2 rounded-image border border-hairline bg-surface-white p-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted tabular-nums">
          {index + 1}
        </span>
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

      {/* token 없음: aspect-[3/4] — 세로형 문서 이미지 비율, 인증서 관리 전용 1회성 수치 */}
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-btn bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolveSrc(certification.imageUrl)}
          alt={`인증서 ${index + 1}`}
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onDelete(certification.id)}
          className="flex-1 inline-flex items-center justify-center rounded-btn border border-error/30 bg-transparent px-3 py-2 min-h-11 text-xs font-medium text-error hover:bg-surface active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
