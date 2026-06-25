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

        {/* 프로세스 타임라인 플로우: 데스크탑 가로(좌→우) / 모바일 세로 */}
        <ol className="mt-16 flex flex-col md:flex-row md:items-start">
          {steps.map((item, index) => {
            const isLast = index === lastIndex;
            return (
              <li
                key={item.step}
                className="relative flex md:flex-1 md:flex-col"
              >
                {/* 커넥터 — 데스크탑: 노드 우측 가로선 + 끝점 도트 / 모바일: 노드 아래 세로선 */}
                {!isLast && (
                  <>
                    {/* 모바일 세로선 */}
                    <span
                      aria-hidden="true"
                      className="absolute left-5 top-11 -bottom-1 w-px bg-border-light md:hidden"
                    />
                    {/* 데스크탑 가로선 (노드 우측 끝 → 다음 노드 직전) */}
                    <span
                      aria-hidden="true"
                      className="absolute left-12 right-2 top-5 hidden h-px bg-border-light md:block"
                    />
                    {/* 데스크탑 진행 방향 도트 (가로선 끝점) */}
                    <span
                      aria-hidden="true"
                      className="absolute right-2 top-5 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-aircok-blue md:block"
                    />
                  </>
                )}

                {/* 노드(번호 배지) */}
                <div className="relative z-10 flex shrink-0 items-center md:w-full md:flex-col md:items-start">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-aircok-blue text-[17px] font-bold text-heading-light shadow-card">
                    {item.step}
                  </span>
                </div>

                {/* 텍스트 블록 — 모바일: 노드 우측 / 데스크탑: 노드 아래 */}
                <div className="ml-4 pb-10 md:ml-0 md:mt-5 md:pb-0 md:pr-8">
                  <span className="text-aircok-blue text-xs font-bold uppercase tracking-widest">
                    STEP {String(item.step).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1.5 text-heading-dark text-xl font-semibold leading-[1.14] [word-break:keep-all]">
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
