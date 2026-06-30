'use client'

import { useQuery } from '@tanstack/react-query'
import { SITE } from '@/shared/config'
import { SectionHeader } from '@/shared/ui'
import { timelineListQueryOptions } from '@/entities/timeline'
import type { TimelineItem } from '@/entities/timeline'

/**
 * 화면 표시용 정규화 이벤트.
 * API(month: number)와 SITE 폴백(month: "01월" 문자열)을 동일 형태로 일원화한다.
 */
interface NormalizedEvent {
  /** 정렬용 월 숫자 (1~12) */
  monthNum: number
  /** 표시용 월 라벨 ("1월" 등) */
  monthLabel: string
  content: string
}

type FallbackItem = (typeof SITE.about.history.items)[number]

/** SITE 폴백 month 문자열("01월")에서 숫자를 추출한다. */
function parseFallbackMonth(month: string): number {
  const n = parseInt(month, 10)
  return Number.isNaN(n) ? 0 : n
}

function normalizeFromApi(items: TimelineItem[]): (NormalizedEvent & { year: number })[] {
  return items.map((item) => ({
    year: item.year,
    monthNum: item.month,
    monthLabel: `${item.month}월`,
    content: item.content,
  }))
}

function normalizeFromFallback(items: readonly FallbackItem[]): (NormalizedEvent & { year: number })[] {
  return items.map((item) => {
    const monthNum = parseFallbackMonth(item.month)
    return {
      year: item.year,
      monthNum,
      monthLabel: `${monthNum}월`,
      content: item.event,
    }
  })
}

/**
 * 연도 내림차순, 연 그룹 내 월 내림차순으로 묶는다.
 */
function groupByYear(
  items: { year: number; monthNum: number; monthLabel: string; content: string }[],
): { year: number; events: NormalizedEvent[] }[] {
  const map = new Map<number, NormalizedEvent[]>()
  for (const item of items) {
    if (!map.has(item.year)) map.set(item.year, [])
    map.get(item.year)!.push({
      monthNum: item.monthNum,
      monthLabel: item.monthLabel,
      content: item.content,
    })
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, events]) => ({
      year,
      events: events.sort((a, b) => b.monthNum - a.monthNum),
    }))
}

export function HistorySection() {
  const { data, isError } = useQuery(timelineListQueryOptions())

  const useApiData = !isError && Array.isArray(data) && data.length > 0

  const historyGroups = useApiData
    ? groupByYear(normalizeFromApi(data))
    : groupByYear(normalizeFromFallback(SITE.about.history.items))

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
              <div className="self-start pb-6 md:sticky md:top-24">
                <p className="text-[28px] font-bold leading-none text-aircok-blue sm:text-[40px]">
                  {group.year}
                </p>
                <p className="mt-1.5 text-xs font-medium text-secondary-dark">
                  {group.events.length}건
                </p>
              </div>
              {/* 이벤트 컬럼 + 레일 */}
              <div className="relative pb-6">
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-1 top-1.5 w-px bg-border-light"
                />
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1 h-2.5 w-2.5 rounded-pill bg-aircok-blue ring-4 ring-surface-white"
                />
                <ul className="flex flex-col gap-3 pl-8">
                  {group.events.map((event, idx) => (
                    <li
                      key={`${event.monthLabel}-${idx}`}
                      className="relative flex gap-4 [word-break:keep-all]"
                    >
                      {/* token 없음: 이벤트 노드를 레일 중심(pl-8 기준 -27px)에 맞추는 1회성 정렬 오프셋 */}
                      <span
                        aria-hidden="true"
                        className="absolute -left-[27px] top-2 h-1.5 w-1.5 rounded-pill bg-border-light"
                      />
                      <span className="w-12 shrink-0 pt-0.5 text-sm font-semibold tabular-nums text-secondary-dark">
                        {event.monthLabel}
                      </span>
                      <span className="text-[17px] leading-[1.65] text-body-dark">
                        {event.content}
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
