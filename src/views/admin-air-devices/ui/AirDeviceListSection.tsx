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
import type { AirDevice } from '@/entities/air-device'
import {
  useDeleteAirDeviceMutation,
  useReorderAirDevicesMutation,
} from '@/features/air-device-editor'
import { extractUploadError } from '@/shared/api'
import { ConfirmDialog } from '@/shared/ui'
import { SortableAirDeviceCard } from './SortableAirDeviceCard'

interface AirDeviceListSectionProps {
  devices: AirDevice[]
  isLoading: boolean
  onEdit: (id: string) => void
}

/**
 * 측정기 목록(미공개 포함) + 드래그앤드롭 순서 변경.
 * 순서 변경은 낙관적으로 반영하고 실패 시 서버 데이터로 롤백한다.
 */
export function AirDeviceListSection({
  devices,
  isLoading,
  onEdit,
}: AirDeviceListSectionProps) {
  // 드래그 중 즉각 반영을 위한 로컬 순서 상태.
  // 서버 데이터가 갱신되면 "렌더 중 state 조정"으로 동기화한다
  // (useEffect+setState 대신 React 공식 권장 방식 — CatalogImageGridSection과 동일 패턴).
  const [items, setItems] = useState<AirDevice[]>(devices)
  const [syncedFrom, setSyncedFrom] = useState<AirDevice[]>(devices)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  if (syncedFrom !== devices) {
    setSyncedFrom(devices)
    setItems(devices)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const deleteMutation = useDeleteAirDeviceMutation()
  const reorderMutation = useReorderAirDevicesMutation()

  const deletingDevice = items.find((device) => device.id === deletingId) ?? null

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((item) => item.id === active.id)
    const newIndex = items.findIndex((item) => item.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const next = arrayMove(items, oldIndex, newIndex)
    setItems(next) // 낙관적 업데이트

    // 훅이 인덱스→order 매핑을 처리하므로 정렬된 id 배열만 넘긴다.
    reorderMutation.mutate(
      next.map((item) => item.id),
      {
        onSuccess: () => toast.success('순서가 변경되었습니다'),
        onError: () => {
          toast.error('순서 변경에 실패했습니다')
          setItems(devices) // 롤백
        },
      },
    )
  }

  const handleDeleteConfirm = () => {
    if (!deletingId) return
    deleteMutation.mutate(deletingId, {
      onSuccess: () => {
        toast.success('측정기가 삭제되었습니다')
        setDeletingId(null)
      },
      onError: (error) => {
        toast.error(extractUploadError(error, '측정기 삭제에 실패했습니다'))
        setDeletingId(null)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="bg-surface-white rounded-card border border-hairline p-6 flex flex-col gap-4">
        {[1, 2].map((key) => (
          // token 없음: h-40 — 스켈레톤 카드 높이(1회성 수치)
          <div key={key} className="h-40 rounded-image bg-surface animate-pulse" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-surface-white rounded-card border border-hairline px-6 py-16 flex flex-col items-center justify-center text-center gap-3">
        <svg
          className="w-12 h-12 text-faint"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="4"
            width="18"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M7 20h10M12 18v2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M7 12l3-3 2.5 2.5L15 8l2 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-sm text-muted [word-break:keep-all]">
          등록된 공기질 측정기가 없습니다.
        </p>
        <p className="text-xs text-faint [word-break:keep-all]">
          우측 상단 &ldquo;측정기 등록&rdquo; 버튼으로 추가하세요.
        </p>
      </div>
    )
  }

  return (
    <section className="bg-surface-white rounded-card border border-hairline p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2 border-b border-hairline pb-4">
        <h2 className="text-sm font-semibold text-ink">
          공기질 측정기 ({items.length})
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
            {items.map((device, index) => (
              <SortableAirDeviceCard
                key={device.id}
                device={device}
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
        title="측정기 삭제"
        description={
          deletingDevice
            ? `"${deletingDevice.name}" 측정기를 삭제하시겠습니까? 측정 항목과 제품 사진도 함께 삭제되며 복구할 수 없습니다.`
            : undefined
        }
        confirmLabel="삭제"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </section>
  )
}
