import type { ReactNode } from 'react'
import { ArrowRightIcon } from './icons'

/**
 * 3스텝 프로세스 플로우(시안 IndoorFlow / KitchenFlow 공통 골격).
 *
 * 두 탭의 레이아웃·타이포·라운드·스페이싱은 100% 동일하고 **색상 계열만 분기**하므로
 * (design Pre 확정: "타이포·라운드·스페이싱은 실내와 100% 공유, 색상 계열만 분기")
 * tone prop 하나로 계열을 고정한다. tone 이 컴포넌트 단위로 고정되므로 한 섹션에서
 * brand/chef 가 섞일 수 없다(계열 분리 원칙 강제).
 */
export type FlowTone = 'brand' | 'chef'

export interface FlowStep {
  /** STEP 라벨(예: 'STEP 01'). */
  step: string
  title: string
  body: string
  /** 아이콘 박스 안에 들어갈 라인 아이콘. stroke-current 로 흰색을 상속받는다. */
  icon: ReactNode
}

/** 계열별 클래스 매핑 — 구조는 공유하고 색상만 교체한다. */
const TONE: Record<
  FlowTone,
  {
    card: string
    lastCard: string
    iconBox: string
    stepLabel: string
    arrow: string
  }
> = {
  brand: {
    card: 'bg-tint border border-tint-border',
    // 마지막(강조) 스텝: 시안의 brand 그라디언트 카드
    lastCard: 'bg-linear-160 from-brand/10 to-brand/3 border border-tint-border',
    iconBox: 'bg-linear-to-br from-brand to-brand-hover',
    stepLabel: 'text-brand',
    arrow: 'text-brand-soft',
  },
  chef: {
    card: 'bg-chef-tint border border-chef-tint-border',
    lastCard: 'bg-linear-160 from-chef/12 to-chef/3 border border-chef-tint-border',
    iconBox: 'bg-linear-to-br from-chef to-chef-hover',
    stepLabel: 'text-chef',
    arrow: 'text-chef-soft',
  },
}

export function ProcessFlow({ steps, tone }: { steps: FlowStep[]; tone: FlowTone }) {
  const t = TONE[tone]

  return (
    // 데스크톱은 시안대로 카드-화살표-카드 5열, 모바일은 화살표를 숨기고 1열로 쌓는다.
    <div className="mt-11 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:gap-0">
      {steps.map((s, i) => (
        <div key={s.step} className="contents">
          <div
            className={`flex flex-col gap-4 rounded-image p-6 ${
              i === steps.length - 1 ? t.lastCard : t.card
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-btn text-white ${t.iconBox}`}
              >
                <span className="block h-5.5 w-5.5">{s.icon}</span>
              </div>
              <span
                className={`font-display text-eyebrow font-bold tracking-label ${t.stepLabel}`}
              >
                {s.step}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          </div>

          {/* 스텝 사이 장식 화살표 — 마지막 스텝 뒤에는 없다. 모바일에선 숨긴다. */}
          {i < steps.length - 1 && (
            <div className={`hidden items-center justify-center px-2 lg:flex ${t.arrow}`}>
              <ArrowRightIcon className="h-8.5 w-8.5" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
