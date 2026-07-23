import { Suspense } from 'react'
import Link from 'next/link'
import { HeroBackgroundVideo } from '@/shared/ui'
import { ServiceHeroImage, ServiceHeroImageFallback } from './ServiceHeroImage'

// 다크 radial (Blue-Tech 표준 Page Hero) — 토큰 var() 참조, 하드코딩 아님
const HERO_RADIAL =
  'radial-gradient(120% 90% at 82% 0%, var(--color-navy-tint), var(--color-navy) 55%, var(--color-navy-deep) 100%)'

const COPY = {
  eyebrow: 'AIR QUALITY DIAGNOSIS',
  headlinePrefix: '지금, 여기',
  headlineSuffix: '이 공기는 안전할까요?',
  bodyPrefix: '보이지 않아 지나쳤던 실내 공기. ',
  bodyEmphasis: '에어콕 공기질 안심 진단 서비스',
  bodySuffix: '가 5일간 정밀 측정해, 지금 우리 공간의 공기를 눈으로 보여드립니다.',
  ctaPrimary: '서비스 신청하기',
  ctaSecondary: '이용 방법 보기',
  badgeLabel: '실시간 측정 중',
  badgeUnit: '㎍/㎥',
} as const

const STATS = [
  { value: '5일', label: '정밀 측정·분석' },
  { value: '8항목', label: '주요 오염물질 측정' },
  { value: '1등급', label: '국가 성능인증' },
] as const

/**
 * 진단 페이지 히어로 — 2컬럼(카피 + 이미지 카드) 정적 서버 컴포넌트.
 *
 * PageHero 위젯은 단일 컬럼 텍스트 전용이라 스탯칩·듀얼 CTA·플로팅 배지 구성을 담지 못해
 * views 로컬로 구현한다. 카피·스탯칩·플로팅 배지는 정적이며, 우측 이미지 카드만
 * DIAGNOSIS_HERO 슬롯을 읽는 async 데이터 컴포넌트를 Suspense 경계로 감싸 스트리밍한다
 * (슬롯 미등록이면 기존 다크 톤 폴백 그대로).
 */
export function ServiceHeroSection() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      {/* 배경 영상 (최하단 레이어, 장식). 로드 전/실패 시 section 의 bg-navy 폴백 */}
      <HeroBackgroundVideo className="absolute inset-0 h-full w-full object-cover" />

      {/* 다크 오버레이 (가독성). HERO_RADIAL 다크 radial(navy 토큰) 을 반투명으로 덧대
          흰 텍스트 대비를 확보하되 영상이 은은히 비치게 한다. 홈 히어로(opacity-75)와 달리
          진단 히어로는 영상 위를 덮는 드리프트 글로우가 없어 영상 노출량이 커, 스크림을
          한 단계 강화(opacity-85)해 좌측 카피 흰 텍스트 대비 마진을 보상한다.
          opacity 유틸은 design.md §2 자유값 허용(하드코딩 아님) */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-85"
        style={{ backgroundImage: HERO_RADIAL }}
      />

      <div className="content-container relative z-10 grid items-center gap-10 py-14 sm:gap-14 sm:py-24 lg:grid-cols-[1.05fr_0.95fr]">
        {/* 카피 컬럼 */}
        <div>
          <p className="font-display text-eyebrow font-semibold uppercase tracking-eyebrow-lg text-cyan">
            {COPY.eyebrow}
          </p>
          {/* token 없음: leading-[1.14] 디스플레이 헤드라인 행간 — 시안 실측 1회성 */}
          <h1 className="mt-5.5 text-h1 font-extrabold leading-[1.14] tracking-headline">
            {COPY.headlinePrefix}
            <br />
            {COPY.headlineSuffix}
          </h1>
          {/* token 없음: max-w-[500px] 히어로 본문 프로즈 폭(1회성) */}
          <p className="mt-6.5 max-w-[500px] text-lead leading-relaxed text-white/70">
            {COPY.bodyPrefix}
            <b className="text-white">{COPY.bodyEmphasis}</b>
            {COPY.bodySuffix}
          </p>

          {/* 스탯칩 3개 — 모바일 3열 grid 한 줄(셀 ~93px), sm 이상 기존 flex 복원.
              칩 시각(보더·배경·라운드)은 유지하고 크기만 반응형(#155) */}
          <div className="mt-8.5 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            {STATS.map((stat) => (
              <div
                key={stat.value}
                className="rounded-image border border-white/12 bg-white/7 px-2.5 py-2.5 sm:px-5.5 sm:py-3.5"
              >
                {/* text-h6(28) 은 fluid 미적용 토큰이라 모바일 축소를 로컬 페어(text-lg)로 보완 */}
                <div className="font-display text-lg font-extrabold text-cyan sm:text-h6">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-mini text-white/60 [word-break:keep-all]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* 듀얼 CTA */}
          <div className="mt-9.5 flex flex-wrap gap-3.5">
            {/* raw Link 유지(공용 Button primary 는 그라디언트라 교체 시 데스크탑 시각 변화).
                Button md 와 동일한 반응형 패턴만 적용 — sm 이상은 현행(px-7.5 py-4 text-base) 픽셀 동일,
                min-h-11 은 44px 터치 타깃(데스크탑 높이 56px 라 no-op)(#155) */}
            <Link
              href="#apply"
              className="inline-flex min-h-11 items-center justify-center rounded-btn bg-brand px-5 py-3 text-sm font-bold text-brand-ink shadow-brand sm:px-7.5 sm:py-4 sm:text-base"
            >
              {COPY.ctaPrimary}
            </Link>
            <Link
              href="#flow"
              className="inline-flex min-h-11 items-center justify-center rounded-btn border border-white/32 px-5 py-3 text-sm font-semibold text-white sm:px-7.5 sm:py-4 sm:text-base"
            >
              {COPY.ctaSecondary}
            </Link>
          </div>
        </div>

        {/* 이미지 카드 컬럼 — DIAGNOSIS_HERO 슬롯(미등록 시 다크 폴백) + 정적 플로팅 배지 */}
        <div className="relative">
          <Suspense fallback={<ServiceHeroImageFallback />}>
            <ServiceHeroImage />
          </Suspense>
          {/* token 없음: -left-3.5/-bottom-4 플로팅 배지 오프셋(1회성 실측) */}
          <div className="absolute -bottom-4 -left-3.5 rounded-image bg-surface-white px-5.5 py-3.5 text-ink shadow-float">
            <div className="text-mini text-muted">{COPY.badgeLabel}</div>
            <div className="mt-0.5 font-display text-xl font-extrabold text-brand">
              PM2.5 <span className="text-ink">28</span>{' '}
              <span className="text-mini font-normal text-muted">
                {COPY.badgeUnit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
