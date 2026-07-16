'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  adminProductSectionImageListQueryOptions,
  toSlotImageMap,
} from '@/entities/product-section-image'
import type { ProductImageSlot } from '@/entities/product-section-image'
import { useDeleteProductSectionImageMutation } from '@/features/product-section-image-editor'
import { extractUploadError } from '@/shared/api'
import { ConfirmDialog } from '@/shared/ui'
import { SlotImageCard } from './SlotImageCard'

/** 관리 대상 슬롯 1개의 표시 설정. */
export interface ProductSectionImageSlotConfig {
  slot: ProductImageSlot
  /** 사용자에게 보여줄 슬롯 이름(예: '대시보드'). */
  label: string
  /** 슬롯이 실제로 노출되는 위치 설명. */
  description?: string
}

export interface ProductSectionImageManagerProps {
  /** 섹션 제목(예: '클라우드 모니터링 이미지'). */
  title: string
  /** 섹션 설명. */
  description?: string
  /** 이 섹션에서 관리할 슬롯 목록. 렌더 순서 = 배열 순서. */
  slots: readonly ProductSectionImageSlotConfig[]
}

/**
 * `/services` 섹션 이미지의 슬롯 고정 관리 블록.
 *
 * 슬롯 목록/라벨만 바꿔 여러 어드민 화면(실내·주방)에서 재사용한다.
 * 데이터는 슬롯 전체를 한 번에 내려주는 어드민 목록 엔드포인트(GET /product-images/admin) 하나이므로,
 * 한 페이지에 이 위젯이 여러 개 있어도 TanStack Query 캐시가 요청을 합쳐준다.
 *
 * 공개 GET(/product-images)이 아니라 어드민 GET을 쓰는 이유: 공개 응답은
 * `Cache-Control: public, max-age=60`이라 삭제 성공(204) 후 재요청해도 브라우저 HTTP 캐시가
 * 낡은 목록을 돌려줘 삭제된 이미지가 계속 보였다. 어드민 GET은 no-store다.
 *
 * 이 모델에는 order 컬럼이 없다(슬롯 = 고정 자리) — 따라서 DnD 정렬을 제공하지 않는다.
 */
export function ProductSectionImageManager({
  title,
  description,
  slots,
}: ProductSectionImageManagerProps) {
  const { data: images = [], isLoading } = useQuery(
    adminProductSectionImageListQueryOptions(),
  )
  const [deletingSlot, setDeletingSlot] = useState<ProductImageSlot | null>(null)
  const deleteMutation = useDeleteProductSectionImageMutation()

  // 미등록 슬롯은 응답 배열에 아예 없으므로 전 슬롯 null 채움 맵으로 정규화한다.
  const slotImages = toSlotImageMap(images)
  const deletingLabel =
    slots.find((config) => config.slot === deletingSlot)?.label ?? ''

  // 슬롯이 1개뿐인 섹션(브랜드 배경 등)에서 카드가 지나치게 좁아지지 않도록 열 수를 낮춘다.
  const gridColumnsClass =
    slots.length === 1
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'

  const handleDeleteConfirm = () => {
    if (!deletingSlot) return
    deleteMutation.mutate(deletingSlot, {
      onSuccess: () => {
        toast.success(`"${deletingLabel}" 이미지가 삭제되었습니다`)
        setDeletingSlot(null)
      },
      onError: (error) => {
        toast.error(
          extractUploadError(error, `"${deletingLabel}" 이미지 삭제에 실패했습니다`),
        )
        setDeletingSlot(null)
      },
    })
  }

  return (
    <section className="bg-surface-white rounded-card border border-hairline p-6 flex flex-col gap-4">
      <div className="flex flex-col gap-1 border-b border-hairline pb-4">
        <h2 className="text-sm font-semibold text-ink [word-break:keep-all]">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-muted [word-break:keep-all]">{description}</p>
        )}
      </div>

      <div className={`grid ${gridColumnsClass} gap-4`}>
        {isLoading
          ? slots.map((config) => (
              <div
                key={config.slot}
                className="aspect-card rounded-image bg-surface animate-pulse"
              />
            ))
          : slots.map((config) => (
              <SlotImageCard
                key={config.slot}
                slot={config.slot}
                label={config.label}
                description={config.description}
                imageUrl={slotImages[config.slot]}
                onDelete={setDeletingSlot}
              />
            ))}
      </div>

      <ConfirmDialog
        open={deletingSlot !== null}
        title="슬롯 이미지 삭제"
        description={`"${deletingLabel}" 이미지를 삭제하시겠습니까? 삭제 후 해당 자리는 미등록 상태가 되며 복구할 수 없습니다.`}
        confirmLabel="삭제"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingSlot(null)}
      />
    </section>
  )
}
