'use client'

import { useQuery } from '@tanstack/react-query'
import { teamImageListQueryOptions } from '@/entities/team-image'
import { AdminPageHeader } from '@/shared/ui'
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
      <AdminPageHeader
        title="소개 페이지 관리"
        description="소개(About) 페이지의 팀 이미지와 회사 연혁을 관리합니다."
      />

      {/* 콘텐츠 영역 */}
      <div className="p-6 lg:p-8 flex flex-col gap-8">
        <TeamImageUploadSection />
        <TeamImageGridSection images={images} isLoading={isLoading} />
        <TimelineManageSection />
      </div>
    </div>
  )
}
