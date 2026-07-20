'use client';

import { AdminInquiryListView } from '@/widgets/admin-inquiry-list';
import { AdminInquiryFormBuilderView } from '@/widgets/admin-inquiry-form-builder';
import { AdminMailSettingView } from '@/widgets/admin-mail-setting';
import { AdminPageHeader, AdminTabs, useAdminActiveTab } from '@/shared/ui';
import { SITE } from '@/shared/config/site';

/**
 * 문의 통합 관리 뷰(`/console/inquiries`).
 *
 * 문의 내역·폼 설정·이메일 설정을 단일 탭 페이지로 통합한다.
 * 활성 탭은 URL `?tab=<key>` 기반이며, 활성 탭 콘텐츠만 마운트한다(진단 통합 패턴과 동일).
 */
export function AdminInquiryTabsView() {
  // SITE.admin.inquiryTabs는 `as const`(readonly)라 AdminTabItem[]에 그대로 못 넘긴다 — mutable 복사.
  const tabs = [...SITE.admin.inquiryTabs];
  const activeTab = useAdminActiveTab(tabs, 'list');

  return (
    <div>
      <AdminPageHeader
        title="문의 관리"
        description="문의하기 페이지의 접수된 문의를 관리하고 폼·이메일 설정을 합니다."
      />

      <AdminTabs tabs={tabs} label="문의 관리 탭" />

      <div className="p-6 lg:p-8">
        <div
          role="tabpanel"
          id="panel-list"
          aria-labelledby="tab-list"
          hidden={activeTab !== 'list'}
        >
          {activeTab === 'list' && <AdminInquiryListView />}
        </div>

        <div
          role="tabpanel"
          id="panel-form"
          aria-labelledby="tab-form"
          hidden={activeTab !== 'form'}
        >
          {activeTab === 'form' && <AdminInquiryFormBuilderView />}
        </div>

        <div
          role="tabpanel"
          id="panel-mail"
          aria-labelledby="tab-mail"
          hidden={activeTab !== 'mail'}
        >
          {activeTab === 'mail' && <AdminMailSettingView />}
        </div>
      </div>
    </div>
  );
}
