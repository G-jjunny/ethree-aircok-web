"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export type KpiTone = "brand" | "warning";

interface KpiStatTileProps {
  href: string;
  /** 상단 라벨(예: "미확인 문의") */
  label: string;
  /** 미확인 건수. 로딩 중에는 undefined일 수 있다. */
  count: number | undefined;
  isLoading: boolean;
  icon: ReactNode;
  tone: KpiTone;
  /** count === 0 (신규 없음)일 때 하단 상태 문구 */
  emptyText: string;
}

/**
 * 대시보드 KPI 요약행에서 재사용하는 컴팩트 스탯 타일(로컬 프리미티브).
 * 데이터 페칭은 하지 않고 표시만 담당한다 — count/isLoading은 상위 데이터 타일에서 주입한다.
 */
const TONE = {
  brand: {
    active: "bg-brand/5 border-brand/40 hover:bg-brand/10",
    idleHover: "hover:border-brand/40",
    activeIcon: "bg-brand text-white",
    idleIcon: "bg-brand/10 text-brand",
    number: "text-brand",
  },
  warning: {
    active: "bg-warning/5 border-warning/40 hover:bg-warning/10",
    idleHover: "hover:border-warning/40",
    activeIcon: "bg-warning text-white",
    idleIcon: "bg-warning/10 text-warning",
    number: "text-warning",
  },
} as const;

export function KpiStatTile({
  href,
  label,
  count,
  isLoading,
  icon,
  tone,
  emptyText,
}: KpiStatTileProps) {
  const hasNew = typeof count === "number" && count > 0;
  const t = TONE[tone];

  return (
    <Link
      href={href}
      className={[
        "group rounded-card border p-6 flex items-center gap-4 transition-all hover:shadow-card",
        hasNew
          ? t.active
          : `bg-surface-white border-hairline ${t.idleHover}`,
      ].join(" ")}
    >
      <div
        className={[
          "inline-flex items-center justify-center w-12 h-12 rounded-image flex-shrink-0",
          hasNew ? t.activeIcon : t.idleIcon,
        ].join(" ")}
      >
        {icon}
      </div>

      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-muted">{label}</span>

        {isLoading ? (
          <span
            className="my-1 inline-block w-14 h-8 rounded-btn bg-hairline animate-pulse"
            aria-hidden="true"
          />
        ) : (
          <span
            className={[
              "text-h3 font-display font-bold leading-none",
              hasNew ? t.number : "text-ink",
            ].join(" ")}
          >
            {count ?? 0}
          </span>
        )}

        <span className="text-xs text-muted leading-snug">
          {isLoading
            ? "불러오는 중..."
            : hasNew
              ? `확인 대기 ${count}건`
              : emptyText}
        </span>
      </div>
    </Link>
  );
}
