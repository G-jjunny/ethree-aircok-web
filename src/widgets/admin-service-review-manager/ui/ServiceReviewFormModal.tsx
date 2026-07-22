'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import type { ServiceReview } from '@/entities/service-review'
import {
  serviceReviewSchema,
  useCreateServiceReviewMutation,
  useUpdateServiceReviewMutation,
  useUploadServiceReviewImageMutation,
} from '@/features/service-review-editor'
import type { ServiceReviewFormValues } from '@/features/service-review-editor'
import { extractUploadError } from '@/shared/api'
import { IMAGE_FILE_ACCEPT, validateImageFile } from '@/shared/lib'
import { Button } from '@/shared/ui'
import { ServiceReviewImageField } from './ServiceReviewImageField'

type ServiceReviewFormModalProps =
  | {
      mode: 'create'
      review?: undefined
      imageWarning?: undefined
      onClose: () => void
      /**
       * 레코드 생성은 성공했지만 아바타 업로드만 실패한 **부분 실패** 콜백.
       * 호출부가 수정 화면으로 전환해 재시도를 유도한다.
       */
      onPartialSuccess: (review: ServiceReview, message: string) => void
    }
  | {
      mode: 'edit'
      review: ServiceReview
      /** 부분 실패 후 전환된 경우 상단에 남기는 경고. */
      imageWarning: string | null
      onClose: () => void
      onPartialSuccess?: undefined
    }

const inputBaseClass =
  'w-full bg-surface rounded-btn px-4 py-3 min-h-11 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:border-transparent transition-shadow'
const inputNormalClass = `${inputBaseClass} border border-hairline focus:ring-brand`
const inputErrorClass = `${inputBaseClass} border border-error focus:ring-error`

/** 서버 응답을 폼 값으로 정규화한다. 신규 등록이면 빈 값(공개=true)으로 시작한다. */
function toFormValues(review?: ServiceReview): ServiceReviewFormValues {
  if (!review) {
    return { quote: '', role: '', age: '', published: true }
  }
  return {
    quote: review.quote,
    role: review.role,
    age: review.age,
    published: review.published,
  }
}

/**
 * 진단 후기 생성/수정 모달.
 *
 * **생성은 2단계다**: ① 레코드 생성(JSON, imageUrl 없음) → ② 아바타 업로드(multipart).
 * imageUrl/id는 JSON body에 넣을 수 없으므로(forbidNonWhitelisted → 400) 아바타는
 * 생성 응답의 id를 받아 이어서 올린다. ①은 성공하고 ②만 실패하면 레코드가 남으므로,
 * 조용히 삼키지 않고 `onPartialSuccess`로 수정 화면 전환을 요청해 재시도를 유도한다.
 *
 * 수정 모드에서는 아바타가 폼과 분리되어 파일 선택 즉시 업로드된다(ServiceReviewImageField).
 */
export function ServiceReviewFormModal(props: ServiceReviewFormModalProps) {
  const { mode, review, onClose } = props
  const fileInputRef = useRef<HTMLInputElement>(null)
  /** 생성 모드에서 "레코드 생성 후" 올릴 파일. 폼 값이 아니라 별도 상태다(multipart 전용). */
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceReviewFormValues>({
    resolver: zodResolver(serviceReviewSchema),
    defaultValues: toFormValues(review),
  })

  const createMutation = useCreateServiceReviewMutation()
  const updateMutation = useUpdateServiceReviewMutation()
  const uploadMutation = useUploadServiceReviewImageMutation()

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending || uploadMutation.isPending

  const handlePendingFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const validationError = validateImageFile(file)
    if (validationError) {
      toast.error(validationError)
      return
    }
    setPendingFile(file)
  }

  const handleCreate = async (values: ServiceReviewFormValues) => {
    // ── 1단계: 레코드 생성(JSON). imageUrl/id는 절대 넣지 않는다.
    let created: ServiceReview
    try {
      created = await createMutation.mutateAsync(values)
    } catch (error) {
      toast.error(extractUploadError(error, '후기 등록에 실패했습니다'))
      return
    }

    if (!pendingFile) {
      toast.success('후기가 등록되었습니다')
      onClose()
      return
    }

    // ── 2단계: 아바타 업로드(multipart). 생성된 id로 이어서 올린다.
    try {
      await uploadMutation.mutateAsync({ id: created.id, file: pendingFile })
      toast.success('후기가 등록되었습니다')
      onClose()
    } catch (error) {
      // 부분 실패: 레코드는 이미 생성됐다(롤백하지 않는다).
      const message = extractUploadError(error, '아바타 업로드에 실패했습니다')
      toast.error(`후기는 등록됐지만 아바타 업로드에 실패했습니다. ${message}`)
      props.onPartialSuccess?.(created, message)
    }
  }

  const handleUpdate = async (values: ServiceReviewFormValues) => {
    if (!review) return
    try {
      await updateMutation.mutateAsync({ id: review.id, body: values })
      toast.success('후기가 수정되었습니다')
      onClose()
    } catch (error) {
      toast.error(extractUploadError(error, '후기 수정에 실패했습니다'))
    }
  }

  const onSubmit = (values: ServiceReviewFormValues) =>
    mode === 'create' ? handleCreate(values) : handleUpdate(values)

  return (
    <div
      className="fixed inset-0 z-50 bg-overlay-dark flex items-center justify-center px-5 py-5"
      onClick={() => {
        if (!isSubmitting) onClose()
      }}
    >
      {/* token 없음: max-h-[90vh] — 뷰포트 상대값(긴 폼 스크롤 확보), 토큰 스케일 대상 아님 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'create' ? '후기 등록' : '후기 수정'}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-white rounded-card shadow-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-5"
      >
        <h2 className="text-xl font-bold text-ink [word-break:keep-all]">
          {mode === 'create' ? '신청 이유 등록' : '신청 이유 수정'}
        </h2>

        {mode === 'edit' && props.imageWarning && (
          <p className="rounded-btn border border-error/30 bg-surface px-4 py-3 text-xs text-error [word-break:keep-all]">
            후기는 등록됐지만 아바타 업로드에 실패했습니다({props.imageWarning}).
            아래 &ldquo;아바타&rdquo;에서 다시 시도해 주세요.
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* 신청 이유(인용문) */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="service-review-quote"
              className="text-sm font-medium text-ink"
            >
              신청 이유
            </label>
            <textarea
              {...register('quote')}
              id="service-review-quote"
              rows={4}
              placeholder="예: 아이가 있는 집이라 실내 공기질이 늘 걱정이었어요."
              disabled={isSubmitting}
              className={`${errors.quote ? inputErrorClass : inputNormalClass} resize-y`}
            />
            {errors.quote && (
              <p className="text-xs text-error">{errors.quote.message}</p>
            )}
          </div>

          {/* 역할 · 나이 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="service-review-role"
                className="text-sm font-medium text-ink"
              >
                역할/직함
              </label>
              <input
                {...register('role')}
                id="service-review-role"
                type="text"
                placeholder="예: 대표 / 학부모"
                disabled={isSubmitting}
                className={errors.role ? inputErrorClass : inputNormalClass}
              />
              {errors.role && (
                <p className="text-xs text-error">{errors.role.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="service-review-age"
                className="text-sm font-medium text-ink"
              >
                나이 표기
              </label>
              <input
                {...register('age')}
                id="service-review-age"
                type="text"
                placeholder="예: 50세 / MZ세대"
                disabled={isSubmitting}
                className={errors.age ? inputErrorClass : inputNormalClass}
              />
              {errors.age && (
                <p className="text-xs text-error">{errors.age.message}</p>
              )}
            </div>
          </div>

          {/* 아바타 — 생성은 저장 후 업로드(2단계), 수정은 즉시 업로드 */}
          <div className="flex flex-col gap-3 border-t border-hairline pt-5">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-ink">아바타 (선택)</span>
              <span className="text-xs text-muted [word-break:keep-all]">
                {mode === 'create'
                  ? '지금 선택해 두면 후기가 등록된 직후 이어서 업로드됩니다. 나중에 수정 화면에서 올려도 됩니다.'
                  : '파일을 선택하면 저장을 기다리지 않고 바로 업로드됩니다.'}
              </span>
            </div>

            {mode === 'edit' && review ? (
              <ServiceReviewImageField review={review} className="self-start" />
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-btn border border-hairline bg-transparent px-4 py-2 min-h-11 text-xs font-medium text-ink hover:bg-surface active:scale-[0.97] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                  >
                    {pendingFile ? '다른 이미지 선택' : '이미지 선택 (선택 사항)'}
                  </button>
                  {pendingFile && (
                    <button
                      type="button"
                      onClick={() => setPendingFile(null)}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center rounded-btn px-4 py-2 min-h-11 text-xs font-medium text-muted hover:text-ink hover:bg-surface transition-colors disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                    >
                      선택 해제
                    </button>
                  )}
                </div>
                {pendingFile && (
                  <p className="text-xs text-muted [word-break:keep-all]">
                    선택됨: {pendingFile.name}
                  </p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={IMAGE_FILE_ACCEPT}
                  onChange={handlePendingFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* 공개 여부 */}
          <div className="flex items-center gap-2 border-t border-hairline pt-5">
            <input
              {...register('published')}
              id="service-review-published"
              type="checkbox"
              disabled={isSubmitting}
              className="w-4 h-4 accent-brand cursor-pointer"
            />
            <label
              htmlFor="service-review-published"
              className="text-sm text-ink cursor-pointer"
            >
              공개 (체크 해제 시 사이트에 노출되지 않습니다)
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t border-hairline pt-5">
            <button
              type="button"
              onClick={() => {
                if (!isSubmitting) onClose()
              }}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-btn bg-surface px-5 py-2.5 min-h-11 text-sm font-medium text-ink hover:bg-hairline active:scale-[0.97] transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              취소
            </button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : '저장'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
