import {
  PhoneCall,
  Wrench,
  Activity,
  FileText,
  type LucideIcon,
} from 'lucide-react'
import { SectionLabel } from '@/shared/ui'

const COPY = {
  eyebrow: 'HOW TO APPLY',
  titleLines: ['공기질 안심진단 서비스', '신청 및 이용방법'],
} as const

type Step = {
  icon: LucideIcon
  no: string
  title: string
  titleNote?: string
  desc: string
  descEmphasis?: string
  descTail?: string
  accent: 'brand' | 'cyan'
}

const STEPS: Step[] = [
  {
    icon: PhoneCall,
    no: 'STEP 01',
    title: '신청 및 상담',
    desc: '유선 신청 · 상담 진행 ',
    descEmphasis: '(세부 서비스·기능 안내, 방문 설치 일정 상담)',
    accent: 'brand',
  },
  {
    icon: Wrench,
    no: 'STEP 02',
    title: '방문 설치',
    desc: '에어콕 컨설턴트 현장 방문 · 측정기 설치 · 사용방법·모니터링 안내 ',
    descEmphasis: '(계정 정보 당일 제공)',
    descTail: ' · 이용요금 결제',
    accent: 'brand',
  },
  {
    icon: Activity,
    no: 'STEP 03',
    title: '서비스 진행',
    titleNote: '(5일)',
    desc: '실시간 측정 모니터링 · 기간별·항목별 그래프 제공 · 설치 전후 공기질 확인',
    accent: 'brand',
  },
  {
    icon: FileText,
    no: 'STEP 04',
    title: '회수 및 레포팅',
    desc: '컨설턴트 방문·측정기 회수 · 서비스 기간 공기질 분석 레포팅 제공 · 공기질 개선을 위한 어드바이스 제공',
    accent: 'cyan',
  },
]

/**
 * 신청 및 이용방법 4스텝 — 정적 흰 배경 섹션. 히어로 "서비스 신청하기" 앵커 타겟(id="apply").
 *
 * 세로 커넥터로 스텝을 잇고, STEP 04(회수·레포팅)만 cyan 강조.
 * 실제 상담 신청 폼은 DiagnosisView 에서 이 섹션 다음에 DiagnosisFormSection 으로 렌더한다.
 */
export function ServiceApplySection() {
  return (
    <section id="apply" className="bg-surface-white pb-20 pt-24">
      <div className="content-container">
        <div className="flex flex-col items-center text-center">
          <SectionLabel color="brand">{COPY.eyebrow}</SectionLabel>
          <h2 className="mt-3 text-h5 font-extrabold tracking-headline text-ink">
            {COPY.titleLines[0]}
            <br />
            {COPY.titleLines[1]}
          </h2>
        </div>

        {/* token 없음: max-w-[860px] 스텝 리스트 폭(1회성) */}
        <div className="mx-auto mt-14 flex max-w-[860px] flex-col">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            const isLast = index === STEPS.length - 1
            const isCyan = step.accent === 'cyan'
            return (
              <div
                key={step.no}
                className="grid grid-cols-[64px_1fr] items-stretch gap-7.5"
              >
                {/* 아이콘 + 세로 커넥터 */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex size-16 items-center justify-center rounded-image shadow-brand ${
                      isCyan ? 'bg-cyan' : 'bg-brand'
                    }`}
                  >
                    <Icon className="size-7.5 text-white" strokeWidth={1.8} aria-hidden />
                  </div>
                  {!isLast && <div className="w-0.5 flex-1 bg-hairline" />}
                </div>

                {/* 카드 */}
                <div
                  className={`grid grid-cols-1 items-center gap-4 rounded-image border border-hairline bg-surface px-7.5 py-6.5 sm:grid-cols-[auto_1fr] sm:gap-8.5 ${
                    isLast ? '' : 'mb-11'
                  }`}
                >
                  {/* token 없음: min-w-[140px] 스텝 라벨 컬럼 폭(1회성) */}
                  <div className="sm:min-w-[140px]">
                    <div
                      className={`font-display text-xs font-bold uppercase tracking-label ${
                        isCyan ? 'text-cyan' : 'text-brand'
                      }`}
                    >
                      {step.no}
                    </div>
                    <div className="mt-1.5 text-xl font-extrabold text-ink">
                      {step.title}
                      {step.titleNote && (
                        <span className="ml-1 text-sm text-brand">
                          {step.titleNote}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm leading-loose text-muted">
                    {step.desc}
                    {step.descEmphasis && (
                      <span className="text-ink">{step.descEmphasis}</span>
                    )}
                    {step.descTail}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
