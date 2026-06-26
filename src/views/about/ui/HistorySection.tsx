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
    <section className="bg-surface-white py-24">
      <div className="content-container flex flex-col gap-14">
        <SectionHeader
          label={SITE.about.history.label}
          title={SITE.about.history.title}
          theme="light"
        />
        {/* History Timeline (Spine 변형) — 연도 컬럼 + 연속 레일 + 노드 */}
        <ol className="flex flex-col">
          {historyGroups.map((group) => (
            <li
              key={group.year}
              className="grid grid-cols-[88px_1fr] gap-6 md:grid-cols-[120px_1fr] md:gap-10"
            >
              {/* 연도 컬럼 (데스크탑 sticky) */}
              <div className="self-start pb-10 md:sticky md:top-24">
                <p className="text-[28px] font-bold leading-none text-aircok-blue sm:text-[40px]">
                  {group.year}
                </p>
                <p className="mt-1.5 text-xs font-medium text-secondary-dark">
                  {group.events.length}건
                </p>
              </div>
              {/* 이벤트 컬럼 + 레일 */}
              <div className="relative pb-10">
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-1 top-1.5 w-px bg-border-light"
                />
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1 h-2.5 w-2.5 rounded-pill bg-aircok-blue ring-4 ring-surface-white"
                />
                <ul className="flex flex-col gap-5 pl-8">
                  {group.events.map((event, idx) => (
                    <li
                      key={`${event.month}-${idx}`}
                      className="relative flex gap-4 [word-break:keep-all]"
                    >
                      {/* token 없음: 이벤트 노드를 레일 중심(pl-8 기준 -27px)에 맞추는 1회성 정렬 오프셋 */}
                      <span
                        aria-hidden="true"
                        className="absolute -left-[27px] top-2 h-1.5 w-1.5 rounded-pill bg-border-light"
                      />
                      <span className="w-12 shrink-0 pt-0.5 text-sm font-semibold tabular-nums text-secondary-dark">
                        {event.month}
                      </span>
                      <span className="text-[17px] leading-[1.65] text-body-dark">
                        {event.event}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
