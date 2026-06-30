'use client'

import { useEffect, useRef } from 'react'
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

/** 연도 → 월 2단계 묶음 결과 */
interface MonthGroup {
  monthNum: number
  monthLabel: string
  contents: string[]
}

interface YearGroup {
  year: number
  /** 월 내림차순 정렬 */
  months: MonthGroup[]
  /** 연도 내 전체 이벤트 수 */
  eventCount: number
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
 * 연도 내림차순, 연도 그룹 내 월 내림차순으로 2단계 묶음을 생성한다.
 */
function groupByYear(
  items: { year: number; monthNum: number; monthLabel: string; content: string }[],
): YearGroup[] {
  // year → Map<monthNum, { monthLabel, contents[] }>
  const yearMap = new Map<number, Map<number, { monthLabel: string; contents: string[] }>>()

  for (const item of items) {
    if (!yearMap.has(item.year)) {
      yearMap.set(item.year, new Map())
    }
    const monthMap = yearMap.get(item.year)!
    if (!monthMap.has(item.monthNum)) {
      monthMap.set(item.monthNum, { monthLabel: item.monthLabel, contents: [] })
    }
    monthMap.get(item.monthNum)!.contents.push(item.content)
  }

  return Array.from(yearMap.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, monthMap]) => {
      const months: MonthGroup[] = Array.from(monthMap.entries())
        .sort(([a], [b]) => b - a)
        .map(([monthNum, { monthLabel, contents }]) => ({ monthNum, monthLabel, contents }))

      const eventCount = months.reduce((sum, m) => sum + m.contents.length, 0)

      return { year, months, eventCount }
    })
}

export function HistorySection() {
  const { data, isError } = useQuery(timelineListQueryOptions())

  const useApiData = !isError && Array.isArray(data) && data.length > 0

  const historyGroups = useApiData
    ? groupByYear(normalizeFromApi(data))
    : groupByYear(normalizeFromFallback(SITE.about.history.items))

  // IntersectionObserver: 각 연도 그룹 li가 뷰포트에 진입할 때 fade-in + slide-up
  const groupRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    groupRefs.current.forEach((el) => {
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.remove('opacity-0', 'translate-y-4')
            el.classList.add('opacity-100', 'translate-y-0')
            observer.disconnect()
          }
        },
        { threshold: 0.1 },
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => {
      observers.forEach((o) => o.disconnect())
    }
  }, [historyGroups])

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
          {historyGroups.map((group, groupIdx) => (
            <li
              key={group.year}
              ref={(el) => { groupRefs.current[groupIdx] = el }}
              className="grid grid-cols-[88px_1fr] gap-6 opacity-0 translate-y-4 transition-all duration-500 ease-out md:grid-cols-[120px_1fr] md:gap-10"
            >
              {/* 연도 컬럼 (데스크탑 sticky) */}
              {/* token 없음: md:top-24 — Nav 높이(52px) + 여유 여백(44px) 합산 1회성 sticky 오프셋 */}
              <div className="self-start pb-6 md:sticky md:top-24">
                <p className="text-[28px] font-bold leading-none text-aircok-blue sm:text-[40px]">
                  {group.year}
                </p>
                <p className="mt-1.5 text-xs font-medium text-secondary-dark">
                  {group.eventCount}건
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
                {/* 월 2단계 묶음 */}
                <div className="flex flex-col gap-4 pl-8">
                  {group.months.map((monthGroup) => (
                    <div key={monthGroup.monthNum}>
                      <p className="mb-2 text-sm font-bold text-aircok-blue">
                        {monthGroup.monthLabel}
                      </p>
                      <ul className="flex flex-col gap-3">
                        {monthGroup.contents.map((content, idx) => (
                          <li
                            key={`${monthGroup.monthNum}-${idx}`}
                            className="relative flex [word-break:keep-all]"
                          >
                            {/* token 없음: 이벤트 노드를 레일 중심(pl-8 기준 -27px)에 맞추는 1회성 정렬 오프셋 */}
                            <span
                              aria-hidden="true"
                              className="absolute -left-[27px] top-2 h-1.5 w-1.5 rounded-pill bg-border-light"
                            />
                            {/* token 없음: text-[17px] — Tailwind 기본 scale에 없는 Body(17px) 크기, design.md Body 타이포 규칙 */}
                            <span className="text-[17px] leading-[1.65] text-body-dark">
                              {content}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
