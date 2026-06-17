import { SITE } from '@/shared/config'

type HistoryItem = (typeof SITE.about.history.items)[number]

function groupByYear(items: readonly HistoryItem[]): { year: number; events: HistoryItem[] }[] {
  const map = new Map<number, HistoryItem[]>()
  for (const item of items) {
    if (!map.has(item.year)) map.set(item.year, [])
    map.get(item.year)!.push(item)
  }
  // 최신 연도 먼저 (내림차순)
  return Array.from(map.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, events]) => ({ year, events }))
}

export function AboutView() {
  const historyGroups = groupByYear(SITE.about.history.items)

  return (
    <main>
      {/* ── Section 1: Page Hero ─────────────────────────── */}
      <section className="bg-surface-dark">
        <div className="max-w-[1200px] mx-auto px-5 min-h-[480px] flex items-center">
          <div className="flex flex-col gap-4 py-20">
            <span className="text-aircok-blue-light text-xs font-semibold uppercase tracking-widest">
              {SITE.about.hero.label}
            </span>
            <h1 className="text-[28px] sm:text-[40px] font-semibold text-heading-light leading-[1.10] tracking-[-0.3px] [word-break:keep-all] max-w-[720px]">
              {SITE.about.hero.headline}
            </h1>
            <p className="text-[17px] text-body-light leading-[1.65] [word-break:keep-all] max-w-[640px]">
              {SITE.about.hero.body}
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2: 스마트 에어콕 소개 ───────────────── */}
      <section className="bg-surface-white py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex flex-col gap-4 mb-12">
            <span className="text-aircok-blue text-xs font-semibold uppercase tracking-widest">
              {SITE.about.intro.label}
            </span>
            <h2 className="text-[40px] font-semibold text-heading-dark leading-[1.10] tracking-[-0.3px] [word-break:keep-all] max-w-[720px]">
              {SITE.about.intro.title}
            </h2>
            <p className="text-[17px] text-body-dark leading-[1.65] [word-break:keep-all] max-w-[640px]">
              {SITE.about.intro.body}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SITE.about.intro.values.map((value) => (
              <div
                key={value.title}
                className="bg-surface-light rounded-xl p-8 flex flex-col gap-3"
              >
                <h3 className="text-[21px] font-bold text-heading-dark leading-[1.19]">
                  {value.title}
                </h3>
                <p className="text-[17px] text-body-dark leading-[1.65] [word-break:keep-all]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: 팀 소개 ──────────────────────────── */}
      <section className="bg-surface-light py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex flex-col gap-4">
            <span className="text-aircok-blue text-xs font-semibold uppercase tracking-widest">
              {SITE.about.team.label}
            </span>
            <h2 className="text-[40px] font-semibold text-heading-dark leading-[1.10] tracking-[-0.3px] [word-break:keep-all] max-w-[720px]">
              {SITE.about.team.title}
            </h2>
            <p className="text-[17px] text-body-dark leading-[1.65] [word-break:keep-all] max-w-[640px]">
              {SITE.about.team.body}
            </p>
          </div>
          {/* 팀 카드 placeholder 3열 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {(['첫번째 팀원', '두번째 팀원', '세번째 팀원'] as const).map((label) => (
              <div
                key={label}
                className="bg-surface-white rounded-xl aspect-square flex items-center justify-center"
              >
                <p className="text-secondary-dark text-sm [word-break:keep-all] text-center px-6">
                  팀원 사진 준비 중
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: 파트너사 ─────────────────────────── */}
      <section className="bg-surface-dark py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex flex-col gap-4 mb-8">
            <span className="text-aircok-blue-light text-xs font-semibold uppercase tracking-widest">
              Our Partners
            </span>
            <h2 className="text-[40px] font-semibold text-heading-light leading-[1.10] tracking-[-0.3px] [word-break:keep-all] max-w-[720px]">
              {SITE.partners.heading}
            </h2>
            <p className="text-[17px] text-body-light leading-[1.65] [word-break:keep-all] max-w-[640px]">
              우리의 파트너가 여러분이 믿을 수 있는 회사와 기관이라는 점에서 마음의 안심을 줍니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            {SITE.partners.list.map((partner) => (
              <span
                key={partner}
                className="bg-overlay-white-10 text-heading-light rounded-pill px-4 py-2 text-sm"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: 연혁 History ─────────────────────── */}
      <section className="bg-surface-white py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex flex-col gap-4 mb-14">
            <span className="text-aircok-blue text-xs font-semibold uppercase tracking-widest">
              {SITE.about.history.label}
            </span>
            <h2 className="text-[40px] font-semibold text-heading-dark leading-[1.10] tracking-[-0.3px] [word-break:keep-all] max-w-[720px]">
              {SITE.about.history.title}
            </h2>
          </div>
          <div className="flex flex-col">
            {historyGroups.map((group) => (
              <div
                key={group.year}
                className="border-t border-border-light py-8 grid grid-cols-[120px_1fr] gap-8 md:grid-cols-[160px_1fr]"
              >
                <div className="text-[40px] font-bold text-aircok-blue leading-none pt-1">
                  {group.year}
                </div>
                <ul className="flex flex-col gap-4">
                  {group.events.map((event, idx) => (
                    <li key={`${event.month}-${idx}`} className="flex gap-3">
                      <span className="text-secondary-dark text-sm font-medium shrink-0 w-10">
                        {event.month}
                      </span>
                      <span className="text-[17px] text-body-dark leading-[1.65] [word-break:keep-all]">
                        {event.event}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
