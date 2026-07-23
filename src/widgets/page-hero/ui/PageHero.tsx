// 다크 radial (Blue-Tech 표준 Page Hero) — 토큰 var() 참조, 하드코딩 아님
const HERO_RADIAL =
  'radial-gradient(120% 90% at 78% 0%, var(--color-navy-tint), var(--color-navy) 55%, var(--color-navy-deep) 100%)'

/** 헤드라인 세그먼트. prefix + 선택적 highlight(brand 강조) + 선택적 suffix. */
export interface PageHeroHeadline {
  /** 하이라이트 앞 텍스트. 하이라이트가 없으면 전체 제목이 여기에 들어간다. */
  prefix: string
  /** brand 컬러로 강조할 세그먼트 (선택). 미지정 시 강조 없이 렌더. */
  highlight?: string
  /** 하이라이트 뒤 텍스트 (선택). */
  suffix?: string
}

export interface PageHeroProps {
  /** 필 배지 eyebrow 라벨 (예: "ABOUT AIRCOK"). */
  eyebrow: string
  /** 헤드라인 세그먼트 구조. prefix/highlight/suffix. */
  headline: PageHeroHeadline
  /** 히어로 본문 카피. */
  body: string
}

/**
 * Blue-Tech 표준 페이지 히어로 위젯 (시안 §PAGE HERO).
 *
 * 다크 radial 배경(navy-tint→navy→navy-deep) + 필 배지 eyebrow +
 * prefix/highlight(brand)/suffix 하이라이트 헤드라인 + 본문 카피.
 * 카피 값은 각 페이지가 props로 주입한다(위젯은 카피를 하드코딩하지 않음).
 * 정적 콘텐츠 전용 — 데이터 페칭·상태 없음.
 */
export function PageHero({ eyebrow, headline, body }: PageHeroProps) {
  return (
    <section
      className="relative overflow-hidden bg-navy text-white"
      style={{ backgroundImage: HERO_RADIAL }}
    >
      <div className="content-container py-24">
        <div className="inline-flex rounded-pill border border-brand/40 bg-brand/12 px-3.5 py-1.5 text-eyebrow font-semibold text-brand-soft">
          {eyebrow}
        </div>

        {/* token 없음: leading-[1.12] 디스플레이 헤드라인 행간 — 시안 실측 1회성(big-headline 행간은 섹션마다 달라 단일 토큰화 대상 아님, 홈 HeroSection leading-[1.08]과 동일 관행) */}
        <h1 className="mt-6 max-w-reading text-4xl sm:text-h1 font-extrabold leading-[1.12] tracking-headline">
          {headline.prefix}
          {headline.highlight && (
            <span className="text-brand">{headline.highlight}</span>
          )}
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
