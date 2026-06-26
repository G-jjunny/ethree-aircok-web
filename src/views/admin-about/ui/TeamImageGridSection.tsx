'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/shared/ui'
import {
  useDeleteTeamImageMutation,
  useReorderTeamImagesMutation,
} from '@/features/team-image-editor'
import type { TeamImage } from '@/entities/team-image'

/** 이미지 항목은 백엔드 절대 URL로 보정한다(catalog SortableImageCard 패턴). */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
function resolveSrc(src: string): string {
  return src.startsWith('http') ? src : `${API_BASE}${src}`
}

interface TeamImageGridSectionProps {
  images: TeamImage[]
  isLoading: boolean
}

/**
 * 팀 이미지 그리드(어드민).
 * 위/아래 이동 버튼으로 순서를 바꾸고(useReorderTeamImagesMutation, items 매핑),
 * 카드별 삭제(ConfirmDialog)를 제공한다.
 */
export function TeamImageGridSection({
  images,
  isLoading,
}: TeamImageGridSectionProps) {
  // 즉각적인 UI 반영을 위한 로컬 순서 상태.
  // 서버 데이터(images)가 갱신되면 "렌더 중 state 조정" 패턴으로 동기화한다.
  const [items, setItems] = useState<TeamImage[]>(images)
  const [syncedFrom, setSyncedFrom] = useState<TeamImage[]>(images)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  if (syncedFrom !== images) {
    setSyncedFrom(images)
    setItems(images)
  }

  const deleteMutation = useDeleteTeamImageMutation()
  const reorderMutation = useReorderTeamImagesMutation()

  const reorder = (next: TeamImage[]) => {
    setItems(next) // 낙관적 업데이트
    reorderMutation.mutate(
      next.map((img, index) => ({ id: img.id, order: index })),
      {
        onSuccess: () => toast.success('순서가 변경되었습니다'),
        onError: () => {
          toast.error('순서 변경에 실패했습니다')
          setItems(images) // 롤백
        },
      },
    )
  }

  const handleMoveUp = (index: number) => {
    if (index <= 0) return
    const next = [...items]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    reorder(next)
  }

  const handleMoveDown = (index: number) => {
    if (index >= items.length - 1) return
    const next = [...items]
    ;[next[index + 1], next[index]] = [next[index], next[index + 1]]
    reorder(next)
  }

  const handleDeleteConfirm = () => {
    if (!deletingId) return
    deleteMutation.mutate(deletingId, {
      onSuccess: () => {
        toast.success('이미지가 삭제되었습니다')
        setDeletingId(null)
      },
      onError: () => {
        toast.error('이미지 삭제에 실패했습니다')
        setDeletingId(null)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="bg-surface-white rounded-xl border border-border-light p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-surface-light animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-surface-white rounded-xl border border-border-light px-6 py-16 flex flex-col items-center justify-center text-center gap-3">
        <svg
          className="w-10 h-10 text-secondary-dark"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M3 9l4-4 4 4 4-4 4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8.5" cy="14.5" r="1.5" fill="currentColor" />
        </svg>
        <p className="text-nav text-secondary-dark [word-break:keep-all]">
          등록된 팀 이미지가 없습니다.
        </p>
        <p className="text-xs text-secondary-dark [word-break:keep-all]">
          위 업로드 영역에서 이미지를 추가하세요.
        </p>
      </div>
    )
  }

  return (
    <section className="bg-surface-white rounded-xl border border-border-light p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-border-light pb-4">
        <h2 className="text-nav font-semibold text-heading-dark">
          팀 이미지 ({items.length})
        </h2>
        <p className="text-xs text-secondary-dark">
          위/아래 버튼으로 순서를 변경하세요
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((image, index) => (
          <div
            key={image.id}
            className="relative flex flex-col gap-2 rounded-lg border border-border-light bg-surface-white p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-secondary-dark tabular-nums">
                {index + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="위로 이동"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0 || reorderMutation.isPending}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md text-secondary-dark hover:text-heading-dark hover:bg-surface-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M7 11V3m0 0L3.5 6.5M7 3l3.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="아래로 이동"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === items.length - 1 || reorderMutation.isPending}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md text-secondary-dark hover:text-heading-dark hover:bg-surface-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M7 3v8m0 0l3.5-3.5M7 11L3.5 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="relative w-full aspect-square overflow-hidden rounded-md bg-surface-light">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveSrc(image.imageUrl)}
                alt={`팀 이미지 ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <button
              type="button"
              onClick={() => setDeletingId(image.id)}
              className="inline-flex items-center justify-center rounded-md border border-error/30 bg-transparent px-3 py-2 min-h-[44px] text-xs font-medium text-error hover:bg-surface-light active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2"
            >
              삭제
            </button>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={deletingId !== null}
        title="팀 이미지 삭제"
        description="이 이미지를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
        confirmLabel="삭제"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </section>
  )
}
