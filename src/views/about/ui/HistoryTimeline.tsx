'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SITE } from '@/shared/config'
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

/**
 * 연혁 타임라인 인터랙션 leaf.
 * 서버에서 조회한 timelines를 props로 받아, 비어 있으면 SITE 폴백으로 정규화한다.
 * 아코디언(펼침 연도 Set) + IntersectionObserver fade-in을 소유한다.
 *
 * 반응형 구조: 모바일(<sm)은 1열 스택 — 연도 헤더 행(전폭 터치 영역, min-h-11=44px)
 * 아래에 이벤트 목록이 전폭(≈282px@360)으로 펼쳐진다. 기존 2칼럼 그리드를 모바일에
 * 유지하면 이벤트 가용폭이 ~190px로 좁아져 월 항목이 3~5자 단위로 잘게 개행되는
 * 판독성 문제가 있었다. 레일/노드 장식은 sm 미만에서 숨기고 이벤트별 최소 도트
 * 인디케이터만 남긴다. sm 이상은 기존 2칼럼(sticky 연도, 레일·노드, minmax 가드)
 * 구조를 완전 복원한다.
 */
export function HistoryTimeline({ timelines }: { timelines: TimelineItem[] }) {
  const useApiData = Array.isArray(timelines) && timelines.length > 0

  const historyGroups = useApiData
    ? groupByYear(normalizeFromApi(timelines))
    : groupByYear(normalizeFromFallback(SITE.about.history.items))

  // 아코디언: 펼쳐진 연도 집합. 기본값은 최신 연도(historyGroups[0])만 펼침.
  const latestYear = historyGroups[0]?.year
  const [expandedYears, setExpandedYears] = useState<Set<number>>(() =>
    latestYear !== undefined ? new Set([latestYear]) : new Set(),
  )

  const toggleYear = (year: number) => {
    setExpandedYears((prev) => {
      const next = new Set(prev)
      if (next.has(year)) {
        next.delete(year)
      } else {
        next.add(year)
      }
      return next
    })
  }

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
    // History Timeline (Spine 변형) — 모바일 1열 스택 / sm+ 연도 컬럼 + 연속 레일 + 노드
    <ol className="flex flex-col">
      {historyGroups.map((group, groupIdx) => {
        const isOpen = expandedYears.has(group.year)
        return (
          <li
            key={group.year}
            ref={(el) => { groupRefs.current[groupIdx] = el }}
            // 모바일: flex 1열 스택(연도 헤더 행 → 이벤트 전폭). sm+ 2칼럼 그리드 복원.
            // 연도 열 minmax(88px,max-content): sm~md 구간에서 fluid text-h3 연도(≈38px)+셰브론이
            // 고정 88px를 넘으면 열이 내용만큼 늘어나 우측 레일·노드와 겹치지 않게 한다
            className="flex flex-col opacity-0 translate-y-4 transition-all duration-500 ease-out sm:grid sm:grid-cols-[minmax(88px,max-content)_1fr] sm:gap-6 md:grid-cols-[120px_1fr] md:gap-10"
          >
            {/* 연도 헤더 — 클릭 시 해당 연도 아코디언 토글.
                모바일: 전폭 가로 행(연도+N건 좌 / 셰브론 우), min-h-11(44px) 터치 영역.
                sm+: 기존 연도 컬럼(세로 스택, 데스크탑 sticky) 복원.
                top-24(96px) 오프셋 = Nav 높이 + 여백 확보(표준 스페이싱 토큰) */}
            <button
              type="button"
              id={`history-year-header-${group.year}`}
              onClick={() => toggleYear(group.year)}
              aria-expanded={isOpen}
              aria-controls={`history-year-${group.year}`}
              className="group flex min-h-11 w-full items-center justify-between gap-2 rounded-btn py-2 text-left cursor-pointer transition-colors hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:min-h-0 sm:items-start sm:self-start sm:py-0 sm:pb-6 md:sticky md:top-24 md:p-2"
            >
              <span className="flex items-baseline gap-2 sm:flex-col sm:items-stretch sm:gap-0">
                <span className="font-display text-h3 font-extrabold leading-none text-brand">
                  {group.year}
                </span>
                <span className="text-meta font-medium text-muted sm:mt-1.5">
                  {group.eventCount}건
                </span>
              </span>
              <ChevronDown
                aria-hidden="true"
                className={`h-5 w-5 shrink-0 text-muted transition-transform duration-300 ease-in-out group-hover:text-brand sm:mt-1 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
              />
            </button>
            {/* 이벤트 컬럼 — 모바일은 헤더 아래 전폭, 레일/노드 장식은 sm+ 전용 */}
            <div className="relative pb-6">
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-1 top-1.5 hidden w-px bg-hairline sm:block"
              />
              <span
                aria-hidden="true"
                className="absolute left-0 top-1 hidden h-2.5 w-2.5 rounded-pill bg-brand ring-4 ring-surface sm:block"
              />
              {/* 아코디언 콘텐츠 — grid-rows 트릭으로 높이 애니메이션 (max-h 아님) */}
              <div
                id={`history-year-${group.year}`}
                role="region"
                aria-labelledby={`history-year-header-${group.year}`}
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  {/* 월 2단계 묶음 — 모바일 pl-0(전폭 판독)+pt-2, sm+ 레일 우측 pl-8 복원 */}
                  <div className="flex flex-col gap-4 pt-2 sm:pl-8 sm:pt-0">
                    {group.months.map((monthGroup) => (
                      <div key={monthGroup.monthNum}>
                        <p className="mb-2 text-sm font-bold text-brand">
                          {monthGroup.monthLabel}
                        </p>
                        <ul className="flex flex-col gap-3">
                          {monthGroup.contents.map((content, idx) => (
                            <li
                              key={`${monthGroup.monthNum}-${idx}`}
                              className="relative flex pl-3.5 [word-break:keep-all] sm:pl-0"
                            >
                              {/* 모바일: 좌측 최소 도트 인디케이터(left-0, li pl-3.5 들여쓰기).
                                  token 없음: sm+ 이벤트 노드를 레일 중심(pl-8 기준 -27px)에 맞추는 1회성 정렬 오프셋 */}
                              <span
                                aria-hidden="true"
                                className="absolute left-0 top-2 h-1.5 w-1.5 rounded-pill bg-hairline sm:-left-[27px]"
                              />
                              <span className="text-base leading-relaxed text-ink-soft">
                                {content}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
