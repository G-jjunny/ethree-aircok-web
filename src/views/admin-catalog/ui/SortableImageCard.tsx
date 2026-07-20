'use client'

import { useEffect, useRef, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { renderPdfToImages } from '@/shared/lib'
import type { CatalogImage } from '@/entities/catalog'

/** 이미지 항목은 백엔드 절대 URL로 보정한다(NewsImage 패턴). */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
function resolveSrc(src: string): string {
  return src.startsWith('http') ? src : `${API_BASE}${src}`
}

/** PDF는 동일 출처(`/uploads/...`)로 fetch해 CORS를 회피한다. */
function resolveSameOriginPdfSrc(src: string): string {
  if (!src.startsWith('http')) return src
  try {
    return new URL(src).pathname
  } catch {
    return src
  }
}

/**
 * PDF 항목의 첫 페이지 썸네일 dataURL을 비동기로 렌더한다.
 * 실패 시 null을 반환해 호출부가 플레이스홀더로 폴백하게 한다.
 */
function usePdfThumbnail(enabled: boolean, fileUrl: string): string | null {
  const [thumb, setThumb] = useState<string | null>(null)
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    void renderPdfToImages(resolveSameOriginPdfSrc(fileUrl), { maxPages: 1 })
      .then((pages) => {
        if (!cancelled) setThumb(pages[0] ?? null)
      })
      .catch(() => {
        if (!cancelled) setThumb(null)
      })
    return () => {
      cancelled = true
      // enabled/fileUrl 변경 또는 언마운트 시 이전 썸네일을 비워 stale 표시를 방지한다.
      setThumb(null)
    }
  }, [enabled, fileUrl])
  // PDF가 아닌 경우 썸네일은 사용되지 않으므로 항상 null을 반환한다.
  return enabled ? thumb : null
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
  const isPdf = image.fileType === 'pdf'
  const pdfThumb = usePdfThumbnail(isPdf, image.fileUrl)
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
      className="relative flex flex-col gap-2 rounded-image border border-hairline bg-surface-white p-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted tabular-nums">
          {index + 1}
        </span>
        {/* 드래그 핸들 */}
        <button
          type="button"
          aria-label="순서 변경 드래그"
          className="inline-flex items-center justify-center w-7 h-7 rounded-btn text-muted hover:text-ink hover:bg-surface transition-colors cursor-grab active:cursor-grabbing touch-none"
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
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-btn bg-surface">
        {isPdf && !pdfThumb ? (
          // PDF 첫 페이지 렌더 전/실패 시 PDF 표시 플레이스홀더
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted">
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 3h7l4 4v14a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M13 3v5h5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs font-semibold tracking-wide">PDF</span>
          </div>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={isPdf ? (pdfThumb ?? '') : resolveSrc(image.fileUrl)}
              alt={`카탈로그 ${index + 1} 페이지`}
              className="absolute inset-0 w-full h-full object-contain"
            />
            {isPdf && (
              <span className="absolute left-1.5 top-1.5 rounded-btn bg-overlay-dark-60 px-1.5 py-0.5 text-xs font-semibold text-white">
                PDF
              </span>
            )}
          </>
        )}
        {isReplacing && (
          <div className="absolute inset-0 flex items-center justify-center bg-overlay-dark-60">
            <span className="text-xs text-white">교체 중...</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isReplacing}
          className="flex-1 inline-flex items-center justify-center rounded-btn border border-hairline bg-transparent px-3 py-2 min-h-11 text-xs font-medium text-ink hover:bg-surface active:scale-[0.97] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          교체
        </button>
        <button
          type="button"
          onClick={() => onDelete(image.id)}
          className="flex-1 inline-flex items-center justify-center rounded-btn border border-error/30 bg-transparent px-3 py-2 min-h-11 text-xs font-medium text-error hover:bg-surface active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2"
        >
          삭제
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}
