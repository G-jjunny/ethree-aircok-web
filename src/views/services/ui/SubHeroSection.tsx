import { SITE } from "@/shared/config";

export function SubHeroSection() {
  return (
    /* min-h-[480px]: Page Sub-Hero 패턴 최소 높이 — design.md "Page Sub-Hero" 참조 */
    <section className="bg-surface-dark">
      <div className="content-container min-h-[480px] flex items-center">
        <div className="flex flex-col gap-4 py-20">
          <span className="text-aircok-blue-light text-xs font-semibold uppercase tracking-widest">
            Products
          </span>
          {/* max-w-[720px]: 헤드라인 읽기 편한 최대 줄 너비 — design.md "Page Sub-Hero" 참조 */}
          <h1 className="text-[28px] sm:text-[40px] font-semibold text-heading-light leading-[1.10] tracking-[-0.3px] [word-break:keep-all] max-w-[720px]">
            {SITE.pages.services.title}
          </h1>
          {/* max-w-[640px]: 본문 최적 읽기 너비 — design.md "Page Sub-Hero" 참조 */}
          <p className="text-[17px] text-body-light leading-[1.65] [word-break:keep-all] max-w-[640px]">
            {SITE.pages.services.description}
          </p>
        </div>
      </div>
    </section>
  );
}
