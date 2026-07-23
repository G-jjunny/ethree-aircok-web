import type { ReactNode } from 'react'
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  Droplet,
  type LucideIcon,
} from 'lucide-react'
import { SectionLabel } from '@/shared/ui'

const COPY = {
  eyebrow: 'WHY AIRCOK',
  titlePrefix: '공기오염 걱정?',
  titleSuffix: '에어콕이 꼭(COK) 집어드립니다',
} as const

const TRUST_BLOCKS = [
  {
    no: '01',
    title: '실시간 오염 정보 제공',
    desc: '현장의 공기질을 최대 8가지 항목으로 실시간 측정해 제공합니다. 국가 주관 미세먼지·이산화탄소 성능인증 1등급의 정확성을 보장합니다.',
  },
  {
    no: '02',
    title: '믿고 쓸 수 있는 신뢰성',
    desc: '2018년 출시 이후 1,800대 이상을 전국 학교·연구기관·기업·공공에 납품했습니다. 구매 후 50% 이상의 재구매율이 신뢰성을 증명합니다.',
  },
  {
    no: '03',
    title: '건강한 하루의 시작',
    desc: '우리가 하루에 마시는 공기 10,000L. 그 안의 미세먼지와 이산화탄소는 건강과 집중력을 떨어뜨립니다. 실내공기질 관리부터 시작하세요.',
  },
] as const

const STAT_BAND: {
  icon: LucideIcon
  value: string
  unit?: string
  label: string
  caption: string
}[] = [
  {
    icon: Building2,
    value: '1,800',
    unit: '대+',
    label: '전국 누적 납품',
    caption: '학교·연구기관·기업·공공',
  },
  {
    icon: TrendingUp,
    value: '50',
    unit: '%+',
    label: '재구매율',
    caption: '신뢰가 증명한 만족도',
  },
  {
    icon: ShieldCheck,
    value: '1등급',
    label: '국가 성능인증',
    caption: '미세먼지·이산화탄소',
  },
  {
    icon: Droplet,
    value: '10,000',
    unit: 'L',
    label: '하루 마시는 공기',
    caption: '건강을 좌우하는 양',
  },
]

// 통계밴드 navy 그라디언트 — 토큰 var() 참조, 하드코딩 아님
const STAT_BAND_BG =
  'linear-gradient(120deg, var(--color-navy-tint), var(--color-navy))'

/**
 * 서비스 신뢰도 — 정적 흰 배경 섹션.
 * 헤더 + 신뢰 3블록(01~03 bordered 그리드) + 통계밴드(navy 그라디언트 4열, 로컬 구현).
 * DarkStatCard/LightStatCard 는 category 아이콘 키가 고정이라 재사용하지 않고 로컬로 구현.
 *
 * children 으로 연혁 타임라인(ServiceHistorySection Suspense)을 통계밴드 다음에 받아
 * 같은 content-container 안에서 시각적으로 이어지게 렌더한다(파일 분리는 유지).
 */
export function ServiceTrustSection({ children }: { children?: ReactNode }) {
  return (
    <section className="bg-surface-white py-24">
      <div className="content-container">
        {/* token 없음: max-w-[640px] 헤더 프로즈 폭(1회성) */}
        <div className="max-w-[640px]">
          <SectionLabel color="brand">{COPY.eyebrow}</SectionLabel>
          <h2 className="mt-3 text-h5 font-extrabold leading-tight tracking-headline text-ink">
            {COPY.titlePrefix}
            <br />
            {COPY.titleSuffix}
          </h2>
        </div>

        {/* 신뢰 3블록 */}
        <div className="mt-13 grid grid-cols-1 divide-y divide-hairline overflow-hidden rounded-card-lg border border-hairline md:grid-cols-3 md:divide-x md:divide-y-0">
          {TRUST_BLOCKS.map((block) => (
            <div key={block.no} className="px-8.5 py-9.5">
              <div className="font-display text-h4 font-light leading-none text-hairline">
                {block.no}
              </div>
              <h3 className="mt-3 text-xl font-extrabold text-ink">
                {block.title}
              </h3>
              <p className="mt-3.5 text-sm leading-relaxed text-muted">
                {block.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 통계밴드 */}
        <div
          className="relative mt-5.5 overflow-hidden rounded-card-lg px-5 py-11 text-white sm:px-10.5"
          style={{ backgroundImage: STAT_BAND_BG }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 size-85 rounded-full bg-brand/35 blur-xl"
          />
          <div className="relative grid grid-cols-1 gap-8.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/10">
            {STAT_BAND.map(({ icon: Icon, value, unit, label, caption }) => (
              <div key={label} className="lg:px-7.5 lg:first:pl-0 lg:last:pr-0">
                <div className="flex size-10.5 items-center justify-center rounded-btn border border-brand-soft/40 bg-brand/22">
                  <Icon className="size-5.5 text-cyan" strokeWidth={1.8} aria-hidden />
                </div>
                <div className="mt-4.5 font-display text-h4 font-extrabold leading-none">
                  {value}
                  {unit && <span className="text-xl text-cyan">{unit}</span>}
                </div>
                <div className="mt-2.5 text-sm font-semibold text-white/60">
                  {label}
                </div>
                <div className="mt-1 text-meta text-white/40">{caption}</div>
              </div>
            ))}
          </div>
        </div>

        {children}
      </div>
    </section>
  )
}
