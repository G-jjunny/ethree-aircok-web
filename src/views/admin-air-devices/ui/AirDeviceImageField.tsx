'use client'

import { useRef } from 'react'
import { toast } from 'sonner'
import type { AirDevice } from '@/entities/air-device'
import { useUploadAirDeviceImageMutation } from '@/features/air-device-editor'
import { extractUploadError } from '@/shared/api'
import { IMAGE_FILE_ACCEPT, validateImageFile } from '@/shared/lib'
import { PagePlaceholder } from '@/shared/ui'

interface AirDeviceImageFieldProps {
  /** 대상 측정기. `imageUrl`이 null인 상태가 기본값이다(사진 미등록). */
  device: AirDevice
  className?: string
}

/**
 * 이미 존재하는 측정기의 제품 사진 표시 + 즉시 업로드/교체 필드.
 *
 * 사진은 JSON body가 아니라 multipart 전용 경로(POST /air-devices/:id/image)이므로,
 * 폼 저장과 무관하게 파일 선택 즉시 업로드된다. 목록 카드와 수정 모달이 함께 쓴다.
 */
export function AirDeviceImageField({
  device,
  className = '',
}: AirDeviceImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadMutation = useUploadAirDeviceImageMutation()

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
      await uploadMutation.mutateAsync({ id: device.id, file })
      toast.success('제품 사진이 저장되었습니다')
    } catch (error) {
      // 훅은 에러를 그대로 throw한다 — 서버 메시지를 그대로 노출한다.
      toast.error(extractUploadError(error, '제품 사진 업로드에 실패했습니다'))
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      <div className="relative w-full aspect-card overflow-hidden rounded-btn bg-surface">
        {device.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={device.imageUrl}
            alt={`${device.name} 제품 사진`}
            className="absolute inset-0 w-full h-full object-contain"
          />
        ) : (
          <PagePlaceholder
            variant="surface"
            label="NO PHOTO"
            rounded="rounded-none"
            bordered={false}
            className="absolute inset-0 w-full h-full"
          />
        )}
        {uploadMutation.isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-overlay-dark-60">
            <span className="text-xs text-white">업로드 중...</span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploadMutation.isPending}
        className="inline-flex items-center justify-center rounded-btn border border-hairline bg-transparent px-4 py-2 min-h-11 text-xs font-medium text-ink hover:bg-surface active:scale-[0.97] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        {device.imageUrl ? '사진 교체' : '사진 업로드'}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={IMAGE_FILE_ACCEPT}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
