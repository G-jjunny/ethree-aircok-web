'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminServiceReviewListQueryOptions } from '@/entities/service-review'
import type { ServiceReview } from '@/entities/service-review'
import { AdminPageHeader, Button } from '@/shared/ui'
import { ServiceReviewListSection } from './ServiceReviewListSection'
import { ServiceReviewFormModal } from './ServiceReviewFormModal'

type FormState = { mode: 'create' } | { mode: 'edit'; id: string }

/**
 * 진단 후기(신청 이유) 관리 어드민 뷰(섹션 조합 역할).
 *
 * 목록은 어드민 엔드포인트라 미공개 후기까지 포함한다.
 * 생성 부분 실패(레코드 생성 O · 아바타 업로드 X) 시 수정 모달로 전환해 재시도를 유도한다.
 */
export function AdminServiceReviewsView() {
  const { data: reviews = [], isLoading } = useQuery(
    adminServiceReviewListQueryOptions(),
  )
  const [formState, setFormState] = useState<FormState | null>(null)
  /** 부분 실패로 수정 모달을 연 경우 상단 배너로 남기는 경고 메시지. */
  const [imageWarning, setImageWarning] = useState<string | null>(null)
  /**
   * 생성 직후 목록 refetch가 끝나기 전에도 수정 모달을 띄우기 위한 임시 스냅샷.
   * 목록에 해당 id가 도착하면 서버 데이터가 우선한다.
   */
  const [pendingReview, setPendingReview] = useState<ServiceReview | null>(null)

  // 수정 대상은 목록에서 다시 찾는다 — 아바타 업로드로 캐시가 갱신돼도 최신 imageUrl이 반영된다.
  const editingReview =
    formState?.mode === 'edit'
      ? (reviews.find((review) => review.id === formState.id) ??
        (pendingReview?.id === formState.id ? pendingReview : null))
      : null

  const closeForm = () => {
    setFormState(null)
    setImageWarning(null)
    setPendingReview(null)
  }

  const openCreate = () => {
    setImageWarning(null)
    setPendingReview(null)
    setFormState({ mode: 'create' })
  }

  const openEdit = (id: string) => {
    setImageWarning(null)
    setPendingReview(null)
    setFormState({ mode: 'edit', id })
  }

  /** 레코드는 생성됐고 아바타만 실패한 경우 — 생성된 후기의 수정 모달로 전환한다. */
  const handlePartialSuccess = (review: ServiceReview, message: string) => {
    setPendingReview(review)
    setImageWarning(message)
    setFormState({ mode: 'edit', id: review.id })
  }

  return (
    <div>
      <AdminPageHeader
        title="서비스 신청 이유 관리"
        description="진단서비스 페이지의 고객 신청 이유(후기)를 등록·수정·정렬합니다."
      >
        <Button size="sm" onClick={openCreate}>
          신청 이유 등록
        </Button>
      </AdminPageHeader>

      <div className="p-6 lg:p-8">
        <ServiceReviewListSection
          reviews={reviews}
          isLoading={isLoading}
          onEdit={openEdit}
        />
      </div>

      {formState?.mode === 'create' && (
        <ServiceReviewFormModal
          mode="create"
          onClose={closeForm}
          onPartialSuccess={handlePartialSuccess}
        />
      )}

      {formState?.mode === 'edit' && editingReview && (
        // key로 마운트를 고정해 defaultValues를 확정한다(목록 갱신이 입력을 리셋하지 않음).
        <ServiceReviewFormModal
          key={editingReview.id}
          mode="edit"
          review={editingReview}
          imageWarning={imageWarning}
          onClose={closeForm}
        />
      )}
    </div>
  )
}
