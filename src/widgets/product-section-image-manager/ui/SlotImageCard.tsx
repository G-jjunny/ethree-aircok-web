'use client'

import { useRef } from 'react'
import { toast } from 'sonner'
import { useUpsertProductSectionImageMutation } from '@/features/product-section-image-editor'
import type { ProductImageSlot } from '@/entities/product-section-image'
import { extractUploadError } from '@/shared/api'
import { IMAGE_FILE_ACCEPT, validateImageFile } from '@/shared/lib'
import { PagePlaceholder } from '@/shared/ui'

interface SlotImageCardProps {
  slot: ProductImageSlot
  /** 사용자에게 보여줄 슬롯 이름(예: '대시보드'). */
  label: string
  /** 슬롯이 실제로 노출되는 위치 설명. */
  description?: string
  /** 등록된 이미지 URL. **미등록이 정상 케이스**이며 이때 null이다. */
  imageUrl: string | null
  onDelete: (slot: ProductImageSlot) => void
}

/**
 * 고정 슬롯 1개를 담당하는 이미지 카드.
 * 슬롯당 최대 1장이며 신규 등록과 교체가 동일한 요청(PUT upsert)이므로 버튼도 하나다.
 * 순서 개념이 없는 모델이라 DnD를 두지 않는다.
 */
export function SlotImageCard({
  slot,
  label,
  description,
  imageUrl,
  onDelete,
}: SlotImageCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const upsertMutation = useUpsertProductSectionImageMutation()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    // 1차 방어: 서버 제약(MIME/5MB)을 클라이언트에서 먼저 거른다.
    const validationError = validateImageFile(file)
    if (validationError) {
      toast.error(validationError)
      return
    }

    try {
      await upsertMutation.mutateAsync({ slot, file })
      toast.success(`"${label}" 이미지가 저장되었습니다`)
    } catch (error) {
      // 훅은 에러를 그대로 throw한다 — 서버 메시지를 그대로 노출한다.
      toast.error(
        extractUploadError(error, `"${label}" 이미지 업로드에 실패했습니다`),
      )
    }
  }

  const isUploading = upsertMutation.isPending

  return (
    <div className="flex flex-col gap-3 rounded-image border border-hairline bg-surface-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-ink [word-break:keep-all]">
            {label}
          </span>
          {description && (
            <span className="text-xs text-muted [word-break:keep-all]">
              {description}
            </span>
          )}
        </div>
        <span
          className={
            imageUrl
              ? 'shrink-0 rounded-pill border border-tint-border bg-tint px-2 py-0.5 text-xs font-medium text-brand'
              : 'shrink-0 rounded-pill border border-hairline bg-surface px-2 py-0.5 text-xs font-medium text-muted'
          }
        >
          {imageUrl ? '등록됨' : '미등록'}
        </span>
      </div>

      <div className="relative w-full aspect-card overflow-hidden rounded-btn bg-surface">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={`${label} 등록 이미지`}
            className="absolute inset-0 w-full h-full object-contain"
          />
        ) : (
          <PagePlaceholder
            variant="surface"
            label="NO IMAGE"
            rounded="rounded-none"
            bordered={false}
            className="absolute inset-0 w-full h-full"
          />
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-overlay-dark-60">
            <span className="text-xs text-white">업로드 중...</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-1 inline-flex items-center justify-center rounded-btn border border-hairline bg-transparent px-4 py-2 min-h-11 text-xs font-medium text-ink hover:bg-surface active:scale-[0.97] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          {imageUrl ? '교체' : '업로드'}
        </button>
        <button
          type="button"
          onClick={() => onDelete(slot)}
          disabled={!imageUrl || isUploading}
          className="flex-1 inline-flex items-center justify-center rounded-btn border border-error/30 bg-transparent px-4 py-2 min-h-11 text-xs font-medium text-error hover:bg-surface active:scale-[0.97] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2"
        >
          삭제
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={IMAGE_FILE_ACCEPT}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}
