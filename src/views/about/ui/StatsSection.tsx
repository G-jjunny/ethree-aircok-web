import { SITE } from '@/shared/config'
import { SectionLabel } from '@/shared/ui'

const STATS_RADIAL =
  'radial-gradient(110% 120% at 85% 0%, var(--color-navy-tint), var(--color-navy) 60%)'

// Heroicons outline 24px — items 배열 순서와 일치
// [0] 창립 → Building Office 2 | [1] 측정 → CPU Chip
// [2] 인증 → Shield Check     | [3] 전문성 → Academic Cap
const STAT_ICON_PATHS = [
  'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z',
  'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z',
  'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
  'M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-1.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5',
]

/**
 * BY THE NUMBERS (시안 §STATS). 다크 radial, 좌 2x2 스탯 글래스 카드 + 우 FEATURED
 * 인증 카드. 정적 콘텐츠(site.ts about.stats SSOT).
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
        <p className="mt-4 max-w-[520px] text-lead-sm leading-relaxed text-white/70">{body}</p>

        <div className="mt-12 grid gap-6 lg:grid-cols-[2fr_0.82fr]">
          {/* 좌: 2x2 스탯 글래스 카드 */}
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map((stat, i) => (
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
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    {stat.label}
                  </p>
                </div>
                <svg
                  className="size-9 shrink-0 text-cyan"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={STAT_ICON_PATHS[i]} />
                </svg>
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
            {/* 성능인증 배지 일러스트레이션 */}
            <svg
              width="88"
              height="88"
              viewBox="0 0 88 88"
              fill="none"
              aria-hidden="true"
              className="mt-6 text-cyan"
            >
              <circle cx="44" cy="44" r="40" stroke="white" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="5 3" />
              <circle cx="44" cy="44" r="32" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
              <path
                d="M44 20L60 27V44C60 53.5 53 59.5 44 65C35 59.5 28 53.5 28 44V27L44 20Z"
                stroke="currentColor"
                strokeOpacity="0.8"
                strokeWidth="1.5"
              />
              <path
                d="M36 43L41 48L53 35"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="44" cy="74" r="2.5" fill="white" fillOpacity="0.2" />
              <circle cx="34" cy="71" r="1.5" fill="white" fillOpacity="0.12" />
              <circle cx="54" cy="71" r="1.5" fill="white" fillOpacity="0.12" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
