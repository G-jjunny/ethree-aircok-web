'use client'

import { useQuery } from '@tanstack/react-query'
import { teamImageListQueryOptions } from '@/entities/team-image'
import { AdminPageHeader, AdminTabs, useAdminActiveTab } from '@/shared/ui'
import { SITE } from '@/shared/config/site'
import { TeamImageUploadSection } from './TeamImageUploadSection'
import { TeamImageGridSection } from './TeamImageGridSection'
import { TimelineManageSection } from './TimelineManageSection'
import { ValueCardManageSection } from './ValueCardManageSection'

/**
 * 소개 페이지(About) 통합 관리 뷰.
 *
 * 팀 이미지·핵심가치·연혁을 단일 탭 페이지로 통합한다(진단서비스 통합 패턴과 동일).
 * 활성 탭은 URL `?tab=<key>` 기반이며, 활성 탭 콘텐츠만 마운트한다.
 */
export function AdminAboutView() {
  const { data: images = [], isLoading } = useQuery(teamImageListQueryOptions())

  // SITE.admin.aboutTabs는 `as const`(readonly)라 AdminTabItem[]에 그대로 못 넘긴다 — mutable 복사.
  const tabs = [...SITE.admin.aboutTabs]
  const activeTab = useAdminActiveTab(tabs, 'team')

  return (
    <div>
      <AdminPageHeader
        title="소개 페이지 관리"
        description="소개(About) 페이지의 팀 이미지·핵심가치·회사 연혁을 관리합니다."
      />

      <AdminTabs tabs={tabs} label="소개 페이지 관리 탭" />

      <div className="p-6 lg:p-8">
        <div
          role="tabpanel"
          id="panel-team"
          aria-labelledby="tab-team"
          hidden={activeTab !== 'team'}
        >
          {activeTab === 'team' && (
            <div className="flex flex-col gap-8">
              <TeamImageUploadSection />
              <TeamImageGridSection images={images} isLoading={isLoading} />
            </div>
          )}
        </div>

        <div
          role="tabpanel"
          id="panel-values"
          aria-labelledby="tab-values"
          hidden={activeTab !== 'values'}
        >
          {activeTab === 'values' && <ValueCardManageSection />}
        </div>

        <div
          role="tabpanel"
          id="panel-timeline"
          aria-labelledby="tab-timeline"
          hidden={activeTab !== 'timeline'}
        >
          {activeTab === 'timeline' && <TimelineManageSection />}
        </div>
      </div>
    </div>
  )
}
