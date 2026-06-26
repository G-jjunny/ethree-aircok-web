'use client'

import { useQuery } from '@tanstack/react-query'
import { teamImageListQueryOptions } from '@/entities/team-image'
import { TeamImageUploadSection } from './TeamImageUploadSection'
import { TeamImageGridSection } from './TeamImageGridSection'
import { TimelineManageSection } from './TimelineManageSection'

/**
 * 소개 페이지(OUR Team) 관리 어드민 뷰.
 * 팀 이미지 업로드/순서변경/삭제를 제공한다(AdminCatalogView 패턴 — 섹션 조합 역할).
 */
export function AdminAboutView() {
  const { data: images = [], isLoading } = useQuery(teamImageListQueryOptions())

  return (
    <div>
      {/* 페이지 헤더 — §15.2 Admin Page Header */}
      <div className="bg-surface-white border-b border-border-light px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5 min-w-0">
          <h1 className="text-[22px] font-display font-semibold text-heading-dark leading-tight [word-break:keep-all]">
            소개 페이지 관리
          </h1>
          <p className="text-[15px] text-secondary-dark leading-[1.43] mt-0.5 [word-break:keep-all]">
            OUR Team 섹션에 노출할 이미지를 등록·정렬·삭제합니다.
          </p>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-6 lg:p-8 flex flex-col gap-8">
        <TeamImageUploadSection count={images.length} />
        <TeamImageGridSection images={images} isLoading={isLoading} />
        <TimelineManageSection />
      </div>
    </div>
  )
}
