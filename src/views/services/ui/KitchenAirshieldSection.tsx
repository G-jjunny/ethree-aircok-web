import { Fragment } from 'react'
import { connection } from 'next/server'
import { AirVent, Fan, SlidersHorizontal } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getProductSectionImageListServer } from '@/entities/product-section-image/server'
import { getSlotImage, type ProductSectionImage } from '@/entities/product-section-image'
import { ChefLabel } from './ChefLabel'
import { SlotImage } from './SlotImage'

/**
 * 에어쉴드 섹션 배경 — design.md §2 에 명시된 chef 계열 radial 그라디언트.
 * 토큰 var() 파생이므로 하드코딩이 아니다(KitchenBrandSection 의 KITCHEN_GLOW 와 동일 규약).
 */
const AIRSHIELD_BG =
  'radial-gradient(110% 120% at 85% 0%, var(--color-chef-dark-tint), var(--color-chef-dark) 62%)'

/** 우상단 chef 글로우 — 토큰 var() + color-mix 파생(design.md §2 "기본 토큰 + opacity"). */
const AIRSHIELD_GLOW =
  'radial-gradient(circle at 40% 40%, color-mix(in oklab, var(--color-chef) 50%, transparent), transparent 62%)'

const COPY = {
  eyebrow: 'AIR CHEF AIRSHIELD',
  title: '에어셰프 에어쉴드',
  /** h2 뒤에 붙는 작은 서브 타이틀. */
  subtitle: '· 공기 개선 급기장치',
  /** 시안 줄바꿈 기준 2줄. 렌더 시 <br /> 로 이어붙인다. */
  body: [
    '왓소노즐 방식의 에어셰프만의 특허 기술로 별도 장비 교체없이 에이쉴드만으로 간편한 공기질 개선 시스템입니다.',
    '공간 규모에 따라 맞춤형으로 설계됩니다.',
  ],
  scaleEyebrow: 'SCALE-BASED SOLUTION',
  scaleTitle: '공간 규모에 따른 맞춤형 서비스',
}

/** 기능 카드 3종 — 아이콘은 lucide 컴포넌트(크기·색은 호출부 클래스가 정한다). */
const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: AirVent,
    title: '특허 급기 기술',
    body: '에어커튼 방식의 특허 급기 구조로 오염 공기 확산을 차단하고 청정 영역을 형성합니다.',
  },
  {
    icon: Fan,
    title: '유증기 저감',
    body: '고효율 필터와 급배기 밸런스 제어로 조리 중 발생하는 유증기와 냄새를 크게 저감합니다.',
  },
  {
    icon: SlidersHorizontal,
    title: '자동 연동 제어',
    body: '블랙박스 진단 데이터와 연동해 오염도에 따라 급기량을 자동 조절합니다.',
  },
]

/** 티어 카드의 4개 스펙 항목 — 3티어 공통 순서. */
type TierSpec = { label: string; value: string }

/**
 * 공간 규모별 3티어. `featured` 는 PREMIUM 강조 톤(청록 틴트) 여부 —
 * BASIC/LIGHT 는 중립 톤이라 한 카드에서만 true 다.
 */
const TIERS: {
  badge: string
  name: string
  featured: boolean
  specs: TierSpec[]
}[] = [
  {
    badge: 'PREMIUM',
    name: '에어셰프 프리미엄',
    featured: true,
    specs: [
      { label: '규모', value: '300㎡ 이상 규모 식당시설' },
      { label: '주요 타겟', value: '학교, 대형 급식시설' },
      { label: '핵심 솔루션', value: '복합 대형 급배기시설 및 다량 왓소노즐 설치' },
      { label: '전용 모니터링', value: '조리실 모니터링 서비스' },
    ],
  },
  {
    badge: 'BASIC',
    name: '에어셰프 베이직',
    featured: false,
    specs: [
      { label: '규모', value: '100㎡ 이상 규모 식당시설' },
      { label: '주요 타겟', value: '중소형 급식시설, 중대형식당' },
      { label: '핵심 솔루션', value: '복합 급배기시설 및 왓소노즐 설치' },
      { label: '전용 모니터링', value: '조리실 모니터링 서비스' },
    ],
  },
  {
    badge: 'LIGHT',
    name: '에어셰프 라이트',
    featured: false,
    specs: [
      { label: '규모', value: '소형 식당시설' },
      { label: '주요 타겟', value: '소형식당' },
      { label: '핵심 솔루션', value: '왓소노즐 1기 기반 기본 급배기' },
      { label: '전용 모니터링', value: '설치전·후 5일간 모니터링' },
    ],
  },
]

/** 티어 강조/중립 톤 매핑 — 구조는 공유하고 색상만 교체한다(ProcessFlow 의 TONE 규약과 동일). */
const TIER_TONE = {
  featured: {
    card: 'bg-chef/12 border-chef-soft/35',
    badge: 'bg-chef-soft/20 border-chef-soft/40 text-chef-soft',
    specLabel: 'text-chef-soft',
    specValue: 'text-white',
  },
  neutral: {
    card: 'bg-white/4 border-white/10',
    badge: 'bg-white/8 border-white/16 text-white/75',
    specLabel: 'text-white/50',
    specValue: 'text-white/90',
  },
}

/**
 * [주방] 에어셰프 에어쉴드 — 좌 특허 급기 기술 이미지 / 우 기능 카드 3종 + 공간 규모별 3티어.
 *
 * 대비 규칙(design.md §2): chef-dark 계열 radial 섹션이므로 eyebrow 는 chef 가 아니라 chef-soft,
 * 슬롯 폴백은 chef-dark variant 를 쓴다(chef-dark 는 자체 배경색이 없어 섹션 배경이 제공한다).
 * 슬롯 이미지는 KitchenDiagnosisSection 과 동일하게 서버에서 한 번만 조회한다.
 */
export async function KitchenAirshieldSection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  await connection()

  let images: ProductSectionImage[] = []
  try {
    images = await getProductSectionImageListServer()
  } catch {
    images = []
  }

  const tech = getSlotImage(images, 'KITCHEN_AIRSHIELD_TECH')

  return (
    <section
      className="relative overflow-hidden bg-chef-dark py-24"
      style={{ backgroundImage: AIRSHIELD_BG }}
    >
      <div
        aria-hidden="true"
        className="absolute -right-30 -top-20 h-130 w-130 rounded-full blur-xl"
        style={{ backgroundImage: AIRSHIELD_GLOW }}
      />

      <div className="relative z-10 content-container">
        <ChefLabel tone="chef-soft">{COPY.eyebrow}</ChefLabel>
        <h2 className="mt-3 text-h5 font-extrabold tracking-headline text-white">
          {COPY.title}{' '}
          <span className="text-lg font-semibold text-white/55">{COPY.subtitle}</span>
        </h2>
        <p className="mt-3 text-lead-sm leading-relaxed text-white/68">
          {COPY.body.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </p>

        <div className="mt-11 grid items-stretch gap-4 lg:grid-cols-2">
          {/* 좌: 특허 급기 기술 이미지 슬롯 */}
          <SlotImage
            src={tech}
            alt="에어쉴드 특허 급기 기술"
            label="AIRSHIELD"
            variant="chef-dark"
            rounded="rounded-image"
            className="min-h-80 w-full"
            sizes="(min-width: 1024px) 580px, 100vw"
          />

          {/* 우: 기능 카드 3종 세로 스택 */}
          <ul className="flex flex-col gap-4">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="flex flex-1 items-start gap-4.5 rounded-image border border-white/14 bg-linear-160 from-white/8 to-white/2 px-6.5 py-5"
              >
                <span className="flex size-11.5 shrink-0 items-center justify-center rounded-btn border border-chef-soft/40 bg-chef/25 text-chef-soft">
                  <Icon className="size-5.5" />
                </span>
                <div>
                  <h3 className="text-lead font-extrabold text-white">{title}</h3>
                  <p className="mt-2 text-meta leading-relaxed text-white/62">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 공간 규모별 맞춤형 3티어 */}
        <div className="mt-5 rounded-card border border-white/12 bg-white/5 px-6 py-8.5">
          <ChefLabel tone="chef-soft" size="sm">
            {COPY.scaleEyebrow}
          </ChefLabel>
          <h3 className="mt-2 text-xl font-extrabold text-white">{COPY.scaleTitle}</h3>

          <ul className="mt-6.5 grid gap-4 md:grid-cols-3">
            {TIERS.map((tier) => {
              const t = tier.featured ? TIER_TONE.featured : TIER_TONE.neutral
              return (
                <li key={tier.badge} className={`rounded-image border px-5 py-6.5 ${t.card}`}>
                  <span
                    className={`inline-flex rounded-pill border px-3 py-1.5 font-display text-mini font-bold tracking-label-sm ${t.badge}`}
                  >
                    {tier.badge}
                  </span>
                  <div className="mt-3 text-lg font-extrabold text-white">{tier.name}</div>

                  <dl className="mt-5 flex flex-col gap-4">
                    {tier.specs.map((spec) => (
                      <div key={spec.label}>
                        <dt className={`text-mini font-bold ${t.specLabel}`}>{spec.label}</dt>
                        <dd className={`mt-1 text-sm leading-snug ${t.specValue}`}>
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
