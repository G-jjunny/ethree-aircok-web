import Link from "next/link";
import { SITE } from "@/shared/config/site";
import { DASHBOARD_CARD_META } from "../model/dashboard-list";

/**
 * 대시보드 요약 패널(SiteInfoSummaryPanel)이 이미 "수정" 링크로 커버하는 중복 경로.
 * 빠른접근 카드에서는 뷰 레벨에서 제외한다(사이드바 nav/SITE.admin.nav는 변경하지 않음).
 */
const EXCLUDED_HREF = "/console/site-info";

/**
 * 빠른접근 카드 그룹.
 * 그룹 구조/순서·라벨·경로의 단일 출처는 `SITE.admin.nav`이며,
 * 대시보드 특화 메타(icon/description)만 로컬 매핑(DASHBOARD_CARD_META)에서 조회한다.
 * label이 null인 그룹(대시보드)은 카드 대상이 아니므로 건너뛴다.
 * EXCLUDED_HREF는 요약 패널과 중복되므로 뷰 레벨에서 필터링하며,
 * 필터 후 항목이 0개가 된 그룹(빈 헤딩/그리드)은 렌더하지 않는다.
 */
export function QuickAccessSection() {
  const groups = SITE.admin.nav
    .filter((group) => group.label !== null)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.href !== EXCLUDED_HREF),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <section key={group.label} className="flex flex-col gap-4">
          <h2 className="text-eyebrow font-semibold uppercase tracking-eyebrow-lg text-muted">
            {group.label}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.items.map((item) => {
              const meta = DASHBOARD_CARD_META[item.href];

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group bg-surface-white rounded-card border border-hairline p-6 flex flex-col gap-4 transition-all duration-fast ease-out hover:border-brand/40 hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-image bg-brand/10 text-brand">
                    {meta?.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-display font-semibold text-ink group-hover:text-brand transition-colors">
                      {item.label}
                    </span>
                    <span className="text-sm text-muted leading-normal">
                      {meta?.description}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
