import { Fragment } from 'react';
import { SITE } from '@/shared/config';

const STEP_LABELS = ['서비스 신청', '공기질 측정 (10일)', '분석 레포트', '진단 · 개선'];

/**
 * ABOUT / 4-step 플로우 (시안 §5). 흰 배경, h2 + 리드 본문 + 4스텝(아이콘 박스 64px).
 * 마지막 스텝은 brand 배경 + 흰 숫자. 스텝 사이 점선 커넥터(데스크톱).
 */
export function AboutStepSection() {
  const steps = SITE.methodology.steps;

  return (
    <section className="bg-surface-white py-24">
      <div className="content-container">
        <div className="mx-auto max-w-[760px] text-center">
          <h2 className="text-h3 font-extrabold leading-tight tracking-headline text-ink">
            실내 공기질 관리 혁신을
            <br />
            선도하는 <span className="text-brand">AIoT 전문기업</span>
          </h2>
          <p className="mt-5 text-lead-sm leading-relaxed text-muted">
            스마트 에어콕은 실내외 공기질 측정·환기 제어 공유 플랫폼을 제공합니다. 센서
            자동보정 등 다수의 특허를 기반으로 측정에서 진단, 개선까지 이어지는 통합 공기질
            관리 사이클을 제공합니다.
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-6 md:flex-row md:items-start">
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            return (
              <Fragment key={step.step}>
                <div className="flex flex-1 flex-col items-center text-center">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-image border ${
                      isLast
                        ? 'border-transparent bg-brand shadow-brand'
                        : 'border-tint-border bg-tint'
                    }`}
                  >
                    <span
                      className={`font-display text-h6 font-extrabold ${
                        isLast ? 'text-white' : 'text-brand'
                      }`}
                    >
                      {step.step}
                    </span>
                  </div>
                  <div className="mt-4 font-bold text-ink">{STEP_LABELS[i]}</div>
                </div>
                {!isLast && (
                  <div
                    aria-hidden
                    className="mt-6 hidden flex-1 border-t border-dashed border-tint-border md:block"
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
