'use client'

import { useQuery } from '@tanstack/react-query'
import { diagnosisImageListQueryOptions } from '@/entities/diagnosis-image'
import { AdminPageHeader } from '@/shared/ui'
import { DiagnosisImageUploadSection } from './DiagnosisImageUploadSection'
import { DiagnosisImageGridSection } from './DiagnosisImageGridSection'

/**
 * 진단 이미지 관리 어드민 뷰.
 * 업로드/추가, 삭제, 드래그앤드롭 순서 변경을 제공한다.
 * (AdminCatalogView 패턴 — 섹션 컴포넌트 조합 역할만 담당)
 */
export function AdminDiagnosisImagesView() {
  const { data: images = [], isLoading } = useQuery(
    diagnosisImageListQueryOptions(),
  )

  return (
    <div>
      <AdminPageHeader
        title="진단 이미지 관리"
        description="진단서비스 페이지의 안내 이미지를 업로드·정렬·삭제합니다."
      />

      {/* 콘텐츠 영역 */}
      <div className="p-6 lg:p-8 flex flex-col gap-8">
        <DiagnosisImageUploadSection />
        <DiagnosisImageGridSection images={images} isLoading={isLoading} />
      </div>
    </div>
  )
}
