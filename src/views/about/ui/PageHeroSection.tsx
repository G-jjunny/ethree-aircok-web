import { SITE } from '@/shared/config'

// 다크 radial (시안 About Hero) — 토큰 var() 참조, 하드코딩 아님
const HERO_RADIAL =
  'radial-gradient(120% 90% at 78% 0%, var(--color-navy-tint), var(--color-navy) 55%, var(--color-navy-deep) 100%)'

/**
 * About 페이지 히어로 (시안 §PAGE HERO). 다크 radial 배경, ABOUT AIRCOK 배지,
 * "콕콕" 하이라이트 헤드라인. 정적 콘텐츠(데이터 페칭 없음).
 */
export function PageHeroSection() {
  const { eyebrow, headline, body } = SITE.about.hero

  return (
    <section
      className="relative overflow-hidden bg-navy text-white"
      style={{ backgroundImage: HERO_RADIAL }}
    >
      <div className="content-container py-24">
        <div className="inline-flex rounded-pill border border-brand/40 bg-brand/12 px-3.5 py-1.5 text-eyebrow font-semibold text-brand-soft">
          {eyebrow}
        </div>

        {/* token 없음: max-w-[760px] 헤드라인 프로즈 폭 · leading-[1.12] 디스플레이 헤드라인 행간 — 시안 실측 1회성(프로즈 폭·big-headline 행간은 섹션마다 달라 단일 토큰화 대상 아님, 홈 HeroSection leading-[1.08]과 동일 관행) */}
        <h1 className="mt-6 max-w-[760px] text-h1 font-extrabold leading-[1.12] tracking-headline">
          {headline.prefix}
          <span className="text-brand">{headline.highlight}</span>
          {headline.suffix}
        </h1>

        {/* token 없음: max-w-[560px] 히어로 본문 프로즈 폭(1회성) */}
        <p className="mt-5 max-w-[560px] text-lead leading-relaxed text-white/68">
          {body}
        </p>
      </div>
    </section>
  )
}
