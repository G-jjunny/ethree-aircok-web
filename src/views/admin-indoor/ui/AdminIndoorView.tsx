'use client'

import { AdminAirDeviceManager } from '@/widgets/admin-air-device-manager'
import { AdminPageHeader, AdminTabs, useAdminActiveTab } from '@/shared/ui'
import { SITE } from '@/shared/config/site'
import { IndoorImagesPanel } from './IndoorImagesPanel'

/**
 * 실내 공기질 시스템 통합 관리 뷰(`/console/indoor`).
 *
 * 기존 2개 라우트(측정기 관리·이미지 관리)를 단일 탭 페이지로 통합한다.
 * 활성 탭은 URL `?tab=<key>` 기반이며, 활성 탭 콘텐츠만 마운트한다(진단서비스 통합 패턴과 동일).
 */
export function AdminIndoorView() {
  // SITE.admin.indoorTabs는 `as const`(readonly)라 AdminTabItem[]에 그대로 못 넘긴다 — mutable 복사.
  const tabs = [...SITE.admin.indoorTabs]
  const activeTab = useAdminActiveTab(tabs, 'devices')

  return (
    <div>
      <AdminPageHeader
        title="실내 공기질 시스템"
        description="실내 공기질 관리 시스템의 측정기 모델과 섹션 이미지를 한곳에서 관리합니다."
      />

      <AdminTabs tabs={tabs} label="실내 공기질 시스템 탭" />

      <div className="p-6 lg:p-8">
        <div
          role="tabpanel"
          id="panel-devices"
          aria-labelledby="tab-devices"
          hidden={activeTab !== 'devices'}
        >
          {activeTab === 'devices' && <AdminAirDeviceManager />}
        </div>

        <div
          role="tabpanel"
          id="panel-images"
          aria-labelledby="tab-images"
          hidden={activeTab !== 'images'}
        >
          {activeTab === 'images' && <IndoorImagesPanel />}
        </div>
      </div>
    </div>
  )
}
