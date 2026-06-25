import { SITE } from "@/shared/config";
import { SectionHeader } from "@/shared/ui";

export function MethodologySection() {
  const { steps } = SITE.methodology;
  const lastIndex = steps.length - 1;

  return (
    <section className="bg-surface-white">
      <div className="content-container py-20">
        <SectionHeader
          label={SITE.methodology.label}
          title={SITE.methodology.title}
          body={SITE.methodology.description}
          theme="light"
          align="center"
        />

        {/* Numeral Spine Process Timeline — 대형 아웃라인 넘버럴이 순서를 인코딩하는 signature 스파인 */}
        <ol className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
          {steps.map((item, index) => {
            const isLast = index === lastIndex;
            const numeral = String(item.step).padStart(2, "0");
            return (
              <li key={item.step} className="group relative flex flex-col gap-4">
                {/* 진행 레일 — 데스크탑 가로(다음 단계로 향함), 마지막 단계 제외 */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 right-0 top-11 hidden h-px bg-border-light md:block"
                  />
                )}

                {/* signature: 대형 아웃라인 넘버럴 (속 빈 숫자, 브랜드 stroke + 미지원 fallback) */}
                <span className="numeral-stroke font-display text-[64px] sm:text-[88px] font-bold leading-none tracking-[-0.3px]">
                  {numeral}
                </span>

                <div className="flex flex-col gap-1.5">
                  <span className="text-aircok-blue text-xs font-bold uppercase tracking-widest">
                    STEP {numeral}
                  </span>
                  <h3 className="text-heading-dark text-xl font-semibold leading-[1.14] [word-break:keep-all]">
                    {item.title}
                  </h3>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
