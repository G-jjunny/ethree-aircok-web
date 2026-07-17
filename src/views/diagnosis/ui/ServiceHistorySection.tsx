import { connection } from 'next/server'
import { getTimelineListServer, type TimelineItem } from '@/entities/timeline'
import { SITE } from '@/shared/config'
import { SectionLabel } from '@/shared/ui'

const COPY = {
  title: '공기질관리 전문기업, 에어콕',
  eyebrow: 'HISTORY',
} as const

/** 연도별로 병합된 한 행. content 는 같은 연도의 모든 항목을 ' · '로 합친 값. */
type YearRow = { year: number; content: string }

/**
 * {year, content} 목록을 **연도 오름차순** 한 행으로 그룹핑한다.
 * 같은 연도의 여러 항목 content 를 ' · '로 병합한다(시안의 "연도 | 통합 내용" 행 형태).
 *
 * 입력 순서에 의존하지 않도록 연도 오름차순만 보장하고, 같은 연도 내 병합 순서는
 * 입력 순서를 따른다(서버 정렬: year desc→month desc → 연도 내에서는 늦은 달이 앞).
 */
function groupByYearAsc(items: { year: number; content: string }[]): YearRow[] {
  const map = new Map<number, string[]>()
  for (const item of items) {
    const bucket = map.get(item.year)
    if (bucket) bucket.push(item.content)
    else map.set(item.year, [item.content])
  }
  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([year, contents]) => ({ year, content: contents.join(' · ') }))
}

/**
 * 에어콕 연혁 타임라인 — **async 서버 컴포넌트**(데이터).
 *
 * timeline 엔티티의 서버 페처로 조회 후 연도별로 그룹핑해 플랫 행으로 렌더한다.
 * 백엔드 미가용/빈 응답 시 SITE.about.history.items 폴백으로 동일 그룹핑한다.
 * about HistoryTimeline(아코디언)과 표현이 달라 재사용하지 않고 이 페이지 전용으로 구현.
 */
export async function ServiceHistorySection() {
  await connection()

  let items: TimelineItem[] = []
  try {
    items = await getTimelineListServer()
  } catch {
    items = []
  }

  const rows =
    items.length > 0
      ? groupByYearAsc(
          items.map((item) => ({ year: item.year, content: item.content })),
        )
      : groupByYearAsc(
          SITE.about.history.items.map((item) => ({
            year: item.year,
            content: item.event,
          })),
        )

  return (
    <div className="mt-18">
      <div className="flex flex-wrap items-baseline gap-3.5">
        <h3 className="text-subtitle font-extrabold tracking-headline text-ink">
          {COPY.title}
        </h3>
        <SectionLabel color="brand" size="sm">
          {COPY.eyebrow}
        </SectionLabel>
      </div>

      <div className="mt-7.5 flex flex-col">
        {rows.map((row) => (
          <div
            key={row.year}
            className="grid grid-cols-[72px_1fr] gap-6.5 border-t border-hairline py-5.5 last:border-b sm:grid-cols-[96px_1fr]"
          >
            <div className="font-display text-subtitle font-extrabold text-brand">
              {row.year}
            </div>
            <div className="text-sm leading-loose text-ink">{row.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
