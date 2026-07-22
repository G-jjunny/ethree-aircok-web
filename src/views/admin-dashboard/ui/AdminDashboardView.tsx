"use client";

import { AdminPageHeader } from "@/shared/ui";
import { KpiSummarySection } from "./KpiSummarySection";
import { QuickAccessSection } from "./QuickAccessSection";
import { SiteInfoSummaryPanel } from "./SiteInfoSummaryPanel";

export function AdminDashboardView() {
  return (
    <div>
      <AdminPageHeader
        title="어드민 대시보드"
        description="콘텐츠를 관리하고 사이트를 운영하세요"
      />

      <div className="p-6 lg:p-8 flex flex-col gap-8">
        {/* 상단 KPI 요약행 */}
        <KpiSummarySection />

        {/* 그룹화 빠른접근 카드 */}
        <QuickAccessSection />

        {/* 회사 기본 정보 패널 */}
        <SiteInfoSummaryPanel />
      </div>
    </div>
  );
}
