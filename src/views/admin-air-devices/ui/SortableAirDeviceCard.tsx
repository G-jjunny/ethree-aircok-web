'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import type { AirDevice } from '@/entities/air-device'
import { AIR_DEVICE_SPEC_FIELDS } from '../model/airDeviceFields'
import { AirDeviceImageField } from './AirDeviceImageField'

interface SortableAirDeviceCardProps {
  device: AirDevice
  index: number
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

/**
 * 드래그로 순서를 바꿀 수 있는 측정기 카드.
 * 제품 사진은 카드에서 바로 업로드/교체할 수 있다(multipart 전용 경로).
 */
export function SortableAirDeviceCard({
  device,
  index,
  onEdit,
  onDelete,
}: SortableAirDeviceCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: device.id })

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
              device.published
                ? 'rounded-pill border border-tint-border bg-tint px-2 py-0.5 text-xs font-medium text-brand'
                : 'rounded-pill border border-hairline bg-surface px-2 py-0.5 text-xs font-medium text-muted'
            }
          >
            {device.published ? '공개' : '미공개'}
          </span>
        </div>
        <button
          type="button"
          aria-label={`${device.name} 순서 변경 드래그`}
          className="inline-flex items-center justify-center w-11 h-11 rounded-btn text-muted hover:text-ink hover:bg-surface transition-colors cursor-grab active:cursor-grabbing touch-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        {/* 제품 사진 — imageUrl이 null인 상태가 기본값이다 */}
        {/* token 없음: sm:w-48 — 카드 내 사진 칼럼 폭(1회성 레이아웃 수치) */}
        <AirDeviceImageField device={device} className="w-full sm:w-48 shrink-0" />

        <div className="flex-1 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-ink [word-break:keep-all]">
              {device.name}
            </h3>
            <p className="text-xs text-muted [word-break:keep-all]">
              {device.subtitle}
            </p>
            <span className="mt-1 self-start rounded-pill border border-hairline bg-surface px-2 py-0.5 text-xs text-ink">
              {device.badge}
            </span>
          </div>

          {/* 사양 */}
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
            {AIR_DEVICE_SPEC_FIELDS.map((field) => (
              <div key={field.name} className="flex gap-2 text-xs">
                <dt className="shrink-0 text-faint">{field.label}</dt>
                <dd className="text-muted [word-break:keep-all]">
                  {device[field.name]}
                </dd>
              </div>
            ))}
          </dl>

          {/* 측정 항목 — key는 서버 id 대신 code를 쓴다(부모 PATCH마다 id가 재발급됨) */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-faint">
              측정 항목 ({device.items.length})
            </span>
            {device.items.length === 0 ? (
              <span className="text-xs text-muted">등록된 측정 항목이 없습니다</span>
            ) : (
              <ul className="flex flex-wrap gap-1">
                {device.items.map((item) => (
                  <li
                    key={`${item.code}-${item.order}`}
                    className="rounded-pill border border-hairline bg-surface px-2 py-0.5 text-xs text-muted"
                  >
                    <span className="font-medium text-ink">{item.code}</span>{' '}
                    {item.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-hairline pt-4">
        <button
          type="button"
          onClick={() => onEdit(device.id)}
          className="inline-flex items-center justify-center rounded-btn border border-hairline bg-transparent px-4 py-2 min-h-11 text-xs font-medium text-ink hover:bg-surface active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          수정
        </button>
        <button
          type="button"
          onClick={() => onDelete(device.id)}
          className="inline-flex items-center justify-center rounded-btn border border-error/30 bg-transparent px-4 py-2 min-h-11 text-xs font-medium text-error hover:bg-surface active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2"
        >
          삭제
        </button>
      </div>
    </li>
  )
}
