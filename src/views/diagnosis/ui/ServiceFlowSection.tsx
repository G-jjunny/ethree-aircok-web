import { ArrowRight } from 'lucide-react'

const STEPS = [
  {
    en: 'SHOW',
    ko: '보여주고',
    desc: '실시간 측정으로 지금 공기 상태를 눈으로 확인',
  },
  {
    en: 'MANAGE',
    ko: '관리하고',
    desc: '기간·항목별 데이터로 오염 패턴을 관리',
  },
  {
    en: 'IMPROVE',
    ko: '개선됩니다',
    desc: '필요한 시점에 정확히 대응해 공기가 달라집니다',
  },
] as const

/**
 * 진단 서비스 흐름(SHOW → MANAGE → IMPROVE) — 정적 다크 섹션.
 * 히어로 "이용 방법 보기" 앵커 타겟(id="flow").
 */
export function ServiceFlowSection() {
  return (
    <section
      id="flow"
      className="border-t border-white/6 bg-navy py-14 text-white"
    >
      {/* token 없음: max-w-[1100px] 흐름 배너 폭(content-container 1240보다 좁은 1회성) */}
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-8.5 px-8.5 md:flex-row md:justify-center md:gap-2">
        {STEPS.map((step, index) => (
          <div key={step.en} className="contents">
            <div className="text-center">
              <div className="font-display text-meta font-bold uppercase tracking-caption text-cyan">
                {step.en}
              </div>
              <div className="mt-2 text-xl font-extrabold">{step.ko}</div>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {step.desc}
              </p>
            </div>
            {index < STEPS.length - 1 && (
              <ArrowRight
                className="size-7.5 shrink-0 rotate-90 text-white/40 md:rotate-0"
                strokeWidth={2.2}
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
