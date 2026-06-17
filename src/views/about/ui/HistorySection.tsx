import { SITE } from '@/shared/config'
import { SectionHeader } from '@/shared/ui'

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

export function HistorySection() {
  const historyGroups = groupByYear(SITE.about.history.items)

  return (
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
  )
}
