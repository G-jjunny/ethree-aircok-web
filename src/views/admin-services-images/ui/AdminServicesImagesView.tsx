'use client'

import { useQuery } from '@tanstack/react-query'
import { serviceImageListQueryOptions } from '@/entities/service-image'
import { AdminPageHeader } from '@/shared/ui'
import { ServiceImageUploadSection } from './ServiceImageUploadSection'
import { ServiceImageGridSection } from './ServiceImageGridSection'

/**
 * 서비스(제품군) 이미지 관리 어드민 뷰.
 * 업로드/추가, 삭제, 드래그앤드롭 순서 변경을 제공한다.
 * (AdminCatalogView 패턴 — 섹션 컴포넌트 조합 역할만 담당)
 */
export function AdminServicesImagesView() {
  const { data: images = [], isLoading } = useQuery(serviceImageListQueryOptions())

  return (
    <div>
      <AdminPageHeader title="서비스 이미지 관리" description="서비스 페이지의 공기질 관리 제품군 이미지를 업로드·정렬·삭제합니다." />
      <div className="p-6 lg:p-8 flex flex-col gap-8">
        <ServiceImageUploadSection />
        <ServiceImageGridSection images={images} isLoading={isLoading} />
      </div>
    </div>
  )
}
