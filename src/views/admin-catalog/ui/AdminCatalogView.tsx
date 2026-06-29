'use client'

import { useQuery } from '@tanstack/react-query'
import { catalogImageListQueryOptions } from '@/entities/catalog'
import { AdminPageHeader } from '@/shared/ui'
import { CatalogUploadSection } from './CatalogUploadSection'
import { CatalogImageGridSection } from './CatalogImageGridSection'

/**
 * 카탈로그 이미지 관리 어드민 뷰.
 * 업로드/추가, 교체, 삭제, 드래그앤드롭 순서 변경을 제공한다.
 * (AdminFaqView 패턴 — 섹션 컴포넌트 조합 역할만 담당)
 */
export function AdminCatalogView() {
  const { data: images = [], isLoading } = useQuery(
    catalogImageListQueryOptions(),
  )

  return (
    <div>
      <AdminPageHeader title="카탈로그 관리" description="제품 카탈로그 이미지를 업로드·정렬·삭제합니다." />

      {/* 콘텐츠 영역 */}
      <div className="p-6 lg:p-8 flex flex-col gap-8">
        <CatalogUploadSection />
        <CatalogImageGridSection images={images} isLoading={isLoading} />
      </div>
    </div>
  )
}
