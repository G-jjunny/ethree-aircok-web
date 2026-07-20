'use client'

import { AdminDiagnosisConsultationListView } from '@/widgets/admin-diagnosis-consultation-list'
import { AdminServiceReviewManager } from '@/widgets/admin-service-review-manager'
import { AdminCertificationManager } from '@/widgets/admin-certification-manager'
import { AdminPageHeader, AdminTabs, useAdminActiveTab } from '@/shared/ui'
import { SITE } from '@/shared/config/site'
import { DiagnosisSectionImagesPanel } from './DiagnosisSectionImagesPanel'

/**
 * 진단서비스 통합 관리 뷰(`/console/diagnosis`).
 *
 * 기존 4개 라우트(신청 내역·신청 이유·특허/인증서·구성/비교 이미지)를 단일 탭 페이지로 통합한다.
 * 활성 탭은 URL `?tab=<key>` 기반이며, 활성 탭 콘텐츠만 마운트한다(inquiry 통합 패턴과 동일).
 */
export function AdminDiagnosisView() {
  // SITE.admin.diagnosisTabs는 `as const`(readonly)라 AdminTabItem[]에 그대로 못 넘긴다 — mutable 복사.
  const tabs = [...SITE.admin.diagnosisTabs]
  const activeTab = useAdminActiveTab(tabs, 'applications')

  return (
    <div>
      <AdminPageHeader
        title="진단서비스 관리"
        description="진단서비스 신청 내역·신청 이유·특허/인증서·구성 이미지를 한곳에서 관리합니다."
      />

      <AdminTabs tabs={tabs} label="진단서비스 관리 탭" />

      <div className="p-6 lg:p-8">
        <div
          role="tabpanel"
          id="panel-applications"
          aria-labelledby="tab-applications"
          hidden={activeTab !== 'applications'}
        >
          {activeTab === 'applications' && <AdminDiagnosisConsultationListView />}
        </div>

        <div
          role="tabpanel"
          id="panel-reasons"
          aria-labelledby="tab-reasons"
          hidden={activeTab !== 'reasons'}
        >
          {activeTab === 'reasons' && <AdminServiceReviewManager />}
        </div>

        <div
          role="tabpanel"
          id="panel-certifications"
          aria-labelledby="tab-certifications"
          hidden={activeTab !== 'certifications'}
        >
          {activeTab === 'certifications' && <AdminCertificationManager />}
        </div>

        <div
          role="tabpanel"
          id="panel-section-images"
          aria-labelledby="tab-section-images"
          hidden={activeTab !== 'section-images'}
        >
          {activeTab === 'section-images' && <DiagnosisSectionImagesPanel />}
        </div>
      </div>
    </div>
  )
}
