'use client'

import { useQuery } from '@tanstack/react-query'
import { catalogImageListQueryOptions } from '@/entities/catalog'
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
    <div className="p-6 lg:p-8 flex flex-col gap-8">
      <h1 className="text-heading-dark font-display font-semibold text-2xl">
        카탈로그 관리
      </h1>
      <CatalogUploadSection />
      <CatalogImageGridSection images={images} isLoading={isLoading} />
    </div>
  )
}
