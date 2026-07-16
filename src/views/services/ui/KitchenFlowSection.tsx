import { SITE } from '@/shared/config'
import { ChefLabel } from './ChefLabel'
import { ProcessFlow, type FlowStep } from './ProcessFlow'
import { PulseIcon, SearchIcon, SparkleIcon } from './icons'

const COPY = {
  eyebrow: 'PROCESS',
  body: '주방 공기질을 진단하고 맞춤 장치로 개선한 뒤, 지속적으로 관리하는 3단계 프로세스로 운영됩니다.',
}

const STEPS: FlowStep[] = [
  {
    step: 'STEP 01',
    title: '진단',
    body: '현장 공기질을 측정·분석하여 유증기·미세먼지 발생 원인을 진단합니다.',
    icon: <SearchIcon className="h-full w-full" />,
  },
  {
    step: 'STEP 02',
    title: '개선',
    body: '에어쉴드 급기장치로 청정 공기를 공급하고 오염 공기를 배출·정화합니다.',
    icon: <SparkleIcon className="h-full w-full" />,
  },
  {
    step: 'STEP 03',
    title: '관리',
    body: '블랙박스로 실시간 모니터링하고 정기 진단 보고서로 지속 관리합니다.',
    icon: <PulseIcon className="h-full w-full" />,
  },
]

/**
 * [주방] 에어셰프 구성 및 프로세스 — 3스텝 정적 콘텐츠. 데이터 페칭 없음(정적 셸에 프리렌더된다).
 * 라이트 배경이므로 eyebrow 는 chef 톤(대비 규칙: 라이트 위 강조 = chef).
 */
export function KitchenFlowSection() {
  return (
    <section className="bg-surface-white pb-24 pt-16">
      <div className="content-container">
        <ChefLabel>{COPY.eyebrow}</ChefLabel>
        <h2 className="mt-3 text-h5 font-extrabold tracking-headline text-ink">
          {SITE.airChef.name} 구성 및 프로세스
        </h2>
        {/* token 없음: max-w-[640px] 섹션 리드 프로즈 폭(1회성) */}
        <p className="mt-3 max-w-[640px] text-lead-sm leading-relaxed text-muted">
          {COPY.body}
        </p>

        <ProcessFlow steps={STEPS} tone="chef" />
      </div>
    </section>
  )
}
