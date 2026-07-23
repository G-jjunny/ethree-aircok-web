import { ChartNoAxesColumn, Database, Monitor } from 'lucide-react'
import { SectionLabel } from '@/shared/ui'
import { ProcessFlow, type FlowStep } from './ProcessFlow'

const COPY = {
  eyebrow: 'SYSTEM ARCHITECTURE',
  title: '스마트 에어콕 시스템 구성',
  body: '측정기가 수집한 데이터가 클라우드에 저장·분석되고, 관리자와 사용자에게 실시간으로 전달되는 통합 흐름입니다.',
}

const STEPS: FlowStep[] = [
  {
    step: 'STEP 01',
    title: '측정',
    body: '공기질 측정기가 미세먼지·CO₂·VOCs 등 12종 지표를 실시간 감지합니다.',
    icon: <ChartNoAxesColumn className="h-full w-full" />,
  },
  {
    step: 'STEP 02',
    title: '저장 · 분석',
    body: '수집 데이터를 클라우드에 저장하고 알고리즘으로 추이·이상치를 분석합니다.',
    icon: <Database className="h-full w-full" />,
  },
  {
    step: 'STEP 03',
    title: '모니터링 · 관리',
    body: '웹·모바일 대시보드로 실시간 확인하고 환기·정화 설비를 제어합니다.',
    icon: <Monitor className="h-full w-full" />,
  },
]

/**
 * [실내] 시스템 구성 FLOW — 3스텝 정적 콘텐츠. 데이터 페칭 없음(정적 셸에 프리렌더된다).
 */
export function IndoorFlowSection() {
  return (
    <section className="bg-surface-white pb-24 pt-16">
      <div className="content-container">
        <SectionLabel color="brand">{COPY.eyebrow}</SectionLabel>
        <h2 className="mt-3 text-h6 sm:text-h5 font-extrabold tracking-headline text-ink">
          {COPY.title}
        </h2>
        {/* token 없음: max-w-[640px] 섹션 리드 프로즈 폭(1회성) */}
        <p className="mt-3 max-w-[640px] text-lead-sm leading-relaxed text-muted">
          {COPY.body}
        </p>

        <ProcessFlow steps={STEPS} tone="brand" />
      </div>
    </section>
  )
}
