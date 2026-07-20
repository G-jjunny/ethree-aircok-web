'use client'

import { AdminPageHeader, AdminTabs, useAdminActiveTab } from '@/shared/ui'
import { AdminMapSettingView } from '@/widgets/admin-map-setting'
import { SITE } from '@/shared/config/site'
import { SiteInfoFormSection } from './SiteInfoFormSection'
import { PartnerListSection } from './PartnerListSection'

/**
 * 사이트 설정 통합 관리 뷰(`/console/site-info`).
 *
 * 회사정보·파트너사·지도 설정을 단일 탭 페이지로 통합한다(진단서비스 통합 패턴과 동일).
 * 활성 탭은 URL `?tab=<key>` 기반이며, 활성 탭 콘텐츠만 마운트한다.
 */
export function AdminSiteInfoView() {
  // SITE.admin.siteInfoTabs는 `as const`(readonly)라 AdminTabItem[]에 그대로 못 넘긴다 — mutable 복사.
  const tabs = [...SITE.admin.siteInfoTabs]
  const activeTab = useAdminActiveTab(tabs, 'company')

  return (
    <div>
      <AdminPageHeader
        title="사이트 설정"
        description="회사 기본 정보, 파트너사 목록, 지도 설정을 관리합니다."
      />

      <AdminTabs tabs={tabs} label="사이트 설정 탭" />

      <div className="p-6 lg:p-8">
        {/* token 없음: 사이트 설정 어드민 전용 중간 너비 */}
        <div className="max-w-[900px]">
          <div
            role="tabpanel"
            id="panel-company"
            aria-labelledby="tab-company"
            hidden={activeTab !== 'company'}
          >
            {activeTab === 'company' && <SiteInfoFormSection />}
          </div>

          <div
            role="tabpanel"
            id="panel-partners"
            aria-labelledby="tab-partners"
            hidden={activeTab !== 'partners'}
          >
            {activeTab === 'partners' && <PartnerListSection />}
          </div>

          <div
            role="tabpanel"
            id="panel-map"
            aria-labelledby="tab-map"
            hidden={activeTab !== 'map'}
          >
            {activeTab === 'map' && <AdminMapSettingView />}
          </div>
        </div>
      </div>
    </div>
  )
}
