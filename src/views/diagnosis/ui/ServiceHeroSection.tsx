import Link from 'next/link'
import { PagePlaceholder } from '@/shared/ui'

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
 * views 로컬로 구현한다. 데이터 페칭·상태 없음(정적). 우측 이미지 슬롯은 미정의이므로
 * 다크 톤 PagePlaceholder 로 렌더한다.
 */
export function ServiceHeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-navy text-white"
      style={{ backgroundImage: HERO_RADIAL }}
    >
      <div className="content-container grid items-center gap-14 py-24 lg:grid-cols-[1.05fr_0.95fr]">
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

          {/* 스탯칩 3개 */}
          <div className="mt-8.5 flex flex-wrap gap-3">
            {STATS.map((stat) => (
              <div
                key={stat.value}
                className="rounded-image border border-white/12 bg-white/7 px-5.5 py-3.5"
              >
                <div className="font-display text-h6 font-extrabold text-cyan">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-mini text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* 듀얼 CTA */}
          <div className="mt-9.5 flex flex-wrap gap-3.5">
            <Link
              href="#apply"
              className="rounded-btn bg-brand px-7.5 py-4 text-base font-bold text-brand-ink shadow-brand"
            >
              {COPY.ctaPrimary}
            </Link>
            <Link
              href="#flow"
              className="rounded-btn border border-white/32 px-7.5 py-4 text-base font-semibold text-white"
            >
              {COPY.ctaSecondary}
            </Link>
          </div>
        </div>

        {/* 이미지 카드 컬럼 — 슬롯 미정의이므로 다크 폴백 + 정적 플로팅 배지 */}
        <div className="relative">
          <PagePlaceholder
            variant="dark"
            label="DIAGNOSIS"
            rounded="rounded-card-lg"
            className="aspect-[4/3] w-full shadow-float"
          />
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
