"use client";

import { useQuery } from "@tanstack/react-query";
import { newInquiryCountQueryOptions } from "@/entities/inquiry";
import { KpiStatTile } from "./KpiStatTile";

const inquiryIcon = (
  <svg
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
    />
  </svg>
);

export function InquiryKpiTile() {
  const { data: count, isLoading } = useQuery(newInquiryCountQueryOptions());

  return (
    <KpiStatTile
      href="/console/inquiries"
      label="미확인 문의"
      count={count}
      isLoading={isLoading}
      icon={inquiryIcon}
      tone="brand"
      emptyText="새로운 문의가 없습니다"
    />
  );
}
