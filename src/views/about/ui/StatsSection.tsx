import { SITE } from '@/shared/config'
import { SectionLabel, PagePlaceholder } from '@/shared/ui'

// 다크 radial (시안 STATS) — 토큰 var() 참조
const STATS_RADIAL =
  'radial-gradient(110% 120% at 85% 0%, var(--color-navy-tint), var(--color-navy) 60%)'

/**
 * BY THE NUMBERS (시안 §STATS). 다크 radial, 좌 2x2 스탯 글래스 카드 + 우 FEATURED
 * 인증 카드. 정적 콘텐츠(site.ts about.stats SSOT), 미니 이미지는 플레이스홀더.
 */
export function StatsSection() {
  const { eyebrow, title, body, items, featured } = SITE.about.stats

  return (
    <section
      className="bg-navy py-20 text-white"
      style={{ backgroundImage: STATS_RADIAL }}
    >
      <div className="content-container">
        <SectionLabel color="cyan">{eyebrow}</SectionLabel>
        {/* token 없음: max-w-[640px]/[520px] 섹션 헤더·리드 프로즈 폭(1회성, 섹션마다 상이) */}
        <h2 className="mt-4 max-w-[640px] text-h5 font-extrabold tracking-headline">
          {title}
        </h2>
        <p className="mt-4 max-w-[520px] text-lead-sm text-white/62">{body}</p>

        <div className="mt-12 grid gap-6 lg:grid-cols-[2fr_0.82fr]">
          {/* 좌: 2x2 스탯 글래스 카드 */}
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between gap-4 rounded-card border border-white/12 bg-white/7 p-6"
              >
                <div>
                  <div className="font-display text-stat font-extrabold leading-none">
                    {stat.value}
                    {stat.unit && (
                      <span className="ml-1 text-h6 text-cyan">{stat.unit}</span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/62">
                    {stat.label}
                  </p>
                </div>
                <PagePlaceholder
                  variant="dark"
                  rounded="rounded-btn"
                  className="h-16 w-28 shrink-0"
                />
              </div>
            ))}
          </div>

          {/* 우: FEATURED 인증 카드 (brand 틴트) */}
          <div className="flex flex-col rounded-card border border-brand/40 bg-brand/12 p-6">
            <SectionLabel color="cyan" size="sm">
              {featured.eyebrow}
            </SectionLabel>
            <div className="mt-4 font-display text-hero font-extrabold leading-none">
              {featured.value}
              <span className="ml-1 text-h6 text-cyan">{featured.unit}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {featured.body}
            </p>
            <PagePlaceholder
              variant="dark"
              rounded="rounded-btn"
              className="mt-6 aspect-row-thumb w-full"
              label="성능인증 마크"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
