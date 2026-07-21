'use client'

import { AdminPageHeader } from '@/shared/ui'
import { HomeSectionImagesPanel } from './HomeSectionImagesPanel'

/**
 * 홈 페이지 관리 뷰(`/console/home`).
 *
 * 현재 관리 대상이 섹션 이미지 하나뿐이라 탭 없이 단일 콘텐츠 영역으로 구성한다
 * (AdminCatalogView 패턴 — 섹션 컴포넌트 조합 역할만 담당).
 */
export function AdminHomeView() {
  return (
    <div>
      <AdminPageHeader
        title="홈 페이지 관리"
        description="홈 화면의 Our Value 카드와 FREE REPORT 일러스트 이미지를 관리합니다."
      />

      <div className="p-6 lg:p-8">
        <HomeSectionImagesPanel />
      </div>
    </div>
  )
}
