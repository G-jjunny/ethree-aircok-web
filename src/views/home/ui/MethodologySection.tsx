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

        {/* Numeral Spine Process Timeline — 대형 솔리드 넘버럴이 순서를 인코딩하는 signature 스파인 */}
        <ol className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
          {steps.map((item, index) => {
            const isLast = index === lastIndex;
            const numeral = String(item.step).padStart(2, "0");
            return (
              <li
                key={item.step}
                className="group relative flex flex-col gap-4 md:items-center md:text-center"
              >
                {/* 진행 레일 — 데스크탑 가로(현재 넘버럴 중심 → 다음 넘버럴 중심), 마지막 단계 제외.
                    셀 간 gap(md:gap-6)을 포함해 4단계가 끊김 없이 연결되도록 폭 = 셀폭 + gap.
                    gap 값은 --spacing-6 토큰을 직접 참조해 md:gap-6 과 동기 유지(매직넘버 회피) */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-11 hidden h-px w-[calc(100%+var(--spacing-6))] bg-border-light md:block"
                  />
                )}

                {/* signature: 대형 솔리드 넘버럴 (브랜드 라이트 블루 채움) */}
                <span className="text-aircok-blue-light text-7xl sm:text-8xl font-display font-bold leading-none tracking-[-0.3px]">
                  {numeral}
                </span>

                <div className="flex flex-col gap-1.5 md:items-center">
                  <span className="text-aircok-blue-light text-xs font-bold uppercase tracking-widest">
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
