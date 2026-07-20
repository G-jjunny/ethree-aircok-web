'use client'

import { useRef } from 'react'
import { toast } from 'sonner'
import type { ServiceReview } from '@/entities/service-review'
import { useUploadServiceReviewImageMutation } from '@/features/service-review-editor'
import { extractUploadError } from '@/shared/api'
import { IMAGE_FILE_ACCEPT, validateImageFile } from '@/shared/lib'

/** 이미지 항목은 백엔드 절대 URL로 보정한다(catalog/news 패턴). */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
function resolveSrc(src: string): string {
  return src.startsWith('http') ? src : `${API_BASE}${src}`
}

interface ServiceReviewImageFieldProps {
  /** 대상 후기. `imageUrl`이 null인 상태가 정상 기본값이다(아바타 미등록). */
  review: ServiceReview
  className?: string
}

/**
 * 이미 존재하는 후기의 아바타 표시 + 즉시 업로드/교체 필드.
 *
 * 아바타는 JSON body가 아니라 multipart 전용 경로(POST /service-reviews/:id/image)이므로,
 * 폼 저장과 무관하게 파일 선택 즉시 업로드된다. 목록 카드와 수정 모달이 함께 쓴다.
 */
export function ServiceReviewImageField({
  review,
  className = '',
}: ServiceReviewImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadMutation = useUploadServiceReviewImageMutation()

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
      await uploadMutation.mutateAsync({ id: review.id, file })
      toast.success('아바타가 저장되었습니다')
    } catch (error) {
      toast.error(extractUploadError(error, '아바타 업로드에 실패했습니다'))
    }
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`.trim()}>
      <div className="relative w-20 h-20 overflow-hidden rounded-full bg-surface">
        {review.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolveSrc(review.imageUrl)}
            alt="후기 아바타"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-faint">
            NO IMG
          </div>
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
        className="inline-flex items-center justify-center rounded-btn border border-hairline bg-transparent px-3 py-2 min-h-11 text-xs font-medium text-ink hover:bg-surface active:scale-[0.97] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        {review.imageUrl ? '아바타 교체' : '아바타 업로드'}
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
