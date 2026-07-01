"use client";

import Link from "next/link";
import { AdminPageHeader } from "@/shared/ui";
import { NewInquiryAlertCard } from "./NewInquiryAlertCard";
import { SiteInfoSummaryPanel } from "./SiteInfoSummaryPanel";
import { DASHBOARD_CARDS } from "../model/dashboard-list";

export function AdminDashboardView() {
  return (
    <div>
      <AdminPageHeader
        title="어드민 대시보드"
        description="콘텐츠를 관리하고 사이트를 운영하세요"
      />

      <div className="p-6 lg:p-8 flex flex-col gap-6">
        {/* 신규 문의 알림 카드 */}
        <NewInquiryAlertCard />

        {/* 6개 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DASHBOARD_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group bg-surface-white rounded-xl border border-border-light p-6 flex flex-col gap-4 hover:border-aircok-blue/40 hover:shadow-card transition-all"
            >
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-aircok-blue/10 text-aircok-blue">
                {card.icon}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-base font-display font-semibold text-heading-dark group-hover:text-aircok-blue transition-colors">
                  {card.title}
                </span>
                <span className="text-sm text-secondary-dark leading-[1.5]">
                  {card.description}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* 회사 기본 정보 패널 */}
        <SiteInfoSummaryPanel />
      </div>
    </div>
  );
}
