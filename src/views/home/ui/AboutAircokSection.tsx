import { SITE } from '@/shared/config';
import { SectionLabel, ScrollReveal } from '@/shared/ui';

/**
 * ABOUT / 4-step 플로우 (시안 §5). 흰 배경, eyebrow + h2 + 리드 본문 + 4스텝(아이콘 박스 64px).
 * 마지막 스텝은 brand 배경 + 흰 숫자. 스텝 아이콘 뒤로 연속 점선 커넥터 1줄(데스크톱).
 */
export function AboutAircokSection() {
  const steps = SITE.methodology.steps;

  return (
    <section className="bg-surface-white py-24">
      <div className="content-container">
        {/* token 없음: max-w-[760px] — 인트로 프로즈 컬럼 너비. 프로즈 폭은 값이 매번 달라(500·640·720·760·820) 단일 토큰화 대상 아님, 코드베이스 공통 1회성 수치 규약 준수 */}
        <ScrollReveal variant="fade-up" className="mx-auto max-w-[760px] text-center">
          <SectionLabel color="brand">ABOUT AIRCOK</SectionLabel>
          <h2 className="mt-3 text-h3 font-extrabold leading-tight tracking-headline text-ink">
            실내 공기질 관리 혁신을
            <br />
            선도하는 <span className="text-brand">AIoT 전문기업</span>
          </h2>
          <p className="mt-5 text-lead-sm leading-relaxed text-muted">
            스마트 에어콕은 실내외 공기질 측정·환기 제어 공유 플랫폼을 제공합니다. 센서
            자동보정 등 다수의 특허를 기반으로 측정에서 진단, 개선까지 이어지는 통합 공기질
            관리 사이클을 제공합니다.
          </p>
        </ScrollReveal>

        {/* 4스텝: 아이콘 뒤 연속 점선 커넥터(데스크톱) */}
        <div className="relative mt-14">
          {/* 커넥터: 아이콘 세로 중심(64px 박스 → 32px = top-6) 높이, 아이콘보다 z 아래 */}
          {/* token 없음: left-[12%]/right-[12%] — 4열 그리드 첫·마지막 아이콘 중심을 잇는 위치 기하값(스페이싱 토큰 대상 아님, 1회성 레이아웃 수치) */}
          <div
            aria-hidden
            className="absolute top-6 left-[12%] right-[12%] hidden border-t border-dashed border-tint-border md:block"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {steps.map((step, i) => {
              const isLast = i === steps.length - 1;
              return (
                <ScrollReveal
                  key={step.step}
                  variant="fade-up"
                  delay={i * 80}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-image border ${
                      isLast
                        ? 'border-transparent bg-brand shadow-brand'
                        : 'border-tint-border bg-tint'
                    }`}
                  >
                    {/* text-xl(20): design.md §3 이 22px 를 text-xl 근사로 규정 — 정규 토큰 재사용(신규 토큰 불요) */}
                    <span
                      className={`font-display text-xl font-extrabold ${
                        isLast ? 'text-white' : 'text-brand'
                      }`}
                    >
                      {step.step}
                    </span>
                  </div>
                  <div className="mt-4 text-lg font-bold text-ink">{step.title}</div>
                  <p className="mt-2 text-meta leading-relaxed text-muted">{step.description}</p>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
