import { SITE } from '@/shared/config'
import { SectionHeader, FeatureCard } from '@/shared/ui'

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
          <div className="py-20">
            <SectionHeader
              label={SITE.about.hero.label}
              title={SITE.about.hero.headline}
              body={SITE.about.hero.body}
              theme="dark"
              titleAs="h1"
            />
          </div>
        </div>
      </section>

      {/* ── Section 2: 스마트 에어콕 소개 ───────────────── */}
      <section className="bg-surface-white py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="mb-12">
            <SectionHeader
              label={SITE.about.intro.label}
              title={SITE.about.intro.title}
              body={SITE.about.intro.body}
              theme="light"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SITE.about.intro.values.map((value) => (
              <FeatureCard
                key={value.title}
                title={value.title}
                description={value.description}
                theme="light"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: 팀 소개 ──────────────────────────── */}
      <section className="bg-surface-light py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          <SectionHeader
            label={SITE.about.team.label}
            title={SITE.about.team.title}
            body={SITE.about.team.body}
            theme="light"
          />
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
          <div className="mb-8">
            <SectionHeader
              label="Our Partners"
              title={SITE.partners.heading}
              body="우리의 파트너가 여러분이 믿을 수 있는 회사와 기관이라는 점에서 마음의 안심을 줍니다."
              theme="dark"
            />
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
          <div className="mb-14">
            <SectionHeader
              label={SITE.about.history.label}
              title={SITE.about.history.title}
              theme="light"
            />
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
