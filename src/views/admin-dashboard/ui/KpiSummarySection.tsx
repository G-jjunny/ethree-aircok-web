"use client";

import { InquiryKpiTile } from "./InquiryKpiTile";
import { DiagnosisKpiTile } from "./DiagnosisKpiTile";

/**
 * 상단 KPI 요약행 — 미확인 문의 / 미확인 진단서비스 신청.
 * 모바일 1열 → sm 이상 2열. 향후 KPI 추가를 대비해 grid를 사용한다.
 */
export function KpiSummarySection() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InquiryKpiTile />
      <DiagnosisKpiTile />
    </section>
  );
}
