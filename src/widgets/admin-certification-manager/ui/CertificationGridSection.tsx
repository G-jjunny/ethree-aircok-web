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
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/shared/ui'
import { extractUploadError } from '@/shared/api'
import {
  useDeleteCertificationMutation,
  useReorderCertificationsMutation,
} from '@/features/certification-editor'
import type { Certification } from '@/entities/certification'
import { SortableCertificationCard } from './SortableCertificationCard'

interface CertificationGridSectionProps {
  certifications: Certification[]
  isLoading: boolean
}

/**
 * 정렬 가능한 인증서·특허증 그리드.
 * 드래그앤드롭으로 순서를 바꾸고(@dnd-kit), 삭제 mutation을 연결한다.
 * certification은 백엔드에 교체(PATCH:id) 엔드포인트가 없어 교체 기능은 제공하지 않는다.
 */
export function CertificationGridSection({
  certifications,
  isLoading,
}: CertificationGridSectionProps) {
  // 드래그 중 즉각 반영을 위한 로컬 순서 상태.
  // 서버 데이터가 갱신되면 "렌더 중 state 조정"으로 동기화한다(React 공식 권장 방식).
  const [items, setItems] = useState<Certification[]>(certifications)
  const [syncedFrom, setSyncedFrom] = useState<Certification[]>(certifications)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  if (syncedFrom !== certifications) {
    setSyncedFrom(certifications)
    setItems(certifications)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const deleteMutation = useDeleteCertificationMutation()
  const reorderMutation = useReorderCertificationsMutation()

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const next = arrayMove(items, oldIndex, newIndex)
    setItems(next) // 낙관적 업데이트

    reorderMutation.mutate(
      next.map((i) => i.id),
      {
        onSuccess: () => toast.success('순서가 변경되었습니다'),
        onError: () => {
          toast.error('순서 변경에 실패했습니다')
          setItems(certifications) // 롤백
        },
      },
    )
  }

  const handleDeleteConfirm = () => {
    if (!deletingId) return
    deleteMutation.mutate(deletingId, {
      onSuccess: () => {
        toast.success('이미지가 삭제되었습니다')
        setDeletingId(null)
      },
      onError: (error) => {
        toast.error(extractUploadError(error, '이미지 삭제에 실패했습니다'))
        setDeletingId(null)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="bg-surface-white rounded-card border border-hairline p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            // token 없음: aspect-[3/4] — 세로형 문서 이미지 비율, 인증서 관리 전용 1회성 수치
            <div
              key={i}
              className="aspect-[3/4] rounded-image bg-surface animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-surface-white rounded-card border border-hairline px-6 py-16 flex flex-col items-center justify-center text-center gap-3">
        <svg
          className="w-12 h-12 text-muted"
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
        <p className="text-sm text-muted [word-break:keep-all]">
          등록된 인증서·특허증이 없습니다.
        </p>
        <p className="text-xs text-faint [word-break:keep-all]">
          위 업로드 영역에서 이미지를 추가하세요.
        </p>
      </div>
    )
  }

  return (
    <section className="bg-surface-white rounded-card border border-hairline p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <h2 className="text-sm font-semibold text-ink">
          특허·인증서 ({items.length})
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
        <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((certification, index) => (
              <SortableCertificationCard
                key={certification.id}
                certification={certification}
                index={index}
                onDelete={setDeletingId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <ConfirmDialog
        open={deletingId !== null}
        title="인증서 삭제"
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
